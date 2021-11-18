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
import { LoginResult, UserV1 } from 'twitter-api-v2/dist/types';
import platformTypes from '../constants/platformTypes';
import Log from './Log';

export type TwitterAuthentication = {
	oauth_token: string
	oauth_token_secret: string;
	url: string,
}

const TwitterAuth = {

	authLink: async (): Promise<TwitterAuthentication> => {
		console.log('starting to authlink');
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
		console.log('looking for oAuthToken Secret');
		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const cacheCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_CACHE);
		const { oAuthTokenSecret } = await cacheCollection.findOne({
			oAuthToken: oAuthToken,
		});
		console.log('found oAuthTokenSecret from db');
		return oAuthTokenSecret;
	},
	
	clientV1: (accessToken: string, accessTokenSecret: string): TwitterApi => {
		return new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
			accessToken: accessToken,
			accessSecret: accessTokenSecret,
		});
	},

	login: async (oAuthToken: string, oAuthTokenSecret: string, oauthVerifier: string): Promise<LoginResult> => {
		const client = new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
			accessToken: oAuthToken,
			accessSecret: oAuthTokenSecret,
		});

		try {
			const result: LoginResult = await client.login(oauthVerifier);
			Log.debug(`${result.userId} logged in`);
			return result;
		} catch (e) {
			console.log('failed to login');
			throw new Error('failed to login');
		}
	},
	
	linkAccount: async (loginResult: LoginResult, nextAuthId: string): Promise<void> => {
		console.log('attempting to store twitter in db');
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
			throw new Error('failed to store twitter in db');
		}
		console.log('twitter stored in db');
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
	
	runCallBack: async (sessionUserId: string, oAuthToken: string, oAuthVerifier: string): Promise<boolean> => {
		if (oAuthToken == null && oAuthVerifier == null) {
			console.log('tokens not given');
			return false;
		}

		if (oAuthToken != null && oAuthVerifier == null) {
			console.log('authorization not given');
			return false;
		}

		const oAuthTokenSecret: string = await TwitterAuth.getOAuthTokenSecret(oAuthToken);
		let loginResult: LoginResult;
		try {
			loginResult = await TwitterAuth.login(oAuthToken, oAuthTokenSecret, oAuthVerifier);
		} catch (e) {
			console.log('failed login to twitter');
			return false;
		}

		await TwitterAuth.linkAccount(loginResult, sessionUserId);
		await TwitterAuth.clearCache(oAuthToken);

		return true;
	},
	
	isTwitterLinked: async (sessionUserId: string): Promise<boolean> => {
		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const accountsCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_ACCOUNTS);

		// Retrieve twitter account using discordId
		const account = await accountsCollection.findOne({
			providerId: platformTypes.TWITTER,
			userId: ObjectId(sessionUserId),
		});
		
		if (account == null || account.accessSecret == null) {
			return false;
		}
		
		const clientV1: TwitterApi = TwitterAuth.clientV1(account.accessToken, account.accessSecret);
		const user: UserV1 = await clientV1.currentUser(true);
		
		return user != null && user.id_str != null;
	},
};

export default TwitterAuth;