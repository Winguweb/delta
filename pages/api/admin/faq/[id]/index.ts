import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import availableMethodsHandler from '../../../../../utils/availableMethodsHandler';
import { prismaClient } from '../../../../../server/prisma/client';

const availableMethods = ['GET', 'PUT', 'DELETE'];
const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
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

  const { method } = req;

  if (method === 'DELETE') {
    await deleteHandler(req, res, id);
  }
  return;
};

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: string
): Promise<any> {
  try {
    const deletedFaq = await prismaClient.faq.delete({ where: { id: id } });

    await prismaClient.change.create({
      data: {
        title: `Faq eliminado`,
        description: `Faq con id ${id} ha sido eliminado`,
        details: {
          device: deletedFaq,
        },
      },
    });

    return res.status(204).json({ id });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;