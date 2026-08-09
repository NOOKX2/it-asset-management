import type { NextAuthConfig } from "next-auth";
import { parseUserRole } from "@/lib/user-role";

const SESSION_MAX_AGE = 15 * 60;

export const authConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = (token.name as string | null | undefined) ?? null;
        session.user.role = parseUserRole(token.role as string);
      }
      return session;
    },
  },
  trustHost: true,
};
