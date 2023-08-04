import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../server/prisma/client';
import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';
import { GetUserResponse } from '../../../../model/user';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  const {
    firstName,
    lastName,
    establishmentName,
    search,
    status: queryStatus,
    role: queryRole,
  } = req.query;

  const { success: isValidStatus } = z
    .array(z.nativeEnum(UserStatus))
    .or(z.undefined())
    .safeParse((queryStatus as string | undefined)?.split(','));

  if (!isValidStatus) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const { success: isValidRole } = z
    .array(z.nativeEnum(UserRole))
    .or(z.undefined())
    .safeParse((queryRole as string | undefined)?.split(','));

  if (!isValidRole) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const status = (queryStatus as string | undefined)?.split(
    ','
  ) as UserStatus[];

  const role = (queryRole as string | undefined)?.split(',') as UserRole[];

  const hasQueriesToSearch = [
    firstName,
    lastName,
    establishmentName,
    status,
    search,
  ].some((query) => query !== undefined);

  const users: GetUserResponse[] = await prismaClient.user.findMany({
    where: {
      AND: [
        {
          status: status
            ? {
                in: status,
              }
            : undefined,
        },
        {
          role: role
            ? {
                in: role,
              }
            : undefined,
        },
        {
          OR: hasQueriesToSearch
            ? [
                {
                  firstName:
                    firstName || search
                      ? {
                          mode: 'insensitive',
                          contains: (firstName || search) as string | undefined,
                        }
                      : undefined,
                },
                {
                  lastName:
                    lastName || search
                      ? {
                          mode: 'insensitive',
                          contains: (lastName || search) as string | undefined,
                        }
                      : undefined,
                },
              ]
            : undefined,
        },
      ],
    },
    include: {
      organizationCountry: true,
    }
  });

  return res.status(200).send(users);
};

export default handler;
