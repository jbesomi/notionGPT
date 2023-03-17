import NextAuth, { NextAuthOptions } from "next-auth";

import Notion from "@auth/core/providers/notion";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    Notion({
      clientId: process.env.NOTION_ID,
      clientSecret: process.env.NOTION_SECRET,
      redirectUri: process.env.HOST + "/api/auth/callback/notion",
    }),
  ],

  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
