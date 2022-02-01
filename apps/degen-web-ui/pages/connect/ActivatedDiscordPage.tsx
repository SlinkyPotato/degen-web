import MetamaskButton from '../../src/shared/components/auth/metamask-button';
import { useWeb3React } from '@web3-react/core';
import Tipping from './Tipping';

const ActivatedDiscordPage = () => {
  const { active } = useWeb3React();
  
  return ( 
    <>
      {
        active ? 
        <Tipping /> : 
        <MetamaskButton />
      }
    </>
  );
};

export default ActivatedDiscordPage;