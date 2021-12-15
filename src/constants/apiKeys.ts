const apiKeys = Object.freeze({
	twitterClientId: process.env.TWITTER_API_TOKEN as string,
	twitterClientSecret: process.env.TWITTER_API_SECRET as string,
	twitterBearerToken: process.env.TWITTER_BEARER_TOKEN as string,
	twitterAccessToken: process.env.TWITTER_ACCESS_TOKENas as string,
	twitterSecretToken: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
	twitterCallBackUrl: process.env.TWITTER_CALLBACK_URL as string,

	discordClientId: process.env.DEGEN_CLIENT_ID as string,
	discordClientSecret: process.env.DEGEN_CLIENT_SECRET as string,
	
	logDNAToken: process.env.LOGDNA_TOKEN as string,
	logDNAAppName: process.env.LOGDNA_APP_NAME as string,
	logDNADefault: process.env.LOGDNA_DEFAULT_LEVEL as string,
});

export default apiKeys;