import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { signIn } from 'next-auth/client';

const Code: NextPage<any> = () => {
    return (
        <>
            <button onClick={() => signIn('twitter')}>Sign in to Twitter</button>
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