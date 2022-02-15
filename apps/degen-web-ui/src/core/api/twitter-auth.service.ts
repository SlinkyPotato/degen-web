import { AppConfig } from './../app.config';
import { Db, ObjectId } from 'mongodb';
import { MongoDbCollections } from './mongo/db';
import { Client as DiscordClient } from 'discord.js';
import { ServerGlobals } from '../../server';
import { TwitterApi } from 'twitter-api-v2';
import { LoginResult, UserV1 } from 'twitter-api-v2/dist/types';
import { PlatformTypes } from '../enums/platform-types.enum';
import { IncomingMessage } from 'http';

export type TwitterAuthentication = {
  oauth_token: string;
  oauth_token_secret: string;
  url: string;
};

export class TwitterAuthService {
  private db: Db;
  private collections: MongoDbCollections;
  private client: DiscordClient;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async init(req: any) {
    this.client = (req.app.globals as ServerGlobals).discordClient;
    this.db = req.app.globals.db;
    this.collections = (req.app.globals as ServerGlobals).collections;
    return this;
  }

  async authLink(): Promise<TwitterAuthentication> {
    console.log('starting to authlink');
    const client = new TwitterApi({
      appKey: AppConfig.TWITTER_CLIENT_ID,
      appSecret: AppConfig.TWITTER_CLIENT_SECRET,
    });

    const auth: TwitterAuthentication = await client.generateAuthLink(
      AppConfig.TWITTER_CALLBACK_URL
    );

    // Retrieve twitter account using discordId
    const result = await this.collections.nextAuthCache.insertOne({
      oAuthToken: auth.oauth_token,
      oAuthTokenSecret: auth.oauth_token_secret,
      url: auth.url,
    });

    if (!result.acknowledged) {
      throw Error('failed to store auth tokens');
    }
    return auth;
  }

  async getOAuthTokenSecret(oAuthToken: string) {
    const { oAuthTokenSecret } = await this.collections.nextAuthCache.findOne({
      oAuthToken: oAuthToken,
    });
    console.log('found oAuthTokenSecret from db');
    return oAuthTokenSecret;
  }

  clientV1(accessToken: string, accessTokenSecret: string): TwitterApi {
    return new TwitterApi({
      appKey: AppConfig.TWITTER_CLIENT_ID,
      appSecret: AppConfig.TWITTER_CLIENT_SECRET,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });
  }

  async login(oAuthToken: string, oAuthTokenSecret: string, oauthVerifier: string) {
    const client = new TwitterApi({
      appKey: AppConfig.TWITTER_CLIENT_ID,
      appSecret: AppConfig.TWITTER_CLIENT_SECRET,
      accessToken: oAuthToken,
      accessSecret: oAuthTokenSecret,
    });

    try {
      const result = await client.login(oauthVerifier);
      console.log(`twitterId: ${result.userId} logged in`);
      return result;
    } catch (e) {
      console.log('failed to login');
      throw new Error('failed to login');
    }
  }

  async linkAccount(loginResult: LoginResult, nextAuthId: string) {
    console.log('attempting to store twitter in db');
    const result = await this.collections.nextAuthAccounts.findOneAndReplace(
      {
        providerId: PlatformTypes.Twitter,
        userId: new ObjectId(nextAuthId),
      },
      {
        userId: new ObjectId(nextAuthId),
        providerType: 'oauth',
        providerId: PlatformTypes.Twitter,
        providerAccountId: `${loginResult.userId}`,
        accessToken: `${loginResult.accessToken}`,
        accessSecret: `${loginResult.accessSecret}`,
      },
      {
        upsert: true,
      }
    );

    if (result.ok != 1) {
      throw new Error('failed to store twitter in db');
    }
    console.log('twitter stored in db');
  }

  async clearCache(oAuthToken: string) {
    const result = await this.collections.nextAuthCache.deleteMany({
      oAuthToken: oAuthToken,
    });
    if (!result.acknowledged) {
      throw new Error('failed to delete cache');
    }
  }

  async runCallBack(sessionUserId: string, oAuthToken: string, oAuthVerifier: string) {
    if (oAuthToken == null && oAuthVerifier == null) {
      console.log('tokens not given');
      return false;
    }

    if (oAuthToken != null && oAuthVerifier == null) {
      console.log('authorization not given');
      return false;
    }

    const oAuthTokenSecret: string = await this.getOAuthTokenSecret(oAuthToken);
    let loginResult: LoginResult;
    try {
      loginResult = await this.login(oAuthToken, oAuthTokenSecret, oAuthVerifier);
    } catch (e) {
      console.log('failed login to twitter');
      return false;
    }

    await this.linkAccount(loginResult, sessionUserId);
    await this.clearCache(oAuthToken);

    return true;
  }

  async isTwitterLinked(sessionUserId: string) {
    // Retrieve twitter account using discordId
    const account = await this.collections.nextAuthAccounts.findOne({
      providerId: PlatformTypes.Twitter,
      userId: new ObjectId(sessionUserId),
    });

    if (!account?.accessSecret) {
      return false;
    }
    try {
      const clientV1: TwitterApi = this.clientV1(
        account.accessToken,
        account.accessSecret
      );
      const user: UserV1 = await clientV1.currentUser(true);

      return user != null && user.id_str != null;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export const getTwitterAuthService = async (req: IncomingMessage) => {
  return new TwitterAuthService().init(req);
};
