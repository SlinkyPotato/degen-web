import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/client';

const Code: NextPage<any> = () => {
    const [session, loading] = useSession();
    if (loading) {
        return (
            <>loading...</>
        );
    }
    if (!session || !session.isTwitterLinked) {
        return (
            <>
                <button onClick={() => signIn('twitter', {}).then()}>Sign in to Twitter</button>
            </>
        );
    }
    return (
        <>
            <p>isTwitterLinked: {session.isTwitterLinked ? 'true' : 'false'}</p>
            <p>isDiscordLinked: {session?.isDiscordLinked ? 'true' : 'false'}</p>
        </>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    const claimCode = context.params?.code;
    console.log(claimCode);
    return {
        props: {},
    };
};

export default Code;