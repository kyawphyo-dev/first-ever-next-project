import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { SignInSchema } from "./lib/schemas/SignInSchema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    // Credentials provider for manual login
    Credentials({
      async authorize(credentials) {
        // Validate credentials with Zod
        const validated = SignInSchema.safeParse(credentials);

        if (validated.success) {
          const { email, password } = validated.data;

          // Check if user exists
          const response = await api.users.getByEmail(email);
          if (!response || !response.data) return null;

          // Check password
          const Account = response.data;
          if (!Account.password) return null;

          // Compare password with hashed password
          const isPasswordCorrect = await bcrypt.compare(
            password,
            Account.password,
          );

          // Return user if password is correct
          if (isPasswordCorrect) {
            return {
              id: Account._id.toString(),
              name: Account.name,
              email: Account.email,
              image: Account.image,
              username: Account.username,
            };
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return true;
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

    async jwt({ token, account, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        if ("username" in user) {
          token.username = user.username;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        if (token.username) {
          session.user.username = token.username as string;
        }
      }
      return session;
    },
  },
});
