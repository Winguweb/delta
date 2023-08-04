import { NewsPost } from '@prisma/client';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import axiosFromServerSideProps from '../../../utils/axiosFromServerSideProps';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import NewsPostForm from '../../../components/organisms/Admin/NewsPostForm';

interface ServerSideProps {
  foundNew:
    | (Omit<NewsPost, 'startDate' | 'endDate'> & {
        startDate: string;
        endDate: string;
      })
    | null;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  try {
    const foundNew = await (await axiosFromServerSideProps(ctx))
      .get(`/api/news-posts/${ctx.query.id}`)
      .then((res) => res.data);

    return {
      props: {
        foundNew: JSON.parse(JSON.stringify(foundNew)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        foundNew: null,
      },
    };
  }
};

const EditNewPage: NextPage<ServerSideProps> = ({ foundNew }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminLayout title="Editar noticia">
      {foundNew && <NewsPostForm type="update" newsPost={foundNew} />}
      {!foundNew && <h1>Error</h1>}
    </AdminLayout>
  );
};

export default EditNewPage;
