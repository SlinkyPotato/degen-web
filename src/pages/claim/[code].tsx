import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextPage,
} from 'next';
import { getSession, signIn, useSession } from 'next-auth/client';
import TwitterAuth, { TwitterAuthentication } from '../../utils/TwitterAuth';
import Cookies from 'cookies';
import constants from '../../constants/constants';
import cookieKeys from '../../constants/cookieKeys';
import { useRouter } from 'next/router';
import axios from 'axios';

const Code: NextPage<any> = () => {
    const [session, loading] = useSession();
    const router = useRouter();
    const code = router.query?.code as string;
    let hasClaimed = false;
    
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
    if (!hasClaimed) {
        return (
          <>
              <button onClick={async () => hasClaimed = await tweetToClaimPOAP(code)}>Tweet to Claim POAP</button>
          </>
        );
    }
    
    return (
      <>
          Thank you! You should receive a POAP after the event has finished.
      </>
    );
};

const tweetToClaimPOAP = async (code: string): Promise<boolean> => {
    try {
        const result = await axios.post('/api/poap/claim', { code: code });
        return result.status === 200;
    } catch (e) {
        console.error('failed to tweet twitter space for user', e);
    }
    return false;
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
    
    return {
        props: {},
    };
};

export default Code;