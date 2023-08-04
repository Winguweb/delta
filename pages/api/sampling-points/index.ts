import { NextApiHandler } from 'next';
import { z, ZodError } from 'zod';
// import {
//   createGroupPatientSchema,
//   GetGroupPatientsResponse,
// } from '../../../model/groupPatient';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import {
  createSamplingPointSchema,
  GetSamplingPointResponse,
  GetSamplingPointsResponse,
} from '../../../model/samplingPoint';
import { transformMeasurementValuesForOutput } from '../../../utils/measurementValues';
import { LastSampleResponse } from '../../../model/sample';
import getUserDataFromReq from '../../../utils/getUserDataFromReq';
import { Device, Prisma } from '@prisma/client';

const availableMethods = ['GET', 'POST'];

export interface GetSamplingPointResponseWithLastSample
  extends GetSamplingPointResponse {
  devices?: Device[];
  lastSample?: LastSampleResponse | null;
}

type SamplingPointCreateInputWithOwner = Prisma.SamplingPointCreateInput & {
  owner: {
    connect: {
      id: string;
    };
  };
};

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const { method } = req;

  /** Get all sampling points */
  if (method === 'GET') {
    const {
      lastSample,
      takenByOrganizations,
      areaTypes,
      waterBodyTypes,
      name,
      country,
    } = req.query;

    let where = {};

    if (areaTypes && areaTypes.length !== 0) {
      where = {
        areaType: {
          in: areaTypes,
        },
      };
    }

    where = {
      ...where,
      AND: [
        {
          waterBodyType: waterBodyTypes
            ? {
                in: waterBodyTypes,
              }
            : undefined,
        },
        {
          country: country
            ? {
                in: country,
              }
            : undefined,
        },
        {
          name: name
            ? {
                mode: 'insensitive',
                contains: name as string | undefined,
              }
            : undefined,
        },
      ],
    };

    if (takenByOrganizations && takenByOrganizations.length) {
      const hasDelta = takenByOrganizations.includes('Delta');
      const hasIndependiente = takenByOrganizations.includes('Independiente');

      // Filtra los puntos de toma que sí tienen relación con dispositivos Delta
      if (!hasIndependiente && hasDelta) {
        where = {
          ...where,
          devices: {
            some: {
              owner: {
                organizationName: 'Delta',
              },
            },
          },
        };
      }

      // Filtra los puntos de toma con relación a dispositivos Independientes
      if (!hasDelta && hasIndependiente) {
        where = {
          ...where,
          devices: {
            some: {
              owner: {
                organizationName: {
                  not: 'Delta',
                },
              },
            },
          },
        };
      }
    }

    const samplingPoints: GetSamplingPointsResponse =
      await prismaClient.samplingPoint.findMany({
        where,
        include: {
          owner: {
            select: {
              organizationName: true,
            },
          },
        },
      });

    if (lastSample) {
      const samplingPointsWithLastSamples: GetSamplingPointsResponse = [];

      for (const samplingPoint of samplingPoints) {
        const lastSample = await prismaClient.sample.findFirst({
          where: {
            samplingPointId: samplingPoint.id,
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

        samplingPointsWithLastSamples.push(samplingPointWithLastSample);
      }

      res.status(200).json(samplingPointsWithLastSamples);
    } else {
      res.status(200).json(samplingPoints);
    }
    return;
  }

  if (method === 'POST') {
    try {
      createSamplingPointSchema.parse(req.body);
    } catch (e) {
      return res.status(400).json({ error: (e as ZodError).issues });
    }

    const body = req.body as z.infer<typeof createSamplingPointSchema>;

    const user = await getUserDataFromReq(req);

    if (!user) {
      return res.status(400).json({
        error: 'Request must be done with a token containing user data',
      });
    }

    try {
      const samplingPoint = await prismaClient.samplingPoint.create({
        data: {
          ...body,
          owner: {
            connect: {
              id: user.id,
            },
          },
        } as SamplingPointCreateInputWithOwner,
      });

      await prismaClient.change.create({
        data: {
          title: `Punto de toma creado`,
          description: `Se ha agregado un punto de toma`,
          details: {
            samplingPoint: JSON.stringify(samplingPoint),
          },
        },
      });

      return res.status(201).json(samplingPoint);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default handler;
