import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Check if the request method is allowed
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param availableMethods array of available methods for this route
 * @returns boolean that indicates if the request method is allowed
 */
const availableMethodsHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  availableMethods: string[]
): boolean => {
  const { method } = req;

  if (!method || !availableMethods.includes(method)) {
    res.setHeader('Allow', availableMethods);
    res.status(405).json({ error: `Method ${method} Not Allowed` });

    return false;
  }

  return true;
};

export default availableMethodsHandler;
