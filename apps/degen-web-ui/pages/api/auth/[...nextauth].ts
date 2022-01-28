import { MongoClient, ObjectId } from 'mongodb';
import NextAuth, { Session, TokenSet, User } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { AppConstants } from './../../../src/core/app.constants';
import { AppConfig } from '../../../src/core/app.config';
import authDbClientPromise from '../../../src/core/api/mongo/next-auth-db';
import Platform from '../../verification/[platform]';
import { PlatformTypes } from '../../../src/core/enums/platform-types.enum';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: AppConfig.DISCORD_CLIENT_ID,
      clientSecret: AppConfig.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(authDbClientPromise),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    // async jwt({ token, user, account, profile }) {
    //   // Initial sign in
    //   if (account && user) {
    //     return {
    //       accessToken: account.access_token,
    //       accessTokenExpires: account.expires_at,
    //       refreshToken: account.refresh_token,
    //       user,
    //     };
    //   }
    //   return token;
    // },
    async session({ session, token, user }) {
      session.user = user;
      const client = await authDbClientPromise;
      const db = client.db(AppConfig.AUTH_DB);
      const accountCollection = db.collection(AppConstants.NEXT_AUTH_ACCOUNTS);

      const account = await accountCollection.findOne({
        userId: new ObjectId((session?.user as any)?.id),
      });

      session.isDiscordLinked = false;
      if (account?.provider === PlatformTypes.Discord) {
        session.isDiscordLinked = true;
        session.accessToken = account.access_token;
        session.discordId = account.providerAccountId;
      }
      if (account?.provider === PlatformTypes.Twitter) {
        session.isTwitterLinked = true;
        session.twitterAccessToken = account.access_token ?? account.accessToken;
        session.twitterAccessSecret = account.access_secret ?? account.accessSecret;
      }
      return session;
    },
  },
  secret: AppConfig.SECRET,
});
