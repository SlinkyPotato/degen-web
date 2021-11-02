import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import platformTypes from '../../constants/platformTypes';
import { TwitterApi } from 'twitter-api-v2';
import apiKeys from '../../constants/apiKeys';

export const middleware = async (request: NextRequest, event: NextFetchEvent) => {
	// const session = await getSession();
	const platform = request.page.params?.platform;

	if (platform == null) {
		return new Response('Verification type not found.');
	}

	if (platform === platformTypes.TWITTER) {
		const oAuthToken = request.page.params?.oauth_token;
		const oauthVerifier = request.page.params?.oauth_token;
		console.log(oAuthToken);
		console.log(oauthVerifier);

		if (oAuthToken && oauthVerifier) {
			console.log('present');
			return NextResponse.next();
		}

		const client = new TwitterApi({
			appKey: apiKeys.twitterClientId,
			appSecret: apiKeys.twitterClientSecret,
		});
		// const authLink = (await client.generateAuthLink(apiKeys.twitterCallBackUrl)).url;
		// return NextResponse.redirect(authLink);
		return NextResponse.next();
	}
	return new Response('the end');
};
