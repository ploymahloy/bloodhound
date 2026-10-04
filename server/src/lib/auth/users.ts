import { prisma } from "../prisma";
import type { SessionUser } from "./types";

const toSessionUser = (user: {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
}): SessionUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
});

const sanitizeUsernameBase = (email: string) => {
  const local = email.split("@")[0] ?? "user";
  const cleaned = local.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return cleaned.slice(0, 24) || "user";
};

const uniqueUsername = async (email: string) => {
  const base = sanitizeUsernameBase(email);
  let candidate = base;
  let suffix = 0;

  while (true) {
    const existing = await prisma.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}_${suffix}`.slice(0, 32);
  }
};

export const findUserById = async (id: string): Promise<SessionUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  });
  return user ? toSessionUser(user) : null;
};

export const findOrCreateGoogleUser = async (profile: {
  googleId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}): Promise<SessionUser> => {
  const existingByGoogle = await prisma.user.findUnique({
    where: { googleId: profile.googleId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  });
  if (existingByGoogle) {
    const updated = await prisma.user.update({
      where: { id: existingByGoogle.id },
      data: {
        lastActiveAt: new Date(),
        firstName: profile.firstName ?? existingByGoogle.firstName,
        lastName: profile.lastName ?? existingByGoogle.lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });
    return toSessionUser(updated);
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: profile.email },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      googleId: true,
    },
  });

  if (existingByEmail) {
    const linked = await prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId: profile.googleId,
        lastActiveAt: new Date(),
        emailVerifiedAt: new Date(),
        firstName: profile.firstName ?? existingByEmail.firstName,
        lastName: profile.lastName ?? existingByEmail.lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });
    return toSessionUser(linked);
  }

  const username = await uniqueUsername(profile.email);
  const created = await prisma.user.create({
    data: {
      email: profile.email,
      username,
      googleId: profile.googleId,
      passwordHash: null,
      firstName: profile.firstName ?? null,
      lastName: profile.lastName ?? null,
      emailVerifiedAt: new Date(),
      lastActiveAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  });

  return toSessionUser(created);
};
