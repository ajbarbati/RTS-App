import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/src/lib/auth/login";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await login(
          String(credentials?.email ?? ""),
          String(credentials?.password ?? ""),
        );
        return user ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
