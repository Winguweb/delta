import bcrypt from 'bcrypt';
import { NextApiHandler } from 'next';
import { BCRYPT_COST } from '../../../config/server';
import { sendMail } from '../../../server/mail/mailer';
import resetPasswordMail from '../../../server/mail/templates/resetPasswordMail';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import resetPasswordHTMLMail from '../../../server/mail/templates/resetPasswordHTMLMail';

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['POST'])) return;

  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  if (req.method === 'POST') {
    
    const token =
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2);

    await prismaClient.user.update({
      where: { email },
      data: { resetPasswordToken: await bcrypt.hash(token, BCRYPT_COST) },
    });

    
    await sendMail({
      to: email,
      subject: 'Instrucciones para restablecer tu contraseña en Delta',
      html: resetPasswordHTMLMail(user.firstName, user.lastName, email, token),
      text: resetPasswordMail(user.firstName, user.lastName, email, token),
    });

    res.status(200).json({ message: 'Email sent' });
  }
};

export default handler;
