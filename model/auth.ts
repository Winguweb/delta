import { z } from 'zod';
import { UserRole } from '@prisma/client';

export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
export const AuthenticatedUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
});
