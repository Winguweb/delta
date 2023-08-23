import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError } from 'zod';
import { prismaClient } from '../../../../server/prisma/client';
import availableMethodsHandler from '../../../../utils/availableMethodsHandler';
import { updateSamplingPointSchema } from '../../../../model/samplingPoint';
import { transformMeasurementValuesForOutput } from '../../../../utils/measurementValues';
import { GetSamplingPointResponseWithLastSample } from '..';

const availableMethods = ['GET', 'PUT', 'DELETE'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const id = req.query['sampling-point-id'];

  if (!id) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Id must be a string' });
    return;
  }

  const { method } = req;

  if (method === 'GET') {
    await getHandler(req, res, id);
  }
  if (method === 'PUT') {
    await putHandler(req, res, id);
  }
  if (method === 'DELETE') {
    await deleteHandler(req, res, id);
  }

  return;
};

const getById = async (
  id: string,
  withDevices?: boolean,
  withOwnerData?: boolean
) => {
  let includeOptions: any = {};

  if (withDevices) {
    includeOptions.devices = {
      select: {
        id: true,
        samplingPointId: true,
        name: true,
        description: true,
        components: true,
        owner: withOwnerData
          ? {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                organizationName: true,
              },
            }
          : undefined,
      },
    };
  }

  if (withOwnerData) {
    includeOptions.owner = {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        organizationName: true,
      },
    };
  }

  if (Object.keys(includeOptions).length === 0) {
    includeOptions = false;
  }

  return await prismaClient.samplingPoint.findUnique({
    where: { id: id },
    include: includeOptions,
  });
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: string
): Promise<any> {
  try {
    const { lastSample, withDevices, withOwnerData } = req.query;

    const withDevicesExists = Boolean(withDevices);
    const withOwnerDataExists = Boolean(withOwnerData);

    if (!id) {
      res.status(400).json({ error: `Missing sampling point id` });
      return;
    }

    if (typeof id !== 'string') {
      res.status(400).json({ error: `sampling point id must be a string` });
      return;
    }

    let samplingPoint = await getById(
      id,
      withDevicesExists,
      withOwnerDataExists
    );

    if (!samplingPoint) {
      res.status(404).json({ error: 'pepe' });
      return;
    }

    if (lastSample) {
      const lastSample = await prismaClient.sample.findFirst({
        where: {
          samplingPointId: id,
        },
        orderBy: {
          takenAt: 'desc',
        },
        select: {
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

      const samplingPointWithLastSample: GetSamplingPointResponseWithLastSample =
        {
          ...samplingPoint,
          lastSample: lastSample
            ? {
                ...lastSample,
                measurementValues: transformMeasurementValuesForOutput(
                  lastSample.measurementValues
                ),
              }
            : null,
        };

      res.status(200).json(samplingPointWithLastSample);
    } else {
      res.status(200).json(samplingPoint);
    }
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function putHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: string
): Promise<any> {
  try {
    if (!id) {
      res.status(400).json({ error: `Missing group sampling point id` });
      return;
    }

    if (typeof id !== 'string') {
      res.status(400).json({ error: `sampling point id must be a string` });
      return;
    }

    try {
      updateSamplingPointSchema.parse(req.body);
    } catch (e) {
      res
        .status(400)
        .json({ error: (e as ZodError).issues.map((i) => i.message) });
      return;
    }

    const body = req.body as z.infer<typeof updateSamplingPointSchema>;

    const samplingPoint = await getById(id);

    if (!samplingPoint) {
      res.status(404).json({ error: `Sampling point not found` });
      return;
    }

    const updatedSamplingPoint = await prismaClient.samplingPoint.update({
      where: { id: id },
      data: {
        ...samplingPoint,
        ...body,
      },
    });

    await prismaClient.change.create({
      data: {
        title: `Punto de muestreo actualizado`,
        description: `El Punto de muestreo ${updatedSamplingPoint.name} ha sido actualizado`,
        details: {
          previousSamplingPoint: samplingPoint,
          updatedSamplingPoint,
        },
      },
    });

    res.status(200).json(updatedSamplingPoint);
    return;
  } catch (e) {    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
  id: string
): Promise<any> {
  try {
    const samplingPointId = req.query['sampling-point-id'];

    if (!samplingPointId) {
      res.status(400).json({ error: `Missing sampling point id` });
      return;
    }

    if (typeof samplingPointId !== 'string') {
      res.status(400).json({ error: `sampling point id must be a string` });
      return;
    }

    const samplingPoint = await getById(samplingPointId);

    if (!samplingPoint) {
      res.status(404).json({ error: `sampling point not found` });
      return;
    }

    await prismaClient.samplingPoint.delete({ where: { id: samplingPointId } });

    // await prismaClient.change.create({
    //   data: {
    //     title: `Punto de muestreo eliminado`,
    //     description: `El Punto de muestreo ${samplingPoint.name} ha sido eliminado`,
    //     details: {
    //       deletedSamplingPoint: samplingPoint,
    //     },
    //   },
    // });

    res.status(204).json({ id: samplingPointId });
    return;
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
