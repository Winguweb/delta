import { NextApiHandler } from "next";
import availableMethodsHandler from "../../../utils/availableMethodsHandler";
import { prismaClient } from "../../../server/prisma/client";
import { createConfirmationTokenAWSSchema } from "../../../model/confirmationTokenAWS";
import { ZodError, z } from "zod";

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['POST'])) {
    return;
  }

  try {
    createConfirmationTokenAWSSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: (error as ZodError).issues });
  }

  const body = req.body as z.infer<typeof createConfirmationTokenAWSSchema>;

  if (req.method === 'POST') {
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
  return;
}

export default handler;
