import { NextApiHandler } from 'next';
import { z, ZodError } from 'zod';
import { prismaClient } from '../../../../../server/prisma/client';
import availableMethodsHandler from '../../../../../utils/availableMethodsHandler';
import { createSampleSchema, updateSampleSchema } from '../../../../../model/sample';
import { Device } from '@prisma/client';
import getUserDataFromReq from '../../../../../utils/getUserDataFromReq';
import { createSample, updateSample } from '../../../../../utils/samples';
import { transformMeasurementValuesForOutput } from '../../../../../utils/measurementValues';

const availableMethods = ['POST', 'GET'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const { method } = req;

  const samplingPointId = req.query['sampling-point-id'];

  if (!samplingPointId) {
    res.status(400).json({ error: `Missing sampling point id` });
    return;
  }

  if (typeof samplingPointId !== 'string') {
    res.status(400).json({ error: `sampling point id must be a string` });
    return;
  }

  const samplingPoint = await prismaClient.samplingPoint.findUnique({
    where: { id: samplingPointId },
  });

  if (!samplingPoint) {
    res.status(404).json({ error: `sampling point not found` });
    return;
  }

  if (method === 'GET') {
    const { page = 1, pageSize = 5 } = req.query;

    const pageAsNumber = Number(page);

    if (isNaN(pageAsNumber) || !Number.isInteger(pageAsNumber)) {
      res.status(400).json({ error: 'page must be an integer' });
      return;
    }

    const pageSizeAsNumber = Number(pageSize);

    if (isNaN(pageSizeAsNumber) || !Number.isInteger(pageSizeAsNumber)) {
      res.status(400).json({ error: 'pageSize must be an integer' });
      return;
    }

    const totalCount = await prismaClient.sample.count({
      where: {
        samplingPointId: samplingPointId,
      },
    });
    const totalPages = Math.ceil(totalCount / pageSizeAsNumber);
    const currentPage = pageAsNumber;

    const samples = await prismaClient.sample.findMany({
      where: {
        samplingPointId: samplingPointId,
      },
      skip: (currentPage - 1) * pageSizeAsNumber,
      take: pageSizeAsNumber,
      orderBy: { takenAt: 'desc' },
      select: {
        id: true,
        device: true,
        latitude: true,
        longitude: true,
        takenBy: {
          select: {
            id: true,
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

    const samplesOutput = samples.map(({ measurementValues, ...rest }) => ({
      measurementValues: transformMeasurementValuesForOutput(measurementValues),
      ...rest,
    }));

    res.status(200).json({
      samples: samplesOutput,
      totalCount,
      totalPages,
      currentPage,
    });
    return;
  }

  if (method === 'POST') {
    try {
      createSampleSchema.parse(req.body);
    } catch (e) {
      res.status(400).json({ error: (e as ZodError).issues });
      return;
    }

    const body = req.body as z.infer<typeof createSampleSchema>;

    let device: Device | null;
    try {
      device = await prismaClient.device.findUnique({
        where: { id: body.deviceId },
      });
    } catch (e) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!device) {
      return res
        .status(404)
        .json({ error: `Device with id ${body.deviceId} not found` });
    }

    const userParse = await getUserDataFromReq(req);

    if (userParse?.id != device.ownerId) {
      return res
        .status(403)
        .json({ error: `User needs to be the owner of the device` });
    }

    const sample = await createSample(
      device.id,
      samplingPointId,
      device.ownerId,
      body.latitude,
      body.longitude,
      body.measurementValues,
      undefined
    );
    
    if (sample) {
      res.status(201).json(sample);
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }

    return;
  }


  return;
};

export default handler;
