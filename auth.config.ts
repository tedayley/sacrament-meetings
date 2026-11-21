import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname === "/meetings/new" ||
        /^\/meetings\/[^/]+\/edit$/.test(pathname);

      return !isProtected || Boolean(auth?.user);
    },
  },
  providers: [],
} satisfies NextAuthConfig;
