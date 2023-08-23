import { PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { NewsPost, NewsPostStatus } from '@prisma/client';
import { compareAsc } from 'date-fns';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import axiosFromServerSideProps from '../../../utils/axiosFromServerSideProps';
import moment from 'moment';
import { Button } from '../../../components/molecules/Buttons/Button';
import Text from '../../../components/molecules/Text';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import IconButton from '../../../components/molecules/Buttons/IconButton';
import Table from '../../../components/organisms/Table';

interface ServerSideProps {
  news: NewsPost[];
}

interface StatusTagProps {
  status: NewsPostWithFinished['status'];
}

interface NewsPostWithFinished extends Omit<NewsPost, 'status'> {
  status: NewsPostStatus | 'FINISHED';
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  try {
    const news = await (await axiosFromServerSideProps(ctx))
      .get(`/api/news-posts`)
      .then((res) => res.data);

    return {
      props: {
        news: JSON.parse(JSON.stringify(news)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        news: [],
      },
    };
  }
};

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const label = {
    [NewsPostStatus.DRAFT]: 'Borrador',
    [NewsPostStatus.PUBLISHED]: 'Publicada',
    FINISHED: 'Vencida',
  }[status];

  const borderColor = {
    [NewsPostStatus.DRAFT]: 'border-light-gray',
    [NewsPostStatus.PUBLISHED]: 'border-primary',
    FINISHED: 'border-danger',
  }[status];

  const textColor = {
    [NewsPostStatus.DRAFT]: 'text-black',
    [NewsPostStatus.PUBLISHED]: 'text-primary',
    FINISHED: 'text-danger',
  }[status];

  const bgColor = {
    [NewsPostStatus.DRAFT]: 'bg-light-gray',
    [NewsPostStatus.PUBLISHED]: 'bg-white',
    FINISHED: 'bg-white',
  }[status];

  return (
    <div
      className={`rounded-3xl border px-2 py-1 flex justify-center h-fit ${borderColor} ${textColor} ${bgColor}`}
    >
      {label}
    </div>
  );
};

const NewsPostsAdminPage: NextPage<ServerSideProps> = ({ news }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const finishedNewsPosts: NewsPostWithFinished[] = news
    .filter((n) => {
      const isFinished =
        n.status === 'PUBLISHED' &&
        compareAsc(new Date(), new Date(n.endDate)) === 1;
      return isFinished;
    })
    .map((n) => ({ ...n, status: 'FINISHED' }));

  const activeNewsPosts: NewsPostWithFinished[] = news.filter((n) => {
    const isActive = finishedNewsPosts.every((fn) => fn.id !== n.id);
    return isActive;
  });

  return (
    <AdminLayout
      title="Noticias"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex w-full justify-between">
          <Text as="h3">Noticias</Text>

          <Link href="news-posts/add">
            <Button
              icon={<PlusCircleIcon />}
              variant="quaternary"
              iconSize="small"
              iconClassName={'bg-inherit'}
            >
              Nueva noticia
            </Button>
          </Link>
        </div>
        <div className="px-4 bg-white rounded-xl overflow-x-auto">
          {(activeNewsPosts || finishedNewsPosts) ?
            <Table
              data={[...activeNewsPosts, ...finishedNewsPosts]}
              cells={['status', 'title', 'description', 'startDate', 'endDate']}
              headers={[
                {
                  label: 'Estado',
                  key: 'status',
                },
                {
                  label: 'Título',
                  key: 'title',
                },
                {
                  label: 'Descripción',
                  key: 'description',
                },
                {
                  label: 'Fecha de inicio',
                  key: 'startDate',
                },
                {
                  label: 'Fecha de finalización',
                  key: 'endDate',
                },
                {
                  label: 'Editar',
                  isAction: true,
                  key: 'edit',
                },
              ]}
              actions={[
                ({ data }) => (
                  <Link href={`news-posts/${(data as NewsPost).id}`}>
                    <IconButton
                      icon={<PencilIcon />}
                      iconSize="xxs"
                      variant="primary-admin"
                    />
                  </Link>
                ),
              ]}
              formatCell={[
                {
                  condition: (key) => key === 'status',
                  component: ({ value }) => (
                    <StatusTag status={value as NewsPostStatus} />
                  ),
                },
                {
                  condition: (key) => key === 'description',
                  component: ({ value }) => (
                    <div className="text-ellipsis truncate w-[150px] overflow-hidden">
                      {value}
                    </div>
                  ),
                },
                {
                  condition: (key) => key === 'startDate' || key === 'endDate',
                  component: ({ value }) => {
                    // Get date string
                    const valueSubstring = value.substring(0, 10);
                    // Convert to date
                    const date = new Date(valueSubstring);
                    // Format date
                    const formattedDate = moment(date).utc().format('DD/MM/yyyy');
                    return <div className="p-0 lg:pl-4">{formattedDate}</div>;
                  },
                },
              ]}
            />
            :
            (
              <Text as="p2" className='mx-4 p-4'>
                No hay noticias
              </Text>
            )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsPostsAdminPage;
