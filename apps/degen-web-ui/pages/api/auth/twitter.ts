import { AppConfig } from './../../../src/core/app.config';
import { getTwitterAuthService } from './../../../src/core/api/twitter-auth.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import Cookies from 'cookies';
import { getSession } from 'next-auth/react';
import { AppConstants } from '../../../src/core/app.constants';

const twitter = async (req: NextApiRequest, resp: NextApiResponse) => {
  console.log('calling twitter auth api');
  const session: Session | null = await getSession({ req: req });
  const twitterAuthService = await getTwitterAuthService(req);

  if (session == null) {
    console.warn('not authorized 401');
    resp.status(401).send('Not authorized.');
    return;
  }

  if (req.method !== 'GET') {
    console.warn('not found 404');
    resp.status(404).send('Not found.');
    return;
  }

  const oAuthToken = req.query.oauth_token as string;
  const oAuthVerifier = req.query.oauth_verifier as string;

  const didRun: boolean = await twitterAuthService.runCallBack(
    (session.user as any).id,
    oAuthToken,
    oAuthVerifier
  );

  if (!didRun) {
    resp.status(500).send('Failed');
  }

  const cookies = new Cookies(req, resp, { keys: [AppConfig.SECRET] });
  const redirectURL: string = cookies.get(AppConstants.COOKIE_REDIRECT_PATH);

  resp.redirect(redirectURL);
};

export default twitter;
