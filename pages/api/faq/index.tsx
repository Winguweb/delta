import {NextApiHandler} from "next";
import { prismaClient } from "../../../server/prisma/client";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const faq = await prismaClient.faq.findMany(
    {
      orderBy: [
        {
          createdAt: 'asc',
        }
      ]
    }
  );  

  return res.status(200).json(faq);
};

export default handler;
