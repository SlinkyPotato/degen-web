import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextPage,
} from 'next';
import { getSession, signIn, useSession } from 'next-auth/client';
import { TwitterApi } from 'twitter-api-v2';
import TwitterAuth, { TwitterAuthentication } from '../../utils/TwitterAuth';
import Cookies from 'cookies';
import constants from '../../constants/constants';
import cookieKeys from '../../constants/cookieKeys';
import { useRouter } from 'next/router';

const Code: NextPage<any> = ({ twitterClient }) => {
    const [session, loading] = useSession();
    const router = useRouter();
    const code = router.query?.code as string;
    
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
          <button onClick={() => tweetToClaimPOAP(twitterClient, code)}>Tweet to Claim POAP</button>
      </>
    );
};

const tweetToClaimPOAP = async (client: TwitterApi, code: string) => {
    console.log(code);
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
    // const result = await client.v1.tweet(`I consent to receiving a #POAP claim link for attending https://twitter.com/i/spaces/${claimCode} via @banklessDAO`);
    console.log(client);
    // TODO: create post to twitter api
    return {
        props: {
            twitterClient: {},
        },
    };
};

export default Code;