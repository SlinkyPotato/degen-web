import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextPage,
} from 'next';
import platformTypes from '../../constants/platformTypes';
import constants from '../../constants/constants';
import { getSession, signIn, useSession } from 'next-auth/client';
import TwitterAuth, { TwitterAuthentication } from '../../utils/TwitterAuth';
import Cookies from 'cookies';
import cookieKeys from '../../constants/cookieKeys';
import Log from '../../utils/Log';
import { Session } from 'next-auth';
import ZoomAuth from '../../utils/ZoomAuth';

const Platform: NextPage<any> = (props) => {
	const [session, loading] = useSession();
	if (loading) {
		return (
			<>loading...</>
		);
	}
	if (!session || !session.isDiscordLinked) {
		signIn('discord').then();
		if(props.provider === platformTypes.ZOOM) {
			signIn(platformTypes.ZOOM).then();
		}

		return (
			<></>
		);
	}

	if(props.provider === platformTypes.ZOOM) {
		if (!session.isZoomLinked) {
			signIn(platformTypes.ZOOM).then(() => {
				return (
					<> Zoom Account linked. (This page can be closed).</>
				);
				},
			).catch(() => {
				return (
					<> Failed to link Zoom account. (This page can be closed).</>
				);
				},
			);
		}
	}

	return (
		<>
			Account linked. (This page can be closed).
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
	const session = await getSession(context);
	const platform = context.params?.platform;

	if (!(Object.values(platformTypes).indexOf(platform as string) > -1)) {
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

	switch(platform) {
		case platformTypes.TWITTER:
			return await authenticateTwitter(context, session);

		case platformTypes.ZOOM:
			return await authenticateZoom(context, session, platformTypes.ZOOM) as any;
	}

	return {
		props: {},
	};
};


export default Platform;

const authenticateTwitter = async (context: GetServerSidePropsContext, session: Session) => {
	const isTwitterLinked: boolean | void = await TwitterAuth.isTwitterLinked(session.user.id).catch(Log.warn);

	if (!(isTwitterLinked)) {

		const cookies = new Cookies(context.req, context.res, { keys: [constants.SECRET_KEY] });
		cookies.set(cookieKeys.redirectPath, '/verification/twitter');

		const twitterAuth: TwitterAuthentication = await TwitterAuth.authLink();
		return {
			redirect: {
				destination: twitterAuth.url,
				permanent: false,
			},
		};
	}
};

const authenticateZoom = async (context: GetServerSidePropsContext, session: Session, provider: string) => {
	const isZoomLinked: boolean | void = await ZoomAuth.isZoomLinked(session.user.id).catch(Log.warn);

	if (!(isZoomLinked)) {

		const cookies = new Cookies(context.req, context.res, { keys: [constants.SECRET_KEY] });
		cookies.set(cookieKeys.redirectPath, '/verification/zoom');

		session.isZoomLinked = false;

		return {
			redirect: {
				destination: ZoomAuth.getAuthUrl(),
				permanent: false,
			},
		};
	}

	return {
		props: {
			provider: provider,
		},
	};
};