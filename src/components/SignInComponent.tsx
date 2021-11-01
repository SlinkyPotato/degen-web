import { signIn, signOut, useSession } from 'next-auth/client';

const SignInComponent = () => {
	const { data: session }: any = useSession();
	if (session) {
		return (
			<>
				Signed in as {session.user.name} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			Sync Accounts <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
};

export default SignInComponent;