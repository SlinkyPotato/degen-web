import { TwitterApi } from 'twitter-api-v2';
import apiKeys from '../constants/apiKeys';
import {
	Collection,
	Db,
	DeleteWriteOpResultObject,
	FindAndModifyWriteOpResultObject,
	InsertOneWriteOpResult,
	ObjectId,
} from 'mongodb';
import MongoDBUtils from './MongoDBUtils';
import constants from '../constants/constants';
import { LoginResult } from 'twitter-api-v2/dist/types';
import platformTypes from '../constants/platformTypes';

export type TwitterAuthentication = {
	oauth_token: string;
	oauth_token_secret: string;
	url: string,
}

const TwitterAuth = {

	authLink: async (): Promise<TwitterAuthentication> => {
		const client = new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
		});

		const auth: TwitterAuthentication = await client.generateAuthLink(apiKeys.twitterCallBackUrl);

		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const cacheCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_CACHE);

		// Retrieve twitter account using discordId
		const result: InsertOneWriteOpResult<any> = await cacheCollection.insertOne({
			oAuthToken: auth.oauth_token,
			oAuthTokenSecret: auth.oauth_token_secret,
			url: auth.url,
		});

		if (result.result.ok != 1) {
			throw Error('failed to store auth tokens');
		}
		return auth;
	},

	getOAuthTokenSecret: async (oAuthToken: string) => {
		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const cacheCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_CACHE);
		const { oAuthTokenSecret } = await cacheCollection.findOne({
			oAuthToken: oAuthToken,
		});
		console.log('found oAuthTokenSecret from db');
		return oAuthTokenSecret;
	},

	login: async (oAuthToken: string, oAuthTokenSecret: string, oauthVerifier: string): Promise<LoginResult> => {
		console.log('attempting to login');
		const client = new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
			accessToken: oAuthToken,
			accessSecret: oAuthTokenSecret,
		});

		try {
			const result: LoginResult = await client.login(oauthVerifier);
			console.log('login successful!');
			return result;
		} catch (e) {
			console.log('failed to login');
			throw new Error('failed to login');
		}
	},
	
	linkTwitter: async (nextAuthId: string, loginResult: LoginResult): Promise<void> => {
		console.log('attempting to link twitter to session');
		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const accountsCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_ACCOUNTS);

		const result: FindAndModifyWriteOpResultObject<any> = await accountsCollection.findOneAndReplace({
			providerId: platformTypes.TWITTER,
			userId: ObjectId(nextAuthId),
		}, {
			userId: ObjectId(nextAuthId),
			providerType: 'oauth',
			providerId: platformTypes.TWITTER,
			providerAccountId: `${loginResult.userId}`,
			accessToken: `${loginResult.accessToken}`,
			accessSecret: `${loginResult.accessSecret}`,
		}, {
			upsert: true,
		});
		
		if (result.ok != 1) {
			throw new Error('failed to link twitter account');
		}
		console.log('twitter linked to session');
	},
	
	clearCache: async (oAuthToken: string): Promise<void> => {
		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const cacheCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_CACHE);
		const result: DeleteWriteOpResultObject = await cacheCollection.deleteMany({
			oAuthToken: oAuthToken,
		});
		if (result.result.ok != 1) {
			throw new Error('failed to delete cache');
		}
	},
};

export default TwitterAuth;