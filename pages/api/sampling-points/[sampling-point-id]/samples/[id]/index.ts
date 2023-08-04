import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import availableMethodsHandler from '../../../../../../utils/availableMethodsHandler';
import { prismaClient } from '../../../../../../server/prisma/client';
import {
  updateSampleSchema,
} from '../../../../../../model/sample';
import getUserDataFromReq from '../../../../../../utils/getUserDataFromReq';
import { ZodError, z } from 'zod';
import { Prisma, Sample } from '@prisma/client';
import { transformMeasurementValuesForPrisma } from '../../../../../../utils/measurementValues';

const availableMethods = ['GET', 'PUT', 'DELETE'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const samplingPointId = req.query['sampling-point-id'] as string;
  const sampleIdParam = req.query['id'] as string;
  const sampleId = parseInt(sampleIdParam, 10); 

  if (!samplingPointId) {
    res.status(400).json({ error: `Missing sampling point id` });
    return;
  }

  if (typeof samplingPointId !== 'string') {
    res.status(400).json({ error: `Sampling point id must be a string` });
    return;
  }

  if (!sampleId) {
    res.status(400).json({ error: `Missing sample id` });
    return;
  }
  
  if (typeof sampleId !== 'number') {
    res.status(400).json({ error: `Sample id must be a number` });
    return;
  }

  const { method } = req;

  if (method === 'GET') {
    await getHandler(req, res, sampleId);
  }

  if (method === 'PUT') {
    await putHandler(req, res, sampleId);
  }

  if (method === 'DELETE') {
    await deleteHandler(req, res, sampleId);
  }
  return;
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: number
): Promise<any> {
  try {
    const sample = await prismaClient.sample.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        device: true,
        latitude: true,
        longitude: true,
        takenBy: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            organizationName: true,
          },
        },
        takenAt: true,
        measurementValues: {
          select: {
            parameter: true,
            value: true,
          },
        },
      },
    });

    if (sample) {
      return res.status(200).json(sample);
    } else {
      return res.status(404).json({ error: `Sample with id ${id} not found` });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function putHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: number
): Promise<any> {

  try {    
    updateSampleSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).issues });
  }

  const body = req.body as z.infer<typeof updateSampleSchema>;

  
  const {  deviceId, latitude, longitude, measurementValues, takenAt } = body;

  
  const user = await getUserDataFromReq(req);

  if (!user) {
    return res.status(400).json({
      error: 'Request must be done with a token containing user data',
    });
  }

  try {
    const oldSample: Sample | null = await prismaClient.sample.findUnique({
      where: { id: id },
    });

    if (!oldSample) {
      return res.status(404).json({ error: `Sample with id ${id} not found` });
    }

    const updatedSample = await prismaClient.sample.update({
      where: {
        id: id,
      },
      data: {
        deviceId: deviceId,
        latitude: latitude,
        longitude: longitude,
        measurementValues: {
          deleteMany: { sampleId: id },
          create: transformMeasurementValuesForPrisma(measurementValues),
        },
        takenAt: takenAt,
      },
    });

    const fullSample = {
      ...updatedSample,
      measurementValues: measurementValues,
    };

    await prismaClient.change.create({
      data: {
        title: `Sample updated`,
        description: `A sample with id ${id} has been updated`,
        details: {
          oldSample: JSON.stringify(oldSample),
          newSample: JSON.stringify(fullSample),
        },
      },
    });

    return res.status(200).json(fullSample);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: number
): Promise<any> {
  const user = await getUserDataFromReq(req);

  
  if (!user) {
    return res.status(400).json({
      error: 'Request must be done with a token containing user data',
    });
  }

  try {
    const sample: Sample | null = await prismaClient.sample.findUnique({
      where: { id: id },
    });

    if (!sample) {
      return res.status(404).json({ error: `Sample with id ${id} not found` });
    }

    if (sample.takenById != user.id) {
      return res
        .status(403)
        .json({ error: `User needs to be the owner of the sample` });
    }

    // Delete related measurement values before deleting the sample
    await prismaClient.sampleMeasurementValue.deleteMany({
      where: { sampleId: id },
    });

    const deletedSample = await prismaClient.sample.delete({ where: { id: id } });

    await prismaClient.change.create({
      data: {
        title: `Muestra eliminada`,
        description: `La muestra con id ${id} ha sido eliminada`,
        details: {
          sample: deletedSample,
        },
      },
    });

    return res.status(204).json({ id });
  } catch (e) {
    console.log(e);    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
