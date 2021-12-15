import { signIn, signOut, useSession } from 'next-auth/client';

const SignInComponent = () => {
	const [session] = useSession();
	return (
		<>
			{!session && (
				<>
				Not signed in <br />
					<button onClick={() => signIn()}>Sign in</button>
				</>
			)}
			{session && (
				<>
				Signed in as {session.user?.name} <br />
					<button onClick={() => signOut()}>Sign out</button>
				</>
			)}
		</>
	);
};

export default SignInComponent;