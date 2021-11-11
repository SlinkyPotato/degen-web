import {
	GetServerSidePropsContext, GetServerSidePropsResult,
	NextPage,
} from 'next';
import platformTypes from '../../constants/platformTypes';
import { LoginResult } from 'twitter-api-v2/dist/types';
import MongoDBUtils from '../../utils/MongoDBUtils';
import { Collection, Db, ObjectId } from 'mongodb';
import constants from '../../constants/constants';
import { getSession, signIn, useSession } from 'next-auth/client';
import TwitterAuth from '../../utils/TwitterAuth';

const Platform: NextPage<any> = () => {
	const [session, loading] = useSession();
	if (loading) {
		return (
			<>loading...</>
		);
	}
	if (!session || !session.isDiscordLinked) {
		signIn('discord').then();
		return (
			<></>
		);
	}
	return (
		<>
			Twitter account linked. You are now authorized to host POAP events for twitter spaces!
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
	const session = await getSession(context);
	const platform = context.params?.platform;
	
	// Verify discord session is active
	if (!session || platform !== platformTypes.TWITTER) {
		return {
			props: {},
		};
	}

	const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
	const accountsCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_ACCOUNTS);

	// Retrieve twitter account using discordId
	const account = await accountsCollection.findOne({
		providerId: platformTypes.TWITTER,
		userId: ObjectId(session.user.id),
	});

	if (account == null || account.accessSecret == null || account.accessSecret == '') {
		
		const oAuthToken = context.query.oauth_token as string;
		const oauthVerifier = context.query.oauth_verifier as string;
		
		if (oAuthToken != null && oauthVerifier == null) {
			console.log('authorization not given');
			throw Error('failed to authorize');
		}
		
		if (oAuthToken == null && oauthVerifier == null) {
			return {
				redirect: {
					destination: (await TwitterAuth.authLink()).url,
					permanent: false,
				},
			};
		}

		const oAuthTokenSecret: string = await TwitterAuth.getOAuthTokenSecret(oAuthToken);
		let loginResult: LoginResult;
		try {
			loginResult = await TwitterAuth.login(oAuthToken, oAuthTokenSecret, oauthVerifier);
		} catch (e) {
			console.log('failed login to twitter');
			return refreshRedirect();
		}
		
		await TwitterAuth.linkTwitter(session.user.id as string, loginResult).catch();
		await TwitterAuth.clearCache(oAuthToken);
		
		return refreshRedirect();
	}
	return {
		props: {},
	};
};

const refreshRedirect = () => {
	return {
		redirect: {
			destination: '/verification/twitter',
			permanent: true,
		},
	};
};

export default Platform;