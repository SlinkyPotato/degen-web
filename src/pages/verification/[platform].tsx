import {
	GetStaticPaths,
	GetStaticPropsContext,
	GetStaticPropsResult,
	NextPage,
} from 'next';
import platformTypes from '../../constants/platformTypes';
import apiKeys from '../../constants/apiKeys';
import { TwitterApi } from 'twitter-api-v2';

type VerificationProps = {
	authLink: string,
}

const Platform: NextPage<any> = ({ authLink }: VerificationProps) => {

	if (authLink == null || authLink == '') {
		return (
			<p>Verification type not found.</p>
		);
	}

	// window.open(authLink, '_self');
	return (
		<>
			Twitter account linked. Twitter spaces is now activated!
		</>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [
			{ params: { platform: platformTypes.TWITTER } },
		],
		fallback: false,
	};
};

export const getStaticProps = async (context: GetStaticPropsContext): Promise<GetStaticPropsResult<VerificationProps>> => {
	const platform = context.params?.platform;
	let authLink = '';
	if (platform === platformTypes.TWITTER) {
		const client = new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
		});
		authLink = (await client.generateAuthLink(apiKeys.twitterCallBackUrl)).url;
	}

	return {
		props: {
			authLink: authLink,
		},
	};
};

export default Platform;