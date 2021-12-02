import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
const injected = new InjectedConnector();

const MetamaskButton = ({ message = 'Connect Wallet', activatedContent, callback }) => {
  const { activate, active } = useWeb3React();

  const connectMetamask = async () => {
    await activate(injected);
    callback?.();
  };

  const metamaskButton = (
    <Button colorScheme="teal" variant="outline" onClick={() => connectMetamask()}>
      {message}
    </Button>
  );

  return <>{active ? activatedContent || metamaskButton : metamaskButton}</>;
};

export default MetamaskButton;
