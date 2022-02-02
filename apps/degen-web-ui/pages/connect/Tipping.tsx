import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {BigNumber} from "@ethersproject/bignumber";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import bankTokenAbi from './bankTokenAbi.json';

const Tipping = () => {
    const { account, library } = useWeb3React();
    const { data: session } = useSession();
    const [tipRecipient, setTipRecipient] = useState();
    const [tipQuantity, setTipQuantity] = useState();
    const contract = new ethers.Contract("0xDB7Cb471dd0b49b29CAB4a1C14d070f27216a0Ab", bankTokenAbi, library.getSigner())
    console.log(`CONTRACT`)
    console.log(contract)
    const MULTIPLIER = "1000000000000000000";


    useEffect(() => {
      console.log(`HREF`)
      console.log(window.location.href);
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop.toString()),
      });
      console.log(params)
      const {quantity, recipient} = params;
      console.log(`QUANTITY: ${quantity} ${typeof quantity} ${!!quantity}`)
      console.log(`RECIPIENT: ${recipient} ${typeof recipient}`)
      if (quantity && recipient) {
        setTipRecipient(params["recipient"]);
        const num = BigNumber.from(params["quantity"]).mul(MULTIPLIER);
        console.log(`BIG NUMBER: ${num}`)
        console.log(num);
        setTipQuantity(num);
      }
        
    }, []);

    const handleApproveTip = async() => {
        // TODO: send tx with useWeb3React()
        console.log(account)
        try {
          if (!tipQuantity) return;
          const tx = await contract.transfer(tipRecipient, tipQuantity?.toString());
          console.log(tx)
          await tx.wait();
          console.log(tx)
        } catch (e) {
            console.log("TX ERROR")
            console.log(e?.data?.message || e)
        }
        
    };
  
    console.log()
    const activatedContent = (
        <div>
          <h1><b>Account:</b> {account}</h1>
          <h1><b>Discord: </b>{session?.user?.name}</h1>
          {
            (tipQuantity && tipRecipient ) && <>
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