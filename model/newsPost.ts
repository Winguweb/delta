import { NewsPostStatus } from '@prisma/client';
import { z } from 'zod';

export const createNewSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(280),
  startDate: z.string(),
  endDate: z.string(),
  status: z.nativeEnum(NewsPostStatus),
});

export const updateNewSchema = z.object({
  title: createNewSchema.shape.title.optional(),
  description: createNewSchema.shape.description.optional(),
  startDate: createNewSchema.shape.startDate.optional(),
  endDate: createNewSchema.shape.endDate.optional(),
  status: createNewSchema.shape.status.optional(),
});
