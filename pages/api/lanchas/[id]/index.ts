import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../../server/prisma/client';
import availableMethodsHandler from '../../../../utils/availableMethodsHandler';
import { Device, Prisma } from '@prisma/client';
import { GetDeviceResponse, updateDeviceSchema } from '../../../../model/device';
import { ZodError, z } from 'zod';
import getUserDataFromReq from '../../../../utils/getUserDataFromReq';

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

  const idAsNumber = Number(id);

  if (isNaN(idAsNumber) || !Number.isInteger(idAsNumber)) {
    return res.status(400).json({ error: 'Id must be an integer' });
  }

  const { method } = req;

  if (method === 'GET') {
    await getHandler(req, res, idAsNumber);
  }

  if (method === 'PUT') {
    await putHandler(req, res, idAsNumber);
  }

  if (method === 'DELETE') {
    await deleteHandler(req, res, idAsNumber);
  }
  return;
};

async function getHandler(req: NextApiRequest, res: NextApiResponse<any>, id: number): Promise<any> {
  try {
    const device: GetDeviceResponse | null = await prismaClient.device.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        externalId:true,
        samplingPointId: true,
        name: true,
        description: true,
        components: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizationName: true,
          }
        },
        samplingPoint: true,
      }
    });
    if (device) {
      return res.status(200).json(device);
    } else {
      return res.status(404).json({ error: `Device with id ${id} not found` });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function putHandler(req: NextApiRequest, res: NextApiResponse<any>, id: number): Promise<any> {
  try {
    updateDeviceSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).issues });
  }

  const body = req.body as z.infer<typeof updateDeviceSchema>;

  const { samplingPointId, ...rest } = body;

  const user = await getUserDataFromReq(req);

  if (!user) {
    return res.status(400).json({ error: 'Request must be done with a token containing user data' });
  }

  try {
    const oldDevice: Device | null = await prismaClient.device.findUnique({ where: { id: id } });

    if (!oldDevice) {
      return res.status(404).json({ error: `Device with id ${id} not found` });
    }

    if (oldDevice.ownerId != user.id) {
      return res.status(403).json({ error: `User needs to be the owner of the device` });
    }

    let samplingPointUpdate: Prisma.SamplingPointUpdateOneWithoutDevicesNestedInput | undefined;
    if (samplingPointId === undefined) {
      samplingPointUpdate = undefined;
    } else if (samplingPointId === null) {
      samplingPointUpdate = { disconnect: true }
    } else {
      samplingPointUpdate = { connect: { id: samplingPointId } }
    }

    const newDevice: Device = await prismaClient.device.update({
      where: {
        id: id,
      },
      data: {
        samplingPoint: samplingPointUpdate,
        ...rest,
      }
    });

    await prismaClient.change.create({
      data: {
        title: `Módulo actualizado`,
        description: `Se ha actualizado un módulo con id ${id}`,
        details: {
          oldDevice: JSON.stringify(oldDevice),
          newDevice: JSON.stringify(newDevice),
        },
      },
    });

    return res.status(200).json(newDevice);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse<any>, id: number): Promise<any> {
  const user = await getUserDataFromReq(req);

  if (!user) {
    return res.status(400).json({ error: 'Request must be done with a token containing user data' });
  }

  try {
    const device: Device | null = await prismaClient.device.findUnique({ where: { id: id } });

    if (!device) {
      return res.status(404).json({ error: `Device with id ${id} not found` });
    }

    if (device.ownerId != user.id) {
      return res.status(403).json({ error: `User needs to be the owner of the device` });
    }

    // Hay que borrar los samples y el sampling point para borrar la lancha
    await prismaClient.sample.deleteMany({ where: { takenById: device.ownerId } });

    // @ts-ignore
    await prismaClient.samplingPoint.delete({where: {id: device.samplingPointId}});

    const deletedDevice = await prismaClient.device.delete({ where: { id: id } });

    await prismaClient.change.create({
      data: {
        title: `Módulo eliminado`,
        description: `El módulo con id ${id} ha sido eliminado`,
        details: {
          device: deletedDevice,
        },
      },
    });

    return res.status(204).json({ id });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
      return res.status(409).json({ error: 'Foreign key conflict' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
