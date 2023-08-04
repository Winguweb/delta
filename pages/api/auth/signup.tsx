import { UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiHandler } from 'next';
import { BCRYPT_COST } from '../../../config/server';
import { sendMail } from '../../../server/mail/mailer';
import signupRequestHTMLMail from '../../../server/mail/templates/signupRequestHTMLMail';
import signupRequestMail from '../../../server/mail/templates/signupRequestMail';
import { prismaClient } from '../../../server/prisma/client';
import { signupSchema } from '../../../model/signup';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'This endpoint only supports POST requests' });
  }

  try {
    signupSchema.validateSync(req.body, { abortEarly: false });
  } catch (err: any) {
    return res.status(400).json(err.inner);
  }

  const {
    email,
    password,
    firstName,
    lastName,
    telephone,
    organizationName,
    organizationRole,
    organizationCountryId,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

  const user = await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: UserRole.COLLABORATOR,
      status: UserStatus.PENDING,
      organizationName: organizationName,
      organizationCountryId: organizationCountryId,
      organizationRole: organizationRole,
      telephone,
    },
  });

  await prismaClient.change.create({
    data: {
      title: 'Creación de usuario',
      description: `Se ha creado el usuario ${user.email}`,
      details: {
        user: JSON.stringify(user),
      },
    },
  });

  const admins = await prismaClient.user.findMany({
    where: {
      role: UserRole.ADMIN,
    },
  });

  for (const admin of admins) {
    await sendMail({
      to: admin.email,
      subject: 'Delta',
      text: signupRequestMail(
        user.firstName,
        user.lastName,
      ),
      html: signupRequestHTMLMail(
        user.firstName,
        user.lastName,
      ),
    });
  }

  return res.status(200).end();
};

export default handler;
