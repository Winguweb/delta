import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['GET'])) return;

  const changes = await prismaClient.change.findMany();

  res.status(200).json(changes);
};

export default handler;
