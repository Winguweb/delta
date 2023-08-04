import * as yup from 'yup';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../prisma/client';
import { UserStatus } from '@prisma/client';
import { isRecordNotFoundError } from '../../prisma/errors';
import { sendMail } from '../../mail/mailer';
import signupAcceptanceMail from '../../mail/templates/signupAcceptanceMail';
import signupAcceptanceHTMLMail from '../../mail/templates/signupAcceptanceHTMLMail';
import getUserDataFromReq from '../../../utils/getUserDataFromReq';

const signUpRequestStatusUpdateQueryParamsSchema = yup.object({
  id: yup.string().uuid().required(),
});

export const getHandlerForSignupRequestStatusUpdateTo =
  (status: UserStatus): NextApiHandler =>
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { query } = req;
    if (!signUpRequestStatusUpdateQueryParamsSchema.isValidSync(query)) {
      return res.status(400).end();
    }

    const { id } = query;

    const approvedBy = await getUserDataFromReq(req);

    try {
      const user = await prismaClient.user.update({
        data: { status: status },
        where: { id },
      });

      if (status == UserStatus.ACTIVE) {
        await sendMail({
          to: user.email,
          subject: '¡Bienvenido/a a Delta!',
          text: signupAcceptanceMail(user.firstName, user.lastName),
          html: signupAcceptanceHTMLMail(user.firstName, user.lastName),
        });
      }

      await prismaClient.change.create({
        data: {
          title: `Cambio de estado de usuario`,
          description: `El usuario ${
            user.email
          } ha sido pasado al estado ${status}${
            approvedBy ? ` por ${approvedBy.email}` : ''
          }`,
          details: {
            user: JSON.stringify(user),
            approvedBy: JSON.stringify(approvedBy),
          },
        },
      });

      res.status(200);
    } catch (e) {
      if (isRecordNotFoundError(e)) {
        res.status(404);
      }
      res.status(500);
    }

    res.end();
  };
