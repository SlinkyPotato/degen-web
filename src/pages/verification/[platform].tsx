import {
	GetServerSidePropsContext, GetServerSidePropsResult,
	NextPage,
} from 'next';
import platformTypes from '../../constants/platformTypes';
import apiKeys from '../../constants/apiKeys';
import { TwitterApi } from 'twitter-api-v2';
import { LoginResult } from 'twitter-api-v2/dist/types';
import MongoDBUtils from '../../utils/MongoDBUtils';
import { Collection, Db, FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, ObjectId } from 'mongodb';
import constants from '../../constants/constants';
import { getSession } from 'next-auth/client';

const Platform: NextPage<any> = () => {
	return (
		<>
			Twitter account linked. Twitter spaces is activated.
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
	const session = await getSession(context);
	// Verify discord session is active
	if (!session) {
		return {
			redirect: {
				destination: '/api/auth/signin',
				permanent: false,
			},
		};
	}

	const platform = context.params?.platform;

	if (platform === platformTypes.TWITTER && (session.twitterAccessToken == null || session.twitterAccessToken == '')) {

		const oAuthToken = context.query.oauth_token as string;
		const oauthVerifier = context.query?.oauth_verifier as string;

		// Check for first step in twitter oauth flow
		if (!oAuthToken || !oauthVerifier) {
			const client = new TwitterApi({
				appKey: apiKeys.twitterClientId,
				appSecret: apiKeys.twitterClientSecret,
			});

			const authLink = (await client.generateAuthLink(apiKeys.twitterCallBackUrl)).url;
			return {
				redirect: {
					destination: authLink,
					permanent: false,
				},
			};
		}

		// Verify oauthtoken and oauthVerifier
		const client = new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
			accessToken: oAuthToken,
			accessSecret: apiKeys.twitterSecretToken,
		});

		let loginResult: LoginResult;
		try {
			loginResult = await client.login(oauthVerifier);
		} catch (e) {
			return {
				redirect: {
					destination: '/verification/twitter',
					permanent: true,
				},
			};
		}

		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
		const accountsCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_ACCOUNTS);

		// Retrieve twitter account using discordId
		const account = await accountsCollection.findOne({
			providerId: platformTypes.TWITTER,
			userId: ObjectId(session.user.id),
		});

		const newAccount = {
			userId: ObjectId(session.user.id),
			providerType: 'oauth',
			providerId: platformTypes.TWITTER,
			providerAccountId: loginResult.userId,
			accessToken: loginResult.accessToken,
		};

		let didFail;
		if (account != null) {
			// insert twitter account into db
			const result: FindAndModifyWriteOpResultObject<any> = await accountsCollection.findOneAndReplace(
				account,
				newAccount, {
				upsert: true,
			});
			didFail = (result.ok != 1);
		} else {
			const result: InsertOneWriteOpResult<any> = await accountsCollection.insertOne(newAccount);
			didFail = (result.insertedCount != 1 || result.result.ok != 1);
		}

		if (didFail) {
			// failed to insert into db
			return {
				redirect: {
					destination: '/verification/twitter',
					permanent: true,
				},
			};
		}

		const sessionCollection: Collection = await db.collection(constants.DB_COLLECTION_NEXT_AUTH_SESSIONS);
		await sessionCollection.updateOne({
			userId: ObjectId(session.user.id),
		}, {
			$set: {
				twitterAccessToken: loginResult.accessToken,
			},
		});

		// inserted successfully
		return {
			redirect: {
				destination: '/verification/twitter',
				permanent: true,
			},
		};
	}

	return {
		props: {},
	};
};

export default Platform;