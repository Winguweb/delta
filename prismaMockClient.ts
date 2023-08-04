import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prismaClient } from './server/prisma/client';

jest.mock('./server/prisma/client', () => ({
  __esModule: true,
  prismaClient: mockDeep<PrismaClient>(),
}));

// beforeEach(() => {
//   mockReset(prismaMock);
// });

export const prismaMock =
  prismaClient as unknown as DeepMockProxy<PrismaClient>;
