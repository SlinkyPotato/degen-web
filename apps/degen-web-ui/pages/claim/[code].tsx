import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Cookies from 'cookies';
import { useRouter } from 'next/router';
import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import { getTwitterAuthService } from '../../src/core/api/twitter-auth.service';
import { AppConfig } from '../../src/core/app.config';
import { AppConstants } from '../../src/core/app.constants';

const Code: NextPage<any> = ({ hasPosted }) => {
  const { data: session, status: loading } = useSession();
  const router = useRouter();
  const code = router.query?.code as string;
  const [hasClaimed, setHasClaimed] = useState(hasPosted);
  const [isTweetLoading, setIsTweetLoading] = useState(false);

  if (loading || isTweetLoading) {
    return <>loading...</>;
  }
  if (!session || !session.isDiscordLinked) {
    signIn('discord').then();
    return <></>;
  }
  if (!hasClaimed) {
    return (
      <>
        <p>
          Clicking this will publish a tweet on your behalf to consent to receive a
          claim link for a POAP at the end of the Twitter Spaces event.
        </p>
        <button
          onClick={() => tweetToClaimPOAP(code, setHasClaimed, setIsTweetLoading)}
        >
          Tweet to Claim POAP
        </button>
      </>
    );
  }

  return <>Thank you! You should receive a POAP after the event has finished.</>;
};

const tweetToClaimPOAP = async (
  code: string,
  setHasClaimed: any,
  setIsTweetLoading: any
): Promise<void> => {
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const session = await getSession(context);
  const twitterAuthService = await getTwitterAuthService(context.req);

  if (!session) {
    return {
      props: {},
    };
  }

  const claimCode = context.params?.code as string;

  if (!(await twitterAuthService.isTwitterLinked((session.user as any).id))) {
    console.log('twitter account not linked');
    const cookies = new Cookies(context.req, context.res, {
      keys: [AppConfig.SECRET],
    });
    cookies.set(AppConstants.COOKIE_REDIRECT_PATH, `/claim/${claimCode}`);

    const twitterAuth = await twitterAuthService.authLink();
    return {
      redirect: {
        destination: twitterAuth.url,
        permanent: false,
      },
    };
  }
  // TODO: Revist and merge with Reece/cornbread merge
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
