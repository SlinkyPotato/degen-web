import { Button } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Tipping = () => {
    const { account } = useWeb3React();
    const { data: session } = useSession();
    const [tipRecipient, setTipRecipient] = useState();
    const [tipQuantity, setTipQuantity] = useState();

    useEffect(() => {
        console.log(`HREF`)
        console.log(window.location.href);
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams, prop) => searchParams.get(prop.toString()),
        });
        console.log(params)
        setTipRecipient(params["recipient"]);
        setTipQuantity(params["quantity"])
    }, []);

    const handleApproveTip = () => {
        // TODO: send tx with useWeb3React()
        alert("HANDLING TIP")
    };
  
    const activatedContent = (
        <div>
          <h1><b>Account:</b> {account}</h1>
          <h1><b>Discord: </b>{session?.user?.name}</h1>
          <h1><b>Tip Recipient:</b> {tipRecipient}</h1>
          <h1><b>Quantity ($BANK): </b>{tipQuantity}</h1>
          <Button onClick={handleApproveTip}>Approve Tip</Button>
        </div>
      );

      return ( 
        activatedContent
      );
};

export default Tipping;