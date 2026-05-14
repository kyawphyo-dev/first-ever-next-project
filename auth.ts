import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return false;
      if (!account || !user) return false;

      try {
        const response = await api.auth.SignInWithOAuth({
          user: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
            username: user.email?.split("@")[0] || "",
          },
          provider: account.provider as string,
          providerAccountId: account.providerAccountId as string,
        });

        if (response && "user" in response) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
  },
});
