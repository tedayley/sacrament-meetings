import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { authConfig } from "@/auth.config";

const credentialsSchema = z.object({
  email: z.string().email().transform((email) => email.trim().toLowerCase()),
  password: z.string().min(1).max(128),
});

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = process.env.AUTH_USER_EMAIL?.trim().toLowerCase();
        const passwordHash = process.env.AUTH_USER_PASSWORD_HASH;
        if (!email || !passwordHash) {
          throw new Error(
            "Set AUTH_USER_EMAIL and AUTH_USER_PASSWORD_HASH before signing in.",
          );
        }

        const passwordsMatch = await bcrypt.compare(
          parsed.data.password,
          passwordHash,
        );
        if (!passwordsMatch || parsed.data.email !== email) return null;

        return {
          id: email,
          email,
          name: email,
        };
      },
    }),
  ],
});
