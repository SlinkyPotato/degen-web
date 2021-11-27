import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import theme from '../src/core/chakra-theme';
import './styles.scss';
import React from 'react';
import { Layout } from '../src/shared/components/layout/layout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Degen Bot</title>
      </Head>
      <ChakraProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
