import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextPage,
} from 'next';
import { getSession, signIn, useSession } from 'next-auth/client';
import { TwitterApi } from 'twitter-api-v2';
import { UserV1 } from 'twitter-api-v2/dist/types';
import TwitterAuth, { TwitterAuthentication } from '../../utils/TwitterAuth';
import Cookies from 'cookies';
import constants from '../../constants/constants';
import cookieKeys from '../../constants/cookieKeys';

const Code: NextPage<any> = ({ userV1 }) => {
    const [session, loading] = useSession();
    if (loading) {
        return (
            <>loading...</>
        );
    }
    if (!session || !session.isDiscordLinked) {
        signIn('discord').then();
        return (
          <></>
        );
    }
    return (
      <>
          <button onClick={() => tweetToClaimPOAP(userV1, null)}>Tweet to Claim POAP</button>
      </>
    );
};

const tweetToClaimPOAP = async (userV1: UserV1, claimCode: string) => {
    console.log(userV1);
};

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    const session = await getSession(context);

    if (!session) {
        return {
            props: {},
        };
    }

    const claimCode = context.params?.code as string;
    
    if (!(await TwitterAuth.isTwitterLinked(session.user.id))) {
        const cookies = new Cookies(context.req, context.res, { keys: [constants.SECRET_KEY] });
        cookies.set(cookieKeys.redirectPath, `/claim/${claimCode}`);

        const twitterAuth: TwitterAuthentication = await TwitterAuth.authLink();
        return {
            redirect: {
                destination: twitterAuth.url,
                permanent: false,
            },
        };
    }

    const client: TwitterApi = TwitterAuth.clientV1(session.twitterAccessToken, session.twitterAccessSecret);
    const userV1: UserV1 = await client.v1.verifyCredentials();
    
    return {
        props: {
            userV1: userV1,
        },
    };
};

export default Code;