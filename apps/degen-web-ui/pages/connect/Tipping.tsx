import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import bankTokenAbi from './bankTokenAbi.json';
import { TippingParams } from 'apps/degen-web-ui/src/core/interfaces/tipping-params';

const Tipping = () => {
    const { account, library } = useWeb3React();
    const { data: session } = useSession();
    const [tipRecipient, setTipRecipient] = useState();
    const [tipQuantity, setTipQuantity] = useState(BigNumber.from(0));
    const contract = new ethers.Contract('0xDB7Cb471dd0b49b29CAB4a1C14d070f27216a0Ab', bankTokenAbi, library.getSigner())

    const MULTIPLIER = '1000000000000000000';


    useEffect(() => {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop.toString()),
      });
      const { quantity, recipient } = (params as TippingParams);
      if (quantity && recipient) {
        setTipRecipient(params['recipient']);
        const num = BigNumber.from(params['quantity']).mul(MULTIPLIER);
        setTipQuantity(num);
      }
        
    }, []);

    const handleApproveTip = async () => {
        try {
          if (!tipQuantity) return;
          const tx = await contract.transfer(tipRecipient, tipQuantity?.toString());
          await tx.wait();
        } catch (e) {
            console.error(e?.data?.message || e);
        }
        
    };
  
    const activatedContent = (
        <div>
          <h1><b>Account:</b> {account}</h1>
          <h1><b>Discord: </b>{session?.user?.name}</h1>
          {
            (tipQuantity && tipRecipient) && <>
                      <h1><b>Tip Recipient:</b> {tipRecipient}</h1>
          <h1><b>Quantity ($BANK): </b>{tipQuantity?.div?.(MULTIPLIER)?.toString()}</h1>
          <Button colorScheme="red" variant="outline" onClick={handleApproveTip}>Approve Tip</Button>

            </>

          }
        </div>
      );

      return (
        activatedContent
      );
};

export default Tipping;