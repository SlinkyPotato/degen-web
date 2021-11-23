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
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import Log from '../../utils/Log';

const Code: NextPage<any> = ({ hasPosted }) => {
    const [session, loading] = useSession();
    const router = useRouter();
    const code = router.query?.code as string;
    const [hasClaimed, setHasClaimed] = useState(hasPosted);
    const [isTweetLoading, setIsTweetLoading] = useState(false);
    
    if (loading || isTweetLoading) {
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
              <button onClick={() => tweetToClaimPOAP(code, setHasClaimed, setIsTweetLoading)}>Tweet to Claim POAP</button>
          </>
        );
    }
    
    return (
      <>
          Thank you! You should receive a POAP after the event has finished.
      </>
    );
};

const tweetToClaimPOAP = async (code: string, setHasClaimed: any, setIsTweetLoading: any): Promise<void> => {
    try {
        setIsTweetLoading(true);
        axios.post('/api/poap/tweet', { code: code }).then((response: AxiosResponse) => {
            setIsTweetLoading(false);
            if (response.status === 200) {
                setHasClaimed(true);
            }
        });
    } catch (e) {
        console.error('failed to tweet twitter space for user', e);
    }
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
        Log.debug('twitter account not linked');
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
    // const res = await fetch(`/api/poap/tweet?code=${claimCode}`);
    // const data = await res.json();
    //
    // if (res.status != 200 || data == null) {
    //     return {
    //         props: {
    //             hasPosted: false,
    //         },
    //     };
    // }
    // return {
    //     props: {
    //         hasPosted: data.hasPosted,
    //     },
    // };
    return {
        props: {
            hasPosted: false,
        },
    };
};

export default Code;