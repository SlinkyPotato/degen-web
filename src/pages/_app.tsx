import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
// https://next-auth.js.org/getting-started/upgrade-v4
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider
      session={pageProps.session}
    >
      <Component {...pageProps} />
    </Provider>
  );
}