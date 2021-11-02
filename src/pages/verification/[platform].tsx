import {
	GetServerSidePropsContext,
	NextPage,
} from 'next';
import platformTypes from '../../constants/platformTypes';
import apiKeys from '../../constants/apiKeys';
import { TwitterApi, UserV1 } from 'twitter-api-v2';
import { LoginResult } from 'twitter-api-v2/dist/types';

const Platform: NextPage<any> = () => {
	return (
		<>
			Twitter account linked. Twitter spaces is now activated!
		</>
	);
};

// export const getStaticPaths: GetStaticPaths = async () => {
// 	return {
// 		paths: [
// 			{ params: { platform: platformTypes.TWITTER } },
// 		],
// 		fallback: false,
// 	};
// };

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	const platform = context.params?.platform;

	if (platform === platformTypes.TWITTER) {

		const oAuthToken = context.query.oauth_token as string;
		const oauthVerifier = context.query?.oauth_verifier as string;

		if (oAuthToken && oauthVerifier) {

			const client = new TwitterApi({
				appKey: apiKeys.twitterClientId,
				appSecret: apiKeys.twitterClientSecret,
				accessToken: oAuthToken,
				accessSecret: apiKeys.twitterSecretToken,
			});

			const loginResult: LoginResult = await client.login(oauthVerifier);
			const loggedUser: UserV1 = await loginResult.client.v1.verifyCredentials();
			console.log(loggedUser);
			return {
				redirect: {
					destination: '/',
					permanent: true,
				},
			};
		}

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

	return {
		props: {},
	};
};

export default Platform;