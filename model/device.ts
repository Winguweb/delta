import { Device, SamplingPoint, User } from '@prisma/client';
import { z } from 'zod';

export const createDeviceSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(280).optional(),
  components: z.string().max(280).optional(),
  samplingPointId: z.string().uuid().nullable().optional(),
});

export const updateDeviceSchema = z.object({
  name: z.string().max(100).optional(),
  description: z.string().max(280).optional(),
  components: z.string().max(280).optional(),
  samplingPointId: z.string().uuid().nullable().optional(),
});

interface AuxGetDeviceResponseInterface extends Pick<Device, 'id' | 'name' | 'samplingPointId' | 'description' | 'components'> {
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'organizationName' | 'email'>,
  samplingPoint: Pick<SamplingPoint, 'id' | 'name'> | null,
};

export type GetDeviceResponse = AuxGetDeviceResponseInterface;

interface AuxGetDevicesResponseInterface extends Pick<Device, 'id' | 'name' | 'description'> {
  owner: Pick<User, 'organizationName'>,
};

export type GetDevicesResponse = AuxGetDevicesResponseInterface[];

export type GetDevicesResponseForTable = (Omit<AuxGetDevicesResponseInterface, 'owner'> & { organizationName: AuxGetDevicesResponseInterface['owner']['organizationName'] })[];
