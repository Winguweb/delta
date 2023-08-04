import { Country, User, UserRole } from '@prisma/client';
import { z } from 'zod';

export type GetUserResponse = Omit<User, 'password' | 'resetPasswordToken' | 'organizationCountryId'> & {organizationCountry: Country};

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  telephone: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  organizationName: z.string().optional(),
  organizationRole: z.string().optional(),
  organizationCountryId: z.string().uuid().optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
