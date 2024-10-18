import { NextApiHandler } from 'next';
import { ZodError } from 'zod';
import {
  GetUserResponse,
  UpdateUserRequest,
  updateUserSchema,
} from '../../../../../model/user';
import { prismaClient } from '../../../../../server/prisma/client';
import availableMethodsHandler from '../../../../../utils/availableMethodsHandler';


/**
 *  Controller de los requests:
 *   - GET '/api/admin/users/{id}'
 *   - PUT '/api/admin/users/{id}'
 */

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['GET', 'PUT'])) {
    return;
  }

  const id = req.query.id as string;

  const user: GetUserResponse | null = await prismaClient.user.findUnique({
    where: {
      id,
    },
    include: {
      organizationCountry: true,
    }
  });

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    try {
      updateUserSchema.parse(req.body);
    } catch (e) {
      return res.status(400).json({
        error: (e as ZodError).issues,
      });
    }

    const body = req.body as UpdateUserRequest;

    const {organizationCountryId, ...rest} = body

    try {
      const updatedUser = await prismaClient.user.update({
        data: {
          ...rest,
          organizationCountry: organizationCountryId ? {
            connect: {
              id: organizationCountryId,
            }
          } : undefined,
        },
        where: {
          id,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (e) {
      return res.status(500).json({
        error: (e as Error).message,
      });
    }
  }
};

export default handler;
