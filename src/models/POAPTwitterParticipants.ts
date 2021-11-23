import { Collection } from 'mongodb';

export interface POAPTwitterParticipants extends Collection {
	twitterUserId: string,
	twitterSpaceId: string,
	tweetId: string,
	dateOfTweet: string,
}