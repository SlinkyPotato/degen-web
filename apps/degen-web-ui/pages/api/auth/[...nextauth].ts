import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { AppConfig } from '../../../src/core/app.config';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: AppConfig.DISCORD_CLIENT_ID,
      clientSecret: AppConfig.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at,
          refreshToken: account.refresh_token,
          user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  secret: AppConfig.SECRET,
});
