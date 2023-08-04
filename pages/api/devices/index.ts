import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { Prisma } from '@prisma/client';
import { GetDevicesResponse, createDeviceSchema } from '../../../model/device';
import { ZodError, z } from 'zod';
import getUserDataFromReq from '../../../utils/getUserDataFromReq';

const availableMethods = ['GET', 'POST'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const { method } = req;

  if (method === 'GET') {
    let where: Prisma.DeviceWhereInput = {};

    const query = req.query.query as string | undefined;

    if (query) {
      where = {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            id: {
              equals: Number(query) ? Number(query) : undefined,
            },
          },
        ],
      };
    }

    const devices: GetDevicesResponse = await prismaClient.device.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        components: true,
        owner: {
          select: {
            organizationName: true,
          }
        }
      }
    });
    res.status(200).json(devices);
    return;
  }

  if (method === 'POST') {
    try {
      createDeviceSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({ error: (error as ZodError).issues });
    }

    const body = req.body as z.infer<typeof createDeviceSchema>;    

    const { samplingPointId, ...rest } = body;

    const user = await getUserDataFromReq(req);

    if (!user) {
      return res.status(400).json({ error: 'Request must be done with a token containing user data' });
    }

    try {
      const device = await prismaClient.device.create({
        data: {
          samplingPoint: samplingPointId ? {
            connect: {
              id: samplingPointId,
            }
          } : undefined,
          owner: {
            connect: {
              id: user.id
            }
          },
          ...rest,
        }
      });

      await prismaClient.change.create({
        data: {
          title: `Módulo creado`,
          description: `Se ha agregado un módulo`,
          details: {
            device: JSON.stringify(device),
          },
        },
      });

      return res.status(201).json(device);
    } catch(e) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default handler;
