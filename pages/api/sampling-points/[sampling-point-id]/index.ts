import { NextApiHandler } from 'next';
import { z, ZodError } from 'zod';
import { prismaClient } from '../../../../server/prisma/client';
import availableMethodsHandler from '../../../../utils/availableMethodsHandler';
import { updateSamplingPointSchema } from '../../../../model/samplingPoint';
import { transformMeasurementValuesForOutput } from '../../../../utils/measurementValues';
import { GetSamplingPointResponseWithLastSample } from '..';

const availableMethods = ['GET', 'PUT', 'DELETE'];

const getById = async (id: string, withDevices?: boolean) => {
  if (withDevices) {
    return await prismaClient.samplingPoint.findUnique({
      where: { id: id },
      include: {
        devices: {
          select: {
            id: true,
            samplingPointId: true,
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
        },
      },
    });
  } else {
    return prismaClient.samplingPoint.findUnique({
      where: { id },
    });
  }
};

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  /** Get sampling point by id */
  if (req.method === 'GET') {
    const {
      'sampling-point-id': samplingPointId,
      lastSample,
      withDevices,
    } = req.query;

    const withDevicesExists = Boolean(withDevices);

    if (!samplingPointId) {
      res.status(400).json({ error: `Missing sampling point id` });
      return;
    }

    if (typeof samplingPointId !== 'string') {
      res.status(400).json({ error: `sampling point id must be a string` });
      return;
    }

    let samplingPoint = await getById(samplingPointId, withDevicesExists);

    if (!samplingPoint) {
      res.status(404).json({ error: `sampling point not found` });
      return;
    }

    if (lastSample) {
      const lastSample = await prismaClient.sample.findFirst({
        where: {
          samplingPointId: samplingPointId,
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

    return;
  }

  /**
   * Update sampling point by id
   * Samples will be updated by deleting all samples and adding new ones from the request body
   * If you want to add or delete a sample, use /api/sampling-points/[sampling-point-id]/samples
   */
  if (req.method === 'PUT') {
    const samplingPointId = req.query['sampling-point-id'];

    if (!samplingPointId) {
      res.status(400).json({ error: `Missing group sampling point id` });
      return;
    }

    if (typeof samplingPointId !== 'string') {
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

    const samplingPoint = await getById(samplingPointId);

    if (!samplingPoint) {
      res.status(404).json({ error: `Sampling point not found` });
      return;
    }

    const updatedSamplingPoint = await prismaClient.samplingPoint.update({
      where: { id: samplingPointId },
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
  }

  /** Delete sampling point by id */
  if (req.method === 'DELETE') {
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
  }
};

export default handler;
