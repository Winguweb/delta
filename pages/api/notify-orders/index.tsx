import { NextApiHandler } from 'next';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { createNotifyOrderSchema } from '../../../model/notifyOrder';
import { prismaClient } from '../../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['POST'])) {
    return;
  }

  if (req.method === 'POST') {
    try {
      let notifyOrderData = await createNotifyOrderSchema.validate(req.body, { abortEarly: false });

      await prismaClient.notifyOrder.create({
        data: {
          telephone: notifyOrderData.telephone,
          latitude: notifyOrderData.location.lat,
          longitude: notifyOrderData.location.lng,
        },
      });

      res.status(200).json(notifyOrderData);

    } catch (error: any) {
      res.status(400).json({ error: error.inner });
    }
  }
};

export default handler;