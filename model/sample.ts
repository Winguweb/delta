import { Device, Sample, SampleMeasurementValue, SampleParameter, SamplingPoint, User } from '@prisma/client';
import { z } from 'zod';

export const createAutomaticSampleSchema = z.object({
  deviceId: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  measurementValues: z.record(z.number()),
  takenAt: z.string().datetime(),
  apiKey: z.string(),
});

export const createSampleSchema = z.object({
  deviceId: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  measurementValues: z.record(z.number()),
});

export const updateSampleSchema = z.object({
  samplingPointId: z.string().optional(),
  deviceId: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  takenById: z.string().optional(),
  takenAt: z.string().datetime(),
  measurementValues: z.record(z.number()),
});

export type GetSamplesResponse = Sample[];

export type GetSampleResponse = Sample & {
  samplingPoint: SamplingPoint;
  device: Device;
  takenBy: User;
  measurementValues: Record<string, number>;
};

export type LastSampleResponse = {
  device: Device;
  latitude: number;
  longitude: number;
  takenBy: {
    firstName: string;
    lastName: string;
    email: string;
    organizationName: string | null;
  };
  takenAt: Date;
  measurementValues: Record<string, number>;
};

export type SampleForExport = Omit<Sample, 'samplingPointId' | 'takenById'> & {
  takenBy: Pick<User, 'firstName' | 'lastName'>;
  measurementValues: (Pick<SampleMeasurementValue, 'value'> & {
    parameter: Pick<SampleParameter, 'name'>;
  })[];
};
