import { NextApiHandler } from "next";
import availableMethodsHandler from "../../../utils/availableMethodsHandler";
import { prismaClient } from "../../../server/prisma/client";
import { createConfirmationTokenAWSSchema } from "../../../model/confirmationTokenAWS";
import { ZodError, z } from "zod";
import { atStartOfHoursAgoISO } from "../../../utils/dates";

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['POST', 'GET'])) {
    return;
  }

  if (req.method === 'POST') {
    try {
      createConfirmationTokenAWSSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({ error: (error as ZodError).issues });
    }

    const body = req.body as z.infer<typeof createConfirmationTokenAWSSchema>;


    try {
      await prismaClient.confirmationTokenAWS.upsert({
        where: {
          arn: body.arn,
        },
        update: {
          confirmationToken: body.confirmationToken,
        },
        create: {
          arn: body.arn,
          confirmationToken: body.confirmationToken,
        },
      });
      return res.status(201).json({});
    } catch (e) {
      return res.status(500).json({ error: (e as Error).message });
    }
  }

  if (req.method === 'GET') {
    try {
      const { lastHour } = req.query;
      let samples;
      if (lastHour) {
        samples = await prismaClient.sample.findMany({
          where: {
            takenAt: {
              gte: atStartOfHoursAgoISO(3),
            },
          },
          select: {
            deviceId: true,
            latitude: true,
            longitude: true,
            takenAt: true,
            device: {
              select: {
                name: true
              }
            }
          },
          orderBy: [
            {
              takenAt: 'desc',
            },
          ],
          distinct: ['deviceId'],
        });
      } else {
        samples = await prismaClient.sample.findMany({});
      }
      return res.status(201).json({ samples: samples });

    } catch (e) {
      return res.status(500).json({ error: (e as Error).message });
    }
  }

  return;
}

export default handler;
