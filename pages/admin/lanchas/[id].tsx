import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import axiosFromServerSideProps from '../../../utils/axiosFromServerSideProps';
import { GetDeviceResponse } from '../../../model/device';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { UserRole } from '@prisma/client';
import LanchasDetail from '../../../components/organisms/Admin/LanchasAdmin/LanchasDetail';

interface ServerSideProps {
  device: GetDeviceResponse;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {

  try {
    const device: GetDeviceResponse = await (await axiosFromServerSideProps(ctx))
      .get(`/api/lanchas/${ctx.query.id}`)
      .then((res) => res.data);

    return {
      props: {
        device: JSON.parse(JSON.stringify(device)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { device: null },
    };
  }
};

const EditLancha: NextPage<ServerSideProps> = ({ device }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = useAuthenticatedUser(); 

  const isUserOwner = device?.owner.id === user?.id;
  const isUserAdmin = user?.role === UserRole.ADMIN
  const isAbleToPerformActions = isUserAdmin || isUserOwner;
  return (
    <AdminLayout title="Editar Lancha">
      {device && <LanchasDetail type="update" device={device} isAbleToPerformActions={isAbleToPerformActions} />}
      {!device && <h1>Error</h1>}
    </AdminLayout>
  );
};

export default EditLancha;
