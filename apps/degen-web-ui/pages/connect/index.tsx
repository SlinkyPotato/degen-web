import { useWeb3React } from '@web3-react/core';
import { useSession } from 'next-auth/react';
import { SessionStatus } from '../../src/core/enums/auth.enums';
import React, { useEffect } from 'react';
import { GridContainer } from '../../src/shared/components/layout/grid-container';
import { Box } from '@chakra-ui/react';
import ActivatedDiscordPage from './ActivatedDiscordPage';
import { DiscordSession } from '../../src/core/interfaces/auth-session';

const Connect = () => {
  const { account, active } = useWeb3React();
  const { data: session, status } = useSession();
  const { user } = (session as DiscordSession);

  useEffect(() => {
    if (active && (user?.id)) {
      fetch('/api/wallet/connect', {
        method: 'POST',
        body: JSON.stringify({
          account,
          userId: user?.id,
          username: user.name,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      });
    }
  }, [active, account]);

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
