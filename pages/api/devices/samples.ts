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
  // TODO: Store promusat data for a device on the DB
  try {
    const splitData = (req.body as string).split(';');
    const id = splitData[0];
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
          latitude: parseFloat(splitData[3]),
          longitude: parseFloat(splitData[2]),
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


    console.log(`Vessel ${id}, lat:${splitData[2]}, lng:${splitData[3]}`);
  } catch (e) {
    console.error(e);
  }
  return res.status(201).json({});
}

export default handler;
