import { NextApiHandler } from "next";
import availableMethodsHandler from "../../../utils/availableMethodsHandler";
import { prismaClient } from "../../../server/prisma/client";
import { Country } from "@prisma/client";

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, ['GET'])) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const countries: Country[] = await prismaClient.country.findMany();
      return res.status(200).json(countries);
    } catch (e) {
      return res.status(500).json({ error: (e as Error).message });
    }
  }
  return;
}

export default handler;
