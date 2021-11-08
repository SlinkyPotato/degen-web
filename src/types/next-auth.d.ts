// Import statement required for model augmentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
	 */
	interface User {
		id?: string,
		name?: string,
		image?: string,
		email?: string,
	}

	interface Session {
		user: User,
		expires?: string,
		accessToken?: string,
		isDiscordLinked?: boolean,
		isTwitterLinked?: boolean,
	}
}