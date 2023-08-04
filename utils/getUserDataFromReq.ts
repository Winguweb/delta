import { NextApiRequest} from 'next';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { AuthenticatedUser } from '../model/auth';

const getUserDataFromReq = async (req: NextApiRequest | NextRequest) => {
  const token = await getToken({ req });
  return token?.user as AuthenticatedUser | undefined;
};

export default getUserDataFromReq;
