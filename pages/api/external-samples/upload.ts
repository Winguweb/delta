import { NextApiHandler } from 'next';
import { z, ZodError } from 'zod';
import { createAutomaticSampleSchema } from '../../../model/sample';
import { Device } from '@prisma/client';
import { prismaClient } from '../../../server/prisma/client';
import availableMethodsHandler from '../../../utils/availableMethodsHandler';
import { createSample } from '../../../utils/samples';
import bcrypt from 'bcrypt';
import { onSampleUpload } from '../../../server/notifier/appNotifierService';

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['POST'])) {
    return;
  }

  try {
    createAutomaticSampleSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).issues });
  }

  const body = req.body as z.infer<typeof createAutomaticSampleSchema>;

  let device: Device | null;
  try {
    device = await prismaClient.device.findUnique({ where: { id: req.body.deviceId } });
  } catch(e) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (!device) {
    return res.status(404).json({ error: `Device with id ${req.body.deviceId} not found` });
  }

  if (!device.apiKey) {
    return res.status(403).json({ error: `Device with id ${req.body.deviceId} does not have its api key set` });
  }

  const isApiKeyValid = await bcrypt.compare(body.apiKey, device.apiKey);

  if (!isApiKeyValid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!device.samplingPointId) {
    return res.status(400).json({ error: `Device with id ${req.body.deviceId} does not have an associated sampling point` });
  }

  const sample = await createSample(device.id, device.samplingPointId, device.ownerId, body.latitude, body.longitude, body.measurementValues, body.takenAt);
  if (sample) {
    await onSampleUpload({ ...sample });
    res.status(201).json(sample);
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }

  return;
};

export default handler;
