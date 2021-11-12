import {
	GetServerSidePropsContext, GetServerSidePropsResult,
	NextPage,
} from 'next';
import platformTypes from '../../constants/platformTypes';
import MongoDBUtils from '../../utils/MongoDBUtils';
import { Collection, Db, ObjectId } from 'mongodb';
import constants from '../../constants/constants';
import { getSession, signIn, useSession } from 'next-auth/client';
import TwitterAuth, { TwitterAuthentication } from '../../utils/TwitterAuth';

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
	
	if (platform !== platformTypes.TWITTER) {
		return {
			props: {},
		};
	}
	
	// Verify discord session is active
	if (!session) {
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
	
	if (account == null || account.accessSecret == null) {
		const twitterAuth: TwitterAuthentication = await TwitterAuth.authLink();
		return {
			redirect: {
				destination: twitterAuth.url,
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};


export default Platform;