import { Grid, GridItem } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import MetamaskButton from '../src/shared/components/auth/metamask-button.js';
import { useSession } from 'next-auth/react';
import { SessionStatus } from '../src/core/enums/auth.enums';

const Connect = () => {
  const { account, active } = useWeb3React();
  const { data: session, status } = useSession();

  const activatedContent = (
    <div>
      <h1>Account: {account}</h1>
      <h1>Discord: {session?.user?.name}</h1>
    </div>
  );

  return (
    <Grid>
      <GridItem w="50%" h="10">
        {session && status === SessionStatus.Authenticated ? (
          <MetamaskButton activatedContent={active && activatedContent} />
        ) : (
          <h1>Please login with Discord to continue. </h1>
        )}
      </GridItem>
    </Grid>
  );
};

export default Connect;
