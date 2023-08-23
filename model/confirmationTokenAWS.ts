import { ConfirmationTokenAWS } from '@prisma/client';
import { z } from 'zod';

export const arnSchema = z.string().min(20).max(2048);

export const createConfirmationTokenAWSSchema = z.object({
  arn: arnSchema,
  confirmationToken: z.string().min(1).max(2048),
  enableUrl: z.string(),
  messageType: z.string().refine((val) => val === "DestinationConfirmation"),
});

export type GetConfirmationToken = Omit<ConfirmationTokenAWS, 'id'>;


