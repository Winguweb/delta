import { Sample } from '@prisma/client';
import { prismaClient } from '../server/prisma/client';
import { transformMeasurementValuesForPrisma } from './measurementValues';

export async function createSample(
  deviceId: number,
  samplingPointId: string,
  takenById: string,
  latitude: number,
  longitude: number,
  measurementValues: Record<string, number>,
  takenAt: string | undefined
): Promise<Sample | null> {
  try {
    const sample: Sample = await prismaClient.sample.create({
      data: {
        device: {
          connect: {
            id: deviceId,
          },
        },
        samplingPoint: {
          connect: {
            id: samplingPointId,
          },
        },
        takenBy: {
          connect: {
            id: takenById,
          },
        },
        latitude: latitude,
        longitude: longitude,
        measurementValues: {
          create: transformMeasurementValuesForPrisma(measurementValues),
        },
        takenAt: takenAt,
      },
    });

    const fullSample = {
      ...sample,
      measurementValues: measurementValues,
    };

    await prismaClient.change.create({
      data: {
        title: `Muestra creada`,
        description: `Se ha agregado una muestra`,
        details: {
          sample: JSON.stringify(fullSample),
        },
      },
    });
    return sample;
  } catch (e) {
    return null;
  }
}

export async function updateSample(
  id:number,
  samplingPointId: string,
  deviceId: number,
  latitude: number | undefined,
  longitude: number | undefined,
  measurementValues: Record<string, number>,
  takenAt: string | undefined
): Promise<Sample | null> {
  try {
    const sample: Sample = await prismaClient.sample.update({
      where: {
        id: id,
      },
      data: {
        samplingPoint: {
          connect: {
            id: samplingPointId,
          },
        },
        device: {
          connect: {
            id: deviceId,
          },
        },
        latitude: latitude,
        longitude: longitude,
        measurementValues: {
          create: transformMeasurementValuesForPrisma(measurementValues),
        },
        takenAt: takenAt,
      },
    });

    const fullSample = {
      ...sample,
      measurementValues: measurementValues,
    };

    await prismaClient.change.create({
      data: {
        title: `Muestra actualizada`,
        description: `Se ha editado una muestra`,
        details: {
          sample: JSON.stringify(fullSample),
        },
      },
    });
    return sample;
  } catch (e) {
    return null;
  }
}
