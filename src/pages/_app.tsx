import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
// https://next-auth.js.org/getting-started/upgrade-v4
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}