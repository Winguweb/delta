import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserStatus, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Session } from 'next-auth/core/types';
import { AuthenticatedUser } from '../../../model/auth';
import { JWT } from 'next-auth/jwt';
import { prismaClient } from '../../../server/prisma/client';

const asd = Prisma.validator<Prisma.UserArgs>()({});

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      authorize: async (
        credentials: any
      ): Promise<AuthenticatedUser | null> => {

        const { email, password } = credentials;

        const user = await prismaClient.user.findUnique({
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
          },
          where: { email },
        });

        if (!user || user.status !== UserStatus.ACTIVE) {
          return null;
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
          return null;
        }

        await prismaClient.change.create({
          data: {
            title: 'Inicio de sesión',
            description: `Se ha iniciado sesión con el usuario ${user.email}`,
            details: {
              user: JSON.stringify(user),
            },
          },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }): Promise<JWT> => {
      return user ? { ...token, user } : token;
    },
    session: async ({ session, token }): Promise<Session> => {

      return {
        ...session,
        user: token['user'] as any,
      };
    },
  },
});
