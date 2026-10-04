import { prisma } from "./prisma";

/** Input for creating a User; matches Prisma User model. */
export type UserCreateData = {
  email: string;
  username: string;
  passwordHash?: string | null;
  googleId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  role?: "USER" | "ADMIN";
  emailVerifiedAt?: Date | null;
  lastActiveAt?: Date | null;
};

export async function createUser(data: UserCreateData) {
  return prisma.user.create({ data });
}
