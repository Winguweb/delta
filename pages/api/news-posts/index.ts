import { NewsPost, NewsPostStatus } from '@prisma/client';
import { NextApiHandler, NextApiRequest } from 'next';
import { z, ZodError } from 'zod';
import { createNewSchema } from '../../../model/newsPost';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { compareAsc, compareDesc } from 'date-fns';

interface GetNewsPostsOptions {
  status?: NewsPostStatus;
  omitFinished?: boolean;
  omitNotStarted?: boolean;
  take?: number;
}

export const getNewsPosts = async (options: GetNewsPostsOptions) =>
  filterNews(
    await prismaClient.newsPost.findMany({ where: { status: options.status } }),
    options
  );

const validateTake = (takeQuery: NextApiRequest['query'][string]) => {
  const take = takeQuery ? Number(takeQuery) : undefined;
  z.number().optional().parse(take);

  return take;
};

const validateStatus = (statusQuery: NextApiRequest['query'][string]) => {
  const status = statusQuery ? statusQuery : undefined;
  const schema = z.nativeEnum(NewsPostStatus).optional();
  schema.parse(status);

  return status as z.infer<typeof schema>;
};

const validateBoolean = (booleanQuery: NextApiRequest['query'][string]) => {
  const boolean = booleanQuery ? booleanQuery === 'true' : undefined;
  z.boolean().optional().parse(boolean);

  return boolean;
};

const queryToGetNewsPostsOptions = (query: NextApiRequest['query']) => {
  const take = validateTake(query.take);
  const status = validateStatus(query.status);
  const omitFinished = validateBoolean(query['omit-finished']);
  const omitNotStarted = validateBoolean(query['omit-not-started']);

  return {
    take,
    status,
    omitFinished,
    omitNotStarted,
  };
};

const filterNews = (
  news: NewsPost[],
  { take, omitFinished, omitNotStarted }: Omit<GetNewsPostsOptions, 'status'>
) => {
  return news
    .filter((item) => {
      const isFinished = compareAsc(new Date(), new Date(item.endDate)) === 1;
      const isNotStarted =
        compareAsc(new Date(), new Date(item.startDate)) === -1;

      if (omitFinished && isFinished) {
        return false;
      }

      if (omitNotStarted && isNotStarted) {
        return false;
      }

      return true;
    })
    .sort((a, b) => compareDesc(new Date(a.startDate), new Date(b.startDate)))
    .slice(0, take);
};

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['GET', 'POST'])) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const options = queryToGetNewsPostsOptions(req.query);
      const news = await getNewsPosts(options);

      res.status(200).json(news);
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ error: (e as ZodError).issues });
        return;
      }

      res.status(500).json({ error: (e as Error).message });
      return;
    }
  }

  if (req.method === 'POST') {
    try {
      createNewSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({ error: (error as ZodError).issues });
    }

    const body = req.body as z.infer<typeof createNewSchema>;

    try {
      const newNewsPost = await prismaClient.newsPost.create({
        data: body,
      });

      await prismaClient.change.create({
        data: {
          title: `Noticia creada`,
          description: `Se ha creado la noticia ${newNewsPost.title}`,
          details: {
            newsPost: JSON.stringify(newNewsPost),
          },
        },
      });

      res.status(201).json(newNewsPost);
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
};

export default handler;
