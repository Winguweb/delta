import AdminLayout from '../../../../components/organisms/Layout/AdminLayout';
import LanchasDetail from '../../../../components/organisms/Admin/LanchasAdmin/LanchasDetail';

const CreateLancha = () => {

  return (
    <AdminLayout title="Crear Lancha">
        <LanchasDetail type="create" />
    </AdminLayout>
  );
};

export default CreateLancha;
