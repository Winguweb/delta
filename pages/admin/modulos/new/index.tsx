import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import { GetSamplingPointsResponse } from '../../../../model/samplingPoint';
import axiosFromServerSideProps from '../../../../utils/axiosFromServerSideProps';
import DeviceDetail from '../../../../components/organisms/Admin/DevicesAdmin/DeviceDetail';
import AdminLayout from '../../../../components/organisms/Layout/AdminLayout';

interface ServerSideProps {
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

    return {
      props: {
        samplingPoints: JSON.parse(JSON.stringify(samplingPoints)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        samplingPoints: JSON.parse(JSON.stringify(samplingPoints)),
      },
    };
  }
};

const CreateDevice: NextPage<ServerSideProps> = ({ samplingPoints }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
    <AdminLayout title="Crear módulo">
        <DeviceDetail type="create" samplingPoints={samplingPoints}/>
    </AdminLayout>
  );
};

export default CreateDevice;
