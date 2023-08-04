import axios from 'axios';
import { UserRole } from '@prisma/client';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import axiosFromServerSideProps from '../../../utils/axiosFromServerSideProps';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { GetSamplingPointResponse } from '../../../model/samplingPoint';
import { GetSampleResponse } from '../../../model/sample'
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import Text from '../../../components/molecules/Text';
import Tabs from '../../../components/molecules/Tabs';
import { GetDeviceResponse } from '../../../model/device';
import { DetailsTab, DevicesTab, SamplesTab } from '../../../components/organisms/Admin/SamplingPointsAdmin';
import { GetUserResponse } from '../../../model/user';
import { Button } from '../../../components/molecules/Buttons/Button';
import { IconTrash } from '../../../assets/icons';


export interface GetSamplingPointResponseWithSamples extends GetSamplingPointResponse {
  samples: GetSampleResponse[];
  devices: GetDeviceResponse[]
}

interface ServerSideProps {
  samplingPoint: GetSamplingPointResponseWithSamples;
  users: GetUserResponse[];
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const { id } = ctx.query;

  try {
    const samplingPointWithSamples: GetSamplingPointResponseWithSamples = await (await axiosFromServerSideProps(ctx))
      .get(`/api/sampling-points/${id}`, { params: { withDevices: true } })
      .then(async (res) => {
        // Include the samples data in the samplingPoint object
        const samplingPoint = res.data;
        const samples = await (
          await axiosFromServerSideProps(ctx)
        )
          .get(`/api/sampling-points/${id}/samples`)
          .then((res) => res.data.samples);

        return {
          ...samplingPoint,
          samples: samples,
        };
      });

    const users = await (
      await axiosFromServerSideProps(ctx)
    )
      .get(`/api/admin/users`, {
      })
      .then((res) => res.data);

    return {
      props: {
        samplingPoint: JSON.parse(JSON.stringify(samplingPointWithSamples)),
        users: JSON.parse(JSON.stringify(users)),

      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const EditSamplingPointPage: NextPage<ServerSideProps> = ({ samplingPoint, users }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const user = useAuthenticatedUser();

  const availableUsersToDelete = ['ADMIN'];
  const isAbleToDelete = availableUsersToDelete.includes(user?.role ?? '');
  const isUserOwner = samplingPoint.ownerId === user?.id;
  const isUserAdmin = user?.role === UserRole.ADMIN
  const isAbleToPerformActions = isUserAdmin


  const handleDelete = async (samplingPointId: string, resource: string, resourceId: string) => {
    const resourceType = 'sample'

    const wordingAdvices = {
      sample: '¿Estás seguro de que quieres eliminar esta muestra del punto de toma?',
    }
    const confirm = window.confirm(
      wordingAdvices[resourceType]
    );

    if (!confirm) {
      return;
    }

    try {
      await axios.delete(`/api/sampling-points/${samplingPointId}/${resource}/${resourceId}`);
      window.location.reload();
      window.alert('Recurso eliminado correctamente');
    } catch (e) {
      window.alert('Error al eliminar el recurso');
    }
  };


  return (
    <AdminLayout
      backButton={{
        redirectTo: '/admin/sampling-points',
      }}
      title={samplingPoint.name}>
      <div className="h-full flex flex-col space-y-6">
        <div className="bg-white p-6 rounded-2xl overflow-x-auto">
          {<Tabs
            headers={['Info general', 'Muestras', "Módulos autofijados"]}
            content={[
              <DetailsTab
                key="datil-tab-content"
                isAbleToPerformActions={isAbleToPerformActions}
                samplingPoint={samplingPoint}
                users={users}
              />,
              <SamplesTab
                key="sample-tab-content"
                isAbleToPerformActions={isAbleToPerformActions}
                samplingPoint={samplingPoint}
              />,
              <DevicesTab
                key="devices-tab-content"
                isAbleToPerformActions={isAbleToPerformActions}
                samplingPoint={samplingPoint}
              />,
            ]}
          />}
        </div>
      </div>
    </AdminLayout>
  );
};



export default EditSamplingPointPage;
