import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import availableMethodsHandler from "../../../../utils/availableMethodsHandler";

const availableMethods = ['POST'];

const handler: NextApiHandler = async (req, res) => {
    if (!availableMethodsHandler(req, res, availableMethods)) {
        return;
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        res.status(400).json({ error: 'Missing id' });
        return;
    }

    const { method } = req;

    if (method === 'POST') {
        await postHandler(req, res, id);
    }

    return;
};


async function postHandler(req: NextApiRequest, res: NextApiResponse, id: string): Promise<void> {
    // TODO: Store promusat data for a device on the DB
    try {
        const splitData = (req.body as string).split(';');
        console.log(`Vessel ${id}, lat:${splitData[2]}, lng:${splitData[3]}`)
    } catch (e) {
        console.error(e);
    }
    return res.status(201).json({});
}

export default handler;
