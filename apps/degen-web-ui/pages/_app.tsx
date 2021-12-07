import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import theme from '../src/core/chakra-theme';
import './styles.scss';
import React from 'react';
import { Layout } from '../src/shared/components/layout/layout';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ActiveGuildProvider } from '../src/shared/components/context/guild.context';

function CustomApp({ Component, pageProps }: AppProps) {
  const getLibrary = (provider) => new Web3Provider(provider);

  return (
    <>
      <Head>
        <title>Degen Bot</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <SessionProvider session={pageProps.session}>
            <ActiveGuildProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ActiveGuildProvider>
          </SessionProvider>
        </Web3ReactProvider>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
