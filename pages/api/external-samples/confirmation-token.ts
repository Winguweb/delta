import { NextApiHandler } from "next";
import availableMethodsHandler from "../../../utils/availableMethodsHandler";
import { arnSchema } from "../../../model/confirmationTokenAWS";
import { ZodError, z } from "zod";
import { prismaClient } from "../../../server/prisma/client";

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['GET'])) {
    return;
  }

  if (req.method === 'GET') {

    try {
      arnSchema.parse(req.query.arn);
    } catch (error) {
      return res.status(400).json({ error: (error as ZodError).issues });
    }

    const arn = req.query.arn as z.infer<typeof arnSchema>;

    try {
      const confirmationTokenAWS = await prismaClient.confirmationTokenAWS.findUnique({
        where: { arn },
        select: {
          arn: true,
          confirmationToken: true,
        }
      });
      if (confirmationTokenAWS) {
        return res.status(200).json(confirmationTokenAWS);
      } else {
        return res.status(404).end();
      }
    } catch (e) {
      return res.status(500).json({ error: (e as Error).message });
    }
  }
  return;
}

export default handler;
