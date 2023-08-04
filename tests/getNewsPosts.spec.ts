import { NewsPost, NewsPostStatus } from '@prisma/client';
import { prismaClient } from '../server/prisma/client';
import { addDays, subDays } from 'date-fns';
import { getNewsPosts } from '../pages/api/news-posts';

const baseNewsPost: Omit<NewsPost, 'id'> = {
  title: 'Título de la noticia',
  description: 'Descripción de la noticia',
  status: NewsPostStatus.PUBLISHED,
  startDate: new Date(),
  endDate: new Date(),
};

const newsNotStartedToGenerate = 7;
const newsCurrentToGenerate = 9;
const newsFinishedToGenerate = 12;

const generateNotStartedNewsPosts = () =>
  prismaClient.newsPost.createMany({
    data: Array(newsNotStartedToGenerate).fill({
      ...baseNewsPost,
      startDate: addDays(baseNewsPost.startDate, 1),
      endDate: addDays(baseNewsPost.endDate, 2),
    }),
  });

const generateCurrentNewsPosts = () =>
  prismaClient.newsPost.createMany({
    data: Array(newsCurrentToGenerate).fill({
      ...baseNewsPost,
      startDate: subDays(baseNewsPost.startDate, 1),
      endDate: addDays(baseNewsPost.endDate, 1),
    }),
  });

const generateStartedAndFinishedNewsPosts = () =>
  prismaClient.newsPost.createMany({
    data: Array(newsFinishedToGenerate).fill({
      ...baseNewsPost,
      startDate: subDays(baseNewsPost.startDate, 2),
      endDate: subDays(baseNewsPost.endDate, 1),
    }),
  });

describe('getNewsPosts', () => {
  beforeEach(async () => {
    await prismaClient.newsPost.deleteMany();
    await generateNotStartedNewsPosts();
    await generateCurrentNewsPosts();
    await generateStartedAndFinishedNewsPosts();
  });

  afterAll(async () => {
    await prismaClient.newsPost.deleteMany();
    await prismaClient.$disconnect();
  });

  it('should return only the news that are started', async () => {
    const news = await getNewsPosts({
      omitNotStarted: true,
    });

    expect(news.length).toBe(newsCurrentToGenerate + newsFinishedToGenerate);
  });

  it('should return only the news that are not finished', async () => {
    const news = await getNewsPosts({
      omitFinished: true,
    });

    expect(news.length).toBe(newsNotStartedToGenerate + newsCurrentToGenerate);
  });

  it('should return all the news', async () => {
    const news = await getNewsPosts({});

    expect(news.length).toBe(
      newsNotStartedToGenerate + newsCurrentToGenerate + newsFinishedToGenerate
    );
  });

  it('should return only the news that are current (started and not finished)', async () => {
    const news = await getNewsPosts({
      omitNotStarted: true,
      omitFinished: true,
    });

    expect(news.length).toBe(newsCurrentToGenerate);
  });

  it('should return amount of news based on take param', async () => {
    const news = await getNewsPosts({
      take: 5,
    });

    expect(news.length).toBe(5);
  });
});
