const constants = Object.freeze({
	DB_NAME_DEGEN: 'degen',
	DB_NAME_NEXTAUTH: 'nextauth',

	DB_COLLECTION_POAP_SETTINGS: 'poapSettings',
	DB_COLLECTION_POAP_PARTICIPANTS: 'poapParticipants',
	DB_COLLECTION_POAP_ADMINS: 'poapAdmins',

	DB_COLLECTION_NEXT_AUTH_SESSIONS: 'sessions',
	DB_COLLECTION_NEXT_AUTH_ACCOUNTS: 'accounts',
	DB_COLLECTION_NEXT_AUTH_CACHE: 'cache',

	MONGODB_URI_PARTIAL: `${process.env.MONGODB_PREFIX}://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}/`,
	MONGODB_OPTIONS: '?retryWrites=true&w=majority',
});

export default constants;