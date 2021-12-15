import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import Log from '../../../utils/Log';
import { TwitterApi } from 'twitter-api-v2';
import TwitterAuth from '../../../utils/TwitterAuth';
import { TweetV1, UserV1 } from 'twitter-api-v2/dist/types';
import { Collection, Db, FindAndModifyWriteOpResultObject } from 'mongodb';
import MongoDBUtils from '../../../utils/MongoDBUtils';
import constants from '../../../constants/constants';
import { POAPTwitterParticipants } from '../../../models/POAPTwitterParticipants';
import { Session } from 'next-auth';
import { POAPTwitterSettings } from '../../../models/POAPTwitterSettings';
import dayjs, { Dayjs } from 'dayjs';

const tweet = async (request: NextApiRequest, response: NextApiResponse) => {
	const session = await getSession({ req: request });
	
	if (session == null || !session.isTwitterLinked) {
		Log.warn('not authorized 404');
		response.status(401).send('Not authorized');
		return;
	}
	
	switch(request.method) {
		case 'POST':
			await postTweet(session, response, request.body?.code);
			return;
		case 'GET':
			await checkTweet(session, request, response);
			return;
		default:
			Log.warn('not found 404');
			response.status(404).send('Not found.');
	}
};

const postTweet = async (session: Session, response: NextApiResponse, code?: string): Promise<void> => {
	Log.debug('starting to post tweet');
	
	if (code == null) {
		Log.warn('missing claim code');
		response.status(400).send('Missing claim code.');
		return;
	}

	const client: TwitterApi = TwitterAuth.clientV1(session.twitterAccessToken, session.twitterAccessSecret);
	const twitterUser: UserV1 = await client.currentUser();
	const tweetResult: TweetV1 = await client.v1.tweet(`I consent to receiving a #POAP claim link for attending https://twitter.com/i/spaces/${code} via @banklessDAO`);
	const tweetId: string = tweetResult.id_str;

	if (tweetId == null) {
		response.status(200).send('Failed to tweet twitter spaces status');
		return;
	}

	const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_DEGEN);
	
	const poapSettings: Collection<POAPTwitterSettings> = db.collection(constants.DB_COLLECTION_POAP_TWITTER_SETTINGS);
	const organizerSettings: POAPTwitterSettings = await poapSettings.findOne({
		isActive: true,
		twitterSpaceId: code,
	});
	
	if (organizerSettings == null) {
		Log.warn('twitter settings not found');
		response.status(404).send('Twitter event settings not found.');
		return;
	}
	
	const currentDate: Dayjs = dayjs();
	const poapTwitterParticipants: Collection<POAPTwitterParticipants> = db.collection(constants.DB_COLLECTION_POAP_TWITTER_PARTICIPANTS);
	const result: FindAndModifyWriteOpResultObject<POAPTwitterParticipants> = await poapTwitterParticipants.findOneAndReplace({
		twitterSpaceId: code,
		twitterUserId: twitterUser.id_str,
	}, {
		twitterSpaceId: code,
		twitterUserId: twitterUser.id_str,
		tweetId: tweetId,
		dateOfTweet: currentDate.toISOString(),
	}, {
		upsert: true,
	});
	
	if (result.ok == 1) {
		response.status(200).send({
			description: 'Success',
			tweetId: tweetId,
		});
		return;
	}
	
	response.status(500).send('Failed');
};

const checkTweet = async (session: Session, request: NextApiRequest, response: NextApiResponse) => {
	Log.debug('starting to check if tweet was posted');
	const code: string = request.query.code as string;
	
	if (code == null) {
		Log.warn('missing claim code');
		response.status(400).send('Missing claim code');
		return;
	}
	const client: TwitterApi = TwitterAuth.clientV1(session.twitterAccessToken, session.twitterAccessSecret);
	const currentTwitterUser: UserV1 = await client.currentUser();
	
	const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_DEGEN);
	const poapTwitterParticipantsCollection: Collection<POAPTwitterParticipants> = db.collection(constants.DB_COLLECTION_POAP_TWITTER_PARTICIPANTS);
	const result: POAPTwitterParticipants = await poapTwitterParticipantsCollection.findOne({
		twitterSpaceId: code,
		twitterUserId: currentTwitterUser.id_str,
	});
	
	if (result == null || result.tweetId == null) {
		Log.debug('tweet not found in db');
		response.status(200).send({
			hasPosted: false,
		});
		return;
	}
	
	const tweet: TweetV1 = await client.v1.singleTweet(result.tweetId);
	
	if (tweet == null || tweet.user == null || tweet.user.id_str != currentTwitterUser.id_str) {
		Log.debug('tweet not found');
		response.status(200).send({
			hasPosted: false,
		});
		return;
	}
	
	response.status(200).send({
		hasPosted: true,
	});
};

export default tweet;