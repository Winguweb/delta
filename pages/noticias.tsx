import { NewsPost } from '@prisma/client';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import axiosFromServerSideProps from '../utils/axiosFromServerSideProps';
import moment from 'moment';
import MainContainer from '../components/organisms/MainContainer';
import Text from '../components/molecules/Text';
import { Pill } from '../components/atoms/Pill';

interface NewsPostProps {
  newsPosts: NewsPostCardProps[];
}

export interface NewsPostCardProps {
  id?: string;
  title: string;
  description: string;
  startDate: string;
}

const NewsPostCard: React.FC<NewsPostCardProps> = ({ title, description, startDate }) => {
  return (
    <div className="p-6 w-full flex flex-col space-y-3 overflow-hidden rounded-2xl border-2 my-6">
      <div className="space-y-1">
        <div className="flex justify-between">
          <Text as="h4">{title}</Text>
          <Pill type="tertiary" className="pt-2">{startDate}</Pill>
        </div>

        <div className="flex space-x-1 items-start justify-between max-h-[514px] scroll-style overflow-auto lg:max-h-fit">
          <Text as="p1">{description}</Text>
        </div>
      </div>
    </div>
  );
};

const NewsPost: NextPage<NewsPostProps> = ({ newsPosts }) => {
  return (
    <div className={'flex flex-wrap flex-grow content-start justify-center lg:bg-main-image lg:bg-white'}>
      <Head>
        <title>Delta - Noticias</title>
      </Head>
      <MainContainer className={'w-full h-screen lg:h-full lg:w-3/5 lg:mx-4 mt-4 pt-8 lg:flex-grow-0'}>
        <Text as="h2" className="mx-5 text-center">
          Noticias
        </Text>

        {newsPosts.length ? (
          newsPosts.map((newsPostFound) => {
            return (
              <div className="w-full px-4" key={newsPostFound.id ?? newsPostFound.title ?? newsPostFound.startDate}>
                <NewsPostCard {...newsPostFound} />
              </div>
            );
          })
        ) : (
          <Text as="p1" className="text-center">
            No hay noticias
          </Text>
        )}
      </MainContainer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<NewsPostProps> = async (
  ctx
) => {
  const newsPosts: NewsPost[] = await (
    await axiosFromServerSideProps(ctx)
  )
    .get(`${process.env.BASE_URL}/api/news-posts`, {
      params: {
        take: 5,
        'omit-finished': true,
        'omit-not-started': true,
      },
    })
    .then((res) => res.data);
  
    
  return {
    props: {
      newsPosts: newsPosts.map((newsPostItem) => ({
        title: newsPostItem.title,
        description: newsPostItem.description,
        startDate: moment(newsPostItem.startDate).utc().format('DD/MM/yyyy'),
      })),
    },
  };
};

export default NewsPost;
