import {
  getTwitterAuthService,
  TwitterAuthService,
} from './../../../src/core/api/twitter-auth.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';
import { TweetV1, UserV1 } from 'twitter-api-v2/dist/types';
import { Collection, Db } from 'mongodb';
import { Session } from 'next-auth';
import dayjs, { Dayjs } from 'dayjs';
import { getSession } from 'next-auth/react';
import { ServerGlobals } from '../../../src/server';

const tweet = async (req: NextApiRequest, resp: NextApiResponse) => {
  const session = await getSession({ req: req });
  const twitterAuthService = await getTwitterAuthService(req);

  if (session == null || !session.isTwitterLinked) {
    console.warn('not authorized 404');
    resp.status(401).send('Not authorized');
    return;
  }

  switch (req.method) {
    case 'POST':
      await postTweet(session, req, resp, twitterAuthService, req.body?.code);
      return;
    case 'GET':
      await checkTweet(session, req, resp, twitterAuthService);
      return;
    default:
      console.warn('not found 404');
      resp.status(404).send('Not found.');
  }
};

const postTweet = async (
  session: Session,
  req: NextApiRequest,
  resp: NextApiResponse,
  twitterAuthService: TwitterAuthService,
  code?: string
): Promise<void> => {
  const collections = ((req as any).app.globals as ServerGlobals).collections;
  console.log('starting to post tweet');

  if (code == null) {
    console.warn('missing claim code');
    resp.status(400).send('Missing claim code.');
    return;
  }

  const client: TwitterApi = twitterAuthService.clientV1(
    (session as any).twitterAccessToken,
    (session as any).twitterAccessSecret
  );
  const twitterUser: UserV1 = await client.currentUser();
  const tweetResult: TweetV1 = await client.v1.tweet(
    `I consent to receiving a #POAP claim link for attending https://twitter.com/i/spaces/${code} via @banklessDAO`
  );
  const tweetId: string = tweetResult.id_str;

  if (tweetId == null) {
    resp.status(200).send('Failed to tweet twitter spaces status');
    return;
  }
  const organizerSettings = await collections.poapTwitterSettings.findOne({
    isActive: true,
    twitterSpaceId: code,
  });

  if (organizerSettings == null) {
    console.warn('twitter settings not found');
    resp.status(404).send('Twitter event settings not found.');
    return;
  }

  const currentDate: Dayjs = dayjs();
  const result = await collections.poapTwitterParticipants.findOneAndReplace(
    {
      twitterSpaceId: code,
      twitterUserId: twitterUser.id_str,
    },
    {
      twitterSpaceId: code,
      twitterUserId: twitterUser.id_str,
      tweetId: tweetId,
      dateOfTweet: currentDate.toISOString(),
    },
    {
      upsert: true,
    }
  );

  if (result.ok == 1) {
    resp.status(200).send({
      description: 'Success',
      tweetId: tweetId,
    });
    return;
  }

  resp.status(500).send('Failed');
};

const checkTweet = async (
  session: Session,
  req: NextApiRequest,
  resp: NextApiResponse,
  twitterAuthService: TwitterAuthService
) => {
  console.log('starting to check if tweet was posted');
  const code: string = req.query.code as string;
  const collections = ((req as any).app.globals as ServerGlobals).collections;

  if (code == null) {
    console.warn('missing claim code');
    resp.status(400).send('Missing claim code');
    return;
  }
  const client: TwitterApi = twitterAuthService.clientV1(
    (session as any).twitterAccessToken,
    (session as any).twitterAccessSecret
  );
  const currentTwitterUser: UserV1 = await client.currentUser();

  const result = await collections.poapTwitterParticipants.findOne({
    twitterSpaceId: code,
    twitterUserId: currentTwitterUser.id_str,
  });

  if (result == null || result.tweetId == null) {
    console.log('tweet not found in db');
    resp.status(200).send({
      hasPosted: false,
    });
    return;
  }

  const tweet: TweetV1 = await client.v1.singleTweet(result.tweetId);

  if (
    tweet == null ||
    tweet.user == null ||
    tweet.user.id_str != currentTwitterUser.id_str
  ) {
    console.log('tweet not found');
    resp.status(200).send({
      hasPosted: false,
    });
    return;
  }

  resp.status(200).send({
    hasPosted: true,
  });
};

export default tweet;
