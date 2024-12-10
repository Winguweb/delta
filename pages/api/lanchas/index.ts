import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { GetDevicesResponse, createDeviceSchema } from '../../../model/device';
import { ZodError, z } from 'zod';
import getUserDataFromReq from '../../../utils/getUserDataFromReq';
import bcrypt from 'bcrypt';
import { BCRYPT_COST } from '../../../config/server';
import { Prisma } from '@prisma/client';

type SamplingPointCreateInputWithOwner = Prisma.SamplingPointCreateInput & {
  owner: {
    connect: {
      id: string;
    };
  };
};

const availableMethods = ['GET', 'POST'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const { method } = req;

  if (method === 'GET') {
    const user = await getUserDataFromReq(req);

    if (!user) {
      return res.status(400).json({
        error: 'Request must be done with a token containing user data',
      });
    }

    const devices: GetDevicesResponse = await prismaClient.device.findMany({
      where: { ownerId: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        components: true,
        owner: {
          select: {
            id: true,
            organizationName: true,
          },
        },
      },
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

    const { ...rest } = body;

    const user = await getUserDataFromReq(req);

    if (!user) {
      return res
        .status(400)
        .json({
          error: 'Request must be done with a token containing user data',
        });
    }

    // SE AGREGA UN APIKEY GENERICA PARA TODAS LAS LANCHAS
    const hashedApiKey = await bcrypt.hash('UN_APIKEY_PARA_LAS_LANCHAS', BCRYPT_COST);

    try {
      // PARA PODER UTILIZAR LA "LANCHA" (DEVICE), SE TIENE QUE AGREGAR UN SAMPLING POINT
      const samplingPoint = await prismaClient.samplingPoint.create({
        data: {
          name: 'PARA_PROVEEDOR',
          latitude: 0,
          longitude: 0,
          country: 'ARGENTINA',
          waterBodyType: 'RIO',
          areaType: 'URBANO',
          owner: {
            connect: {
              id: user.id,
            },
          },
        } as SamplingPointCreateInputWithOwner,
      });

      const device = await prismaClient.device.create({
        // @ts-ignore
        data: {
          samplingPoint: samplingPoint.id
            ? {
                connect: {
                  id: samplingPoint.id,
                },
              }
            : undefined,
          owner: {
            connect: {
              id: user.id,
            },
          },
          apiKey: hashedApiKey,
          ...rest,
        },
      });

      await prismaClient.change.create({
        data: {
          title: `Lancha creada`,
          description: `Se ha agregado una Lancha`,
          details: {
            device: JSON.stringify(device),
          },
        },
      });

      return res.status(201).json(device);
    } catch (e) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default handler;
