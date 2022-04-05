import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

export interface MetamaskButtonProps {
  message?: string;
  activatedContent?: any;
  callback?: () => any;
}

const injected = new InjectedConnector({});

export const MetamaskButton = ({
  message = 'Connect Wallet',
  activatedContent,
  callback,
}: MetamaskButtonProps) => {
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
