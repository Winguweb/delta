import { NextApiHandler } from 'next';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { prismaClient } from '../../../server/prisma/client';
import bcrypt from 'bcrypt';
import { BCRYPT_COST } from '../../../config/server';

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['POST'])) return;

  const { email, token, password } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  if (!token) {
    res.status(400).json({ message: 'Token is required' });
    return;
  }

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  if (!user.resetPasswordToken) {
    res.status(400).json({ message: 'User has no reset password token' });
    return;
  }

  if (req.method === 'POST') {
    const valid = await bcrypt.compare(token, user.resetPasswordToken);

    if (!valid) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    await prismaClient.user.update({
      where: { email },
      data: { resetPasswordToken: null, password: hashedPassword },
    });

    res.status(200).json({ message: 'Password changed' });
  }
};

export default handler;
