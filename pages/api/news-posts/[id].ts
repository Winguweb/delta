import { NextApiHandler } from 'next';
import { z, ZodError } from 'zod';
import { updateNewSchema } from '../../../model/newsPost';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';

const getNewsPost = (id: string) => prismaClient.newsPost.findUnique({ where: { id } });

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['GET', 'PUT', 'DELETE'])) {
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Id must be a string' });
    return;
  }

  const foundNewsPost = await getNewsPost(id);

  if (!foundNewsPost) {
    res.status(404).json({ error: `News post with id ${id} not found` });
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(foundNewsPost);
  }

  if (req.method === 'DELETE') {
    await prismaClient.newsPost.delete({ where: { id } });

    await prismaClient.change.create({
      data: {
        title: `Noticia eliminada`,
        description: `Se ha eliminado la noticia con id ${id}`,
        details: {
          deletedNew: JSON.stringify(foundNewsPost),
        },
      },
    });

    res.status(204).json({ id });
  }

  if (req.method === 'PUT') {
    try {
      updateNewSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({ error: (error as ZodError).issues });
      return;
    }

    const body = req.body as z.infer<typeof updateNewSchema>;

    const updatedNewsPost = await prismaClient.newsPost.update({
      where: { id },
      data: Object.entries(foundNewsPost).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: body[key as keyof typeof body] || value,
        }),
        {}
      ),
    });

    await prismaClient.change.create({
      data: {
        title: `Noticia actualizada`,
        description: `Se ha actualizado la noticia con id ${id}`,
        details: {
          oldNewsPost: JSON.stringify(foundNewsPost),
          newNewsPost: JSON.stringify(updatedNewsPost),
        },
      },
    });

    res.status(200).json(updatedNewsPost);
    return;
  }
};

export default handler;
