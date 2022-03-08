import { getProviders, signIn } from 'next-auth/client';
import { NextAuthOptions } from 'next-auth';

export default function SignIn({ providers }: NextAuthOptions) {
    return (
        <>
            {Object.values(providers).map((provider) => (
                provider.name === 'Discord' ?
                <div key={provider.name}>
                    <button onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                    </button>
                </div> : <div></div>))}
        </>
    );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: { providers },
    };
}
