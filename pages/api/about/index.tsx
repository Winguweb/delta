import { NextApiHandler } from "next";
import { prismaClient } from "../../../server/prisma/client";
import { About } from "@prisma/client";

const DEFAULT_CONTENTS: About[] = [
  {
    id: 'about',
    text: '',
  }
]
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const abouts = await prismaClient.about.findMany();

  return res.status(200).json([...abouts, ...DEFAULT_CONTENTS.filter(x => !abouts.some(y => y.id === x.id))]);
};

export default handler;
