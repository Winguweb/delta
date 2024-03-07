import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { onSampleUpload } from '../../../server/notifier/appNotifierService';
import { prismaClient } from '../../../server/prisma/client';
import { nowWithTimezone } from '../../../utils/dates';

const availableMethods = ['POST'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const { method } = req;

  if (method === 'POST') {
    await postHandler(req, res);
  }

  return;
};


async function postHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const splitData = (req.body as string).split(';');
    const [id, date, latitude, longitude] = splitData
    const timestamp = nowWithTimezone();
    try {
      const device = (await prismaClient.device.findUnique({
        where: {
          externalId: id,
        },
      }));

      const sample = await prismaClient.sample.create({
        data: {
          device: {
            connect: {
              id: device!.id,
            },
          },
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          takenAt: timestamp,
          takenBy: {
            connect: {
              id: device!.ownerId,
            },
          },
        },
      });

      await onSampleUpload({ ...sample, name: device!.name })
    } catch (e) {
      console.log(e);
    }


    console.log(`[Samples] New Sample: `, req.body);
  } catch (e) {
    console.error(e);
  }
  return res.status(201).json({});
}

export default handler;
