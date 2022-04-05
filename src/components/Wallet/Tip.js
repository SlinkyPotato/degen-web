import { Button, Grid } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi";

const Tip = () => {
  const [recipient, setRecipient] = useState();
  const [quantity, setQuantity] = useState();
  const { account } = useWeb3React();

  const createTip = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xDB7Cb471dd0b49b29CAB4a1C14d070f27216a0Ab",
      abi,
      signer
    );

    await contract.transfer(recipient, ethers.utils.parseEther(quantity));
  };

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    setRecipient(params.recipient);
    setQuantity(params.quantity);
  });

  return (
    <Grid>
      <h1>ACCOUNT: {account}</h1>
      <h1>Recipient: {recipient}</h1>
      <h1>Quantity: {quantity}</h1>
      <Button variant="contained" onClick={createTip}>
        Tip
      </Button>
    </Grid>
  );
};

export default Tip;
