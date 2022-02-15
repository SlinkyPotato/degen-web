import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Cookies from 'cookies';
import { getSession, signIn, useSession } from 'next-auth/react';
import { PlatformTypes } from '../../src/core/enums/platform-types.enum';
import { AppConstants } from '../../src/core/app.constants';
import { getTwitterAuthService } from '../../src/core/api/twitter-auth.service';
import { AppConfig } from '../../src/core/app.config';
import { Session } from 'next-auth';

const Platform: NextPage<any> = () => {
  const { data: session, status: loading } = useSession();
  if (loading) {
    return <>loading...</>;
  }
  if (!session || !session.isDiscordLinked) {
    signIn('discord').then();
    return <></>;
  }
  return <>Twitter account linked. (This page can be closed).</>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
  const session = (await getSession(context)) as Session & { user: { id: string } };
  const twitterAuthService = await getTwitterAuthService(context.req);
  const platform = context.params?.platform;

  if (platform !== PlatformTypes.Twitter) {
    return {
      props: {},
    };
  }

  // Verify discord session is active
  if (!session) {
    return {
      props: {},
    };
  }
  const isTwitterLinked: boolean | void = await twitterAuthService
    .isTwitterLinked(session.user.id)
    .catch(console.warn);

  if (!isTwitterLinked) {
    const cookies = new Cookies(context.req, context.res, { keys: [AppConfig.SECRET] });
    cookies.set(AppConstants.COOKIE_REDIRECT_PATH, '/verification/twitter');

    const twitterAuth = await twitterAuthService.authLink();
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

export default Platform;
