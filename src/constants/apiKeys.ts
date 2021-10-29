const apiKeys = Object.freeze({
	twitterClientId: process.env.TWITTER_API_TOKEN,
	twitterClientSecret: process.env.TWITTER_API_SECRET,
	twitterBearerToken: process.env.TWITTER_BEARER_TOKEN,
	twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
	twitterSecretToken: process.env.TWITTER_ACCESS_TOKEN_SECRET,
	twitterAuthUrl: process.env.TWITTER_VERIFICATION_URL,

	discordClientId: process.env.DEGEN_CLIENT_ID,
	discordClientSecret: process.env.DEGEN_CLIENT_SECRET,
});

export default apiKeys;