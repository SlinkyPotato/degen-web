import NextAuth  from 'next-auth';
import apiKeys from '../../../constants/apiKeys';
import constants from '../../../constants/constants';
import DiscordProvider from 'next-auth/providers/discord';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { NextAuthDBConn } from '@degen/schema';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
	// https://next-auth.js.org/configuration/providers
	providers: [
		DiscordProvider({
			clientId: apiKeys.discordClientId,
			clientSecret: apiKeys.discordClientSecret,
		}),
	],
	
	adapter: MongoDBAdapter(NextAuthDBConn.getClient().connect()),

	// The secret should be set to a reasonably long random string.
	// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
	// a separate secret is defined explicitly for encrypting the JWT.
	secret: constants.SECRET_KEY,
	
	session: {
		// Choose how you want to save the user session.
		// The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
		// If you use an `adapter` however, we default it to `"database"` instead.
		// You can still force a JWT session by explicitly defining `"jwt"`.
		// When using `"database"`, the session cookie will only contain a `sessionToken` value,
		// which is used to look up the session in the database.
		strategy: 'database',
		
		// Seconds - How long until an idle session expires and is no longer valid.
		// 30 days
		maxAge: 30 * 24 * 60 * 60,
		
		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// 24 hours
		updateAge: 24 * 60 * 60,
	},

	// JSON Web tokens are only used for sessions if the `jwt: true` session
	// option is set - or by default if no database is specified.
	// https://next-auth.js.org/configuration/options#jwt
	jwt: {
		// The maximum age of the NextAuth.js issued JWT in seconds.
		// Defaults to `session.maxAge`.
		// maxAge: 60 * 60 * 24 * 30,
		// You can define your own encode/decode functions for signing and encryption
		// async encode() {},
		// async decode() {},
	},

	// You can define custom pages to override the built-in ones. These will be regular Next.js pages
	// so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
	// The routes shown here are the default URLs that will be used when a custom
	// pages is not specified for that route.
	// https://next-auth.js.org/configuration/pages
	pages: {
		// signIn: '/auth/signin',  // Displays signin buttons
		// signOut: '/auth/signout', // Displays form with sign out button
		// error: '/auth/error', // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // Used for check email page
		// newUser: null // If set, new users will be directed here on first sign in
	},

	// Callbacks are asynchronous functions you can use to control what happens
	// when an action is performed.
	// https://next-auth.js.org/configuration/callbacks
	callbacks: {
		// async signIn(user, ) {
		// 	// console.log('signin flow');
		// 	// console.log(user);
		// 	// console.log('-');
		// 	return true;
		// },
	// 	async redirect(url: string, baseUrl: string) {
	// 		return baseUrl + '/verification/twitter';
	// 	},
	// 	async session(session: Session, user: User) {
	// 		session.user.id = user.id;
	// 		const db: Db = await MongoDBUtils.connectDb(constants.DB_NAME_NEXTAUTH);
	// 		const accountCollection: Collection = db.collection(constants.DB_COLLECTION_NEXT_AUTH_ACCOUNTS);
	//
	// 		const accountsCollection: Cursor<AccountCollection> = await accountCollection.find({
	// 			userId: ObjectId(session.user.id),
	// 		});
	//
	// 		session.isDiscordLinked = false;
	// 		await accountsCollection.forEach(account => {
	// 			if (account.providerId == 'discord') {
	// 				session.isDiscordLinked = true;
	// 			}
	// 			if (account.providerId == 'twitter') {
	// 				session.isTwitterLinked = true;
	// 				session.twitterAccessToken = account.accessToken;
	// 				session.twitterAccessSecret = account.accessSecret;
	// 			}
	// 		});
	// 		return session;
	// 	},

		// async jwt(token: JWT, user: User | undefined, account: Account | undefined, profile: Profile | undefined, isNewUser: boolean | undefined) {
		// 	// console.log(profile);
		// 	return token;
		// },
	},

	// Events are useful for logging
	// https://next-auth.js.org/configuration/events
	events: {
	// 	linkAccount: async ({ user, providerAccount }) => {
	// 		// console.log(user);
	// 		// console.log(providerAccount);
	// 	},
	},

	// You can set the theme to 'light', 'dark' or use 'auto' to default to the
	// whatever prefers-color-scheme is set to in the browser. Default is 'auto'
	theme: {
		colorScheme: 'light', // "auto" | "dark" | "light"
		brandColor: '', // Hex color code
		logo: '', // Absolute URL to image
	},
	
	// Enable debug messages in the console if you are having problems
	debug: false,
});
