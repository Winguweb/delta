import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export function isRecordNotFoundError(error: unknown) {
  return (
    error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
  );
}
