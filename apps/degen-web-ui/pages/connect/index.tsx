import { useWeb3React } from '@web3-react/core';
import { useSession } from 'next-auth/react';
import { SessionStatus } from '../../src/core/enums/auth.enums';
import React, { useEffect, useState } from 'react';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { Box } from '@chakra-ui/react';
import ActivatedDiscordPage from './ActivatedDiscordPage';

const Connect = () => {
  const { account, active } = useWeb3React();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (active && session?.user?.id) {
      fetch(`/api/wallet/connect`, {
        method: 'POST',
        body: JSON.stringify({
          account,
          userId: session.user.id,
          username: session.user.name,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      });
    }
  }, [active, session, account]);

  return (
    <GridContainer className="py-6">
      <Box className="col-span-full">
        {session && status === SessionStatus.Authenticated ? (
          <ActivatedDiscordPage />
        ) : (
          <h1>Please login with Discord to continue. </h1>
        )}
      </Box>
    </GridContainer>
  );
};

export default Connect;
