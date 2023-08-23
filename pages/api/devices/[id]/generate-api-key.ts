import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../server/prisma/client';
import availableMethodsHandler from '../../../../utils/availableMethodsHandler';
import { BCRYPT_COST } from '../../../../config/server';
import { generateApiKey } from '../../../../utils/apiKeyGenerator';
import bcrypt from 'bcrypt';
import getUserDataFromReq from '../../../../utils/getUserDataFromReq';

const availableMethods = ['POST'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  const idAsNumber = Number(id);

  if (isNaN(idAsNumber) || !Number.isInteger(idAsNumber)) {
    return res.status(400).json({ error: 'Id must be an integer' });
  }

  const user = await getUserDataFromReq(req);

  if (!user) {
    return res.status(400).json({
      error: 'Request must be done with a token containing user data',
    });
  }

  try {
    const device = await prismaClient.device.findUnique({
      where: { id: idAsNumber },
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    if (device.ownerId != user.id) {
      return res.status(403).json({ message: 'User is not the owner of the device' });
    }

    const apiKey = generateApiKey();
    const hashedApiKey = await bcrypt.hash(apiKey, BCRYPT_COST);

    await prismaClient.device.update({
      where: { id: idAsNumber },
      data: { apiKey: hashedApiKey },
    });

    return res.status(200).json({ apiKey });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
