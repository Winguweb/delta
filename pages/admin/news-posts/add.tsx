import { NextPage } from 'next';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import NewsPostForm from '../../../components/organisms/Admin/NewsPostForm';
const CreateNewPage: NextPage = (props) => {
  return (
    <AdminLayout
      backButton={{
        redirectTo: '/admin/news-posts',
      }}
      title="Crear noticia"
    >
      <NewsPostForm type="create" />
    </AdminLayout>
  );
};

export default CreateNewPage;
