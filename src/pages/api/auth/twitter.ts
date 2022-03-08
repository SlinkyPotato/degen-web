import { NextApiRequest, NextApiResponse } from 'next';
import TwitterAuth from '../../../utils/TwitterAuth';
import { getSession } from 'next-auth/client';
import { Session } from 'next-auth';
import Cookies from 'cookies';
import constants from '../../../constants/constants';
import cookieKeys from '../../../constants/cookieKeys';
import Log from '../../../utils/Log';

const twitter = async (request: NextApiRequest, response: NextApiResponse) => {
	Log.debug('calling twitter auth api');
	const session: Session | null = await getSession({ req: request });

	if (session == null) {
		Log.warn('not authorized 401');
		response.status(401).send('Not authorized.');
		return;
	}

	if (request.method !== 'GET') {
		Log.warn('not found 404');
		response.status(404).send('Not found.');
		return;
	}

	const oAuthToken = request.query.oauth_token as string;
	const oAuthVerifier = request.query.oauth_verifier as string;

	const didRun: boolean = await TwitterAuth.runCallBack(session.user.id, oAuthToken, oAuthVerifier);

	if (!didRun) {
		response.status(500).send('Failed');
	}

	const cookies = new Cookies(request, response, { keys: [constants.SECRET_KEY] });
	const redirectURL: string = cookies.get(cookieKeys.redirectPath);

	response.redirect(redirectURL);
};

export default twitter;