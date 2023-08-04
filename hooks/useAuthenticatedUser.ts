import { useSession } from 'next-auth/react';
import { AuthenticatedUser } from '../model/auth';

export function useAuthenticatedUser(): AuthenticatedUser | null {
  const { data: session } = useSession();
  // TODO: validate user schema using runtypes
  return (session?.user ?? null) as AuthenticatedUser;
}
