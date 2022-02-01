import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

export interface MetamaskButtonProps {
  message?: string;
}

const injected = new InjectedConnector({});

const MetamaskButton = ({
  message = 'Connect Wallet',
}: MetamaskButtonProps) => {
  const { activate } = useWeb3React();

  const connectMetamask = async () => {
    await activate(injected);
  };

  return (
    <Button colorScheme="teal" variant="outline" onClick={() => connectMetamask()}>
      {message}
    </Button>
  );
};

export default MetamaskButton;
