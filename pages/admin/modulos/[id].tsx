import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import axiosFromServerSideProps from '../../../utils/axiosFromServerSideProps';
import { GetDeviceResponse } from '../../../model/device';
import DeviceDetail from '../../../components/organisms/Admin/DevicesAdmin/DeviceDetail';
import { GetSamplingPointsResponse } from '../../../model/samplingPoint';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { UserRole } from '@prisma/client';

interface ServerSideProps {
  device: GetDeviceResponse;
  samplingPoints: GetSamplingPointsResponse;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  let samplingPoints: GetSamplingPointsResponse = [];

  try {
    samplingPoints = await (await axiosFromServerSideProps(ctx))
    .get(`/api/sampling-points`)
    .then((res) => res.data);

    const device: GetDeviceResponse = await (await axiosFromServerSideProps(ctx))
      .get(`/api/devices/${ctx.query.id}`)
      .then((res) => res.data);

    return {
      props: {
        device: JSON.parse(JSON.stringify(device)),
        samplingPoints: JSON.parse(JSON.stringify(samplingPoints)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        device: null,
        samplingPoints: JSON.parse(JSON.stringify(samplingPoints)),
      },
    };
  }
};

const EditDevice: NextPage<ServerSideProps> = ({ device, samplingPoints }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = useAuthenticatedUser(); 

  const isUserOwner = device?.owner.id === user?.id;
  const isUserAdmin = user?.role === UserRole.ADMIN
  const isAbleToPerformActions = isUserAdmin || isUserOwner;
  return (
    <AdminLayout title="Editar módulo">
      {device && <DeviceDetail type="update" device={device} isAbleToPerformActions={isAbleToPerformActions} samplingPoints={samplingPoints}/>}
      {!device && <h1>Error</h1>}
    </AdminLayout>
  );
};

export default EditDevice;
