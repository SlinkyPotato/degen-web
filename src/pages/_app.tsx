import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { Web3ReactProvider } from '@web3-react/core';
import {Web3Provider } from '@ethersproject/providers';

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
// https://next-auth.js.org/getting-started/upgrade-v4
export default function App({ Component, pageProps }: AppProps) {
  
  const getLibrary = (provider) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  };

  return (
    <Provider
      session={pageProps.session}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
      
    </Provider>
  );
}