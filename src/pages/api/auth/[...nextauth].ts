import NextAuth from 'next-auth';
import apiKeys from '../../../constants/apiKeys';
import constants from '../../../constants/constants';
import Providers from 'next-auth/providers';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
	// https://next-auth.js.org/configuration/providers
	providers: [
		// Providers.Twitter({
		// 	clientId: apiKeys.twitterClientId,
		// 	clientSecret: apiKeys.twitterClientSecret,
		// 	profileUrl: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=false',
		// }),

		Providers.Discord({
			clientId: apiKeys.discordClientId,
			clientSecret: apiKeys.discordClientSecret,
			scope: 'identify',
		}),
	],

	database: constants.MONGODB_URI_PARTIAL + constants.DB_NAME_DEGEN + constants.MONGODB_OPTIONS,

	// The secret should be set to a reasonably long random string.
	// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
	// a separate secret is defined explicitly for encrypting the JWT.
	secret: process.env.SECRET,

	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `jwt` is automatically set to `true` if no database is specified.
		jwt: false,

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
		// A secret to use for key generation (you should set this explicitly)
		// secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
		// Set to true to use encryption (default: false)
		// encryption: true,
		// You can define your own encode/decode functions for signing and encryption
		// if you want to override the default behaviour.
		// encode: async ({ secret, token, maxAge }) => {},
		// decode: async ({ secret, token, maxAge }) => {},
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
	// 	async signIn(user) {
	// 		// console.log('signin flow');
	// 		// console.log(user);
	// 		// console.log('-');
	// 		return true;
	// 	},
		async redirect(url, baseUrl) {
			return baseUrl + '/verification?type=twitter';
		},
	// 	async session(session, user) {
	// 		// console.log(session);
	// 		// console.log(user);
	// 		return session;
	// 	},
	// 	// async jwt(token, user, account, profile, isNewUser) { return token }
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
	theme: 'light',

	// Enable debug messages in the console if you are having problems
	debug: false,
});
