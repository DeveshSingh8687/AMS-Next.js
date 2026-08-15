
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          return null;
        }

        return {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,

          // Custom data
          employeeId: data.user.employeeId,
          department: data.user.department,
          designation: data.user.designation,
          role: data.user.role,

          // IMPORTANT
          accessToken: data.token,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export const handlers = {
  GET: handler,
  POST: handler,
};

export async function auth() {
  return await getServerSession(authOptions as any);
}