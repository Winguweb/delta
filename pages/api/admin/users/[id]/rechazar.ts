import { NextApiHandler } from 'next';
import { UserStatus } from '@prisma/client';
import { getHandlerForSignupRequestStatusUpdateTo } from '../../../../../server/api/handlers/signupRequests';

const handler: NextApiHandler = getHandlerForSignupRequestStatusUpdateTo(
  UserStatus.BLOCKED
);

export default handler;
