import { NextApiRequest, NextApiResponse } from 'next';
import TwitterAuth from '../../../utils/TwitterAuth';
import { LoginResult } from 'twitter-api-v2/dist/types';
import { getSession } from 'next-auth/client';

const twitter = async (request: NextApiRequest, response: NextApiResponse) => {
	console.log(request);
	console.log(response);
	
	if (request.method !== 'GET') {
		response.status(404).send(null);
		return;
	}

	const oAuthToken = request.query.oauth_token as string;
	const oauthVerifier = request.query.oauth_verifier as string;

	if (oAuthToken == null && oauthVerifier == null) {
		console.log('tokens not given');
		response.status(404).send(null);
		return;
	}

	if (oAuthToken != null && oauthVerifier == null) {
		console.log('authorization not given');
		response.status(401).send('Authorization not given');
		return;
	}

	const oAuthTokenSecret: string = await TwitterAuth.getOAuthTokenSecret(oAuthToken);
	let loginResult: LoginResult;
	try {
		loginResult = await TwitterAuth.login(oAuthToken, oAuthTokenSecret, oauthVerifier);
	} catch (e) {
		console.log('failed login to twitter');
		response.status(500).send('login failed');
		return;
	}

	const session = await getSession({ req: request });
	await TwitterAuth.linkAccount(loginResult, session?.user.id);
	await TwitterAuth.clearCache(oAuthToken);
	
	response.status(200).send({
		twitterUserId: loginResult.userId,
	});
};

export default twitter;