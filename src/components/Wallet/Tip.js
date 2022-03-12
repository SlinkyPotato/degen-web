import { Grid } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

const Tip = () => {
  const { account } = useWeb3React();

  return (
    <Grid>
      <h1>ACCOUNT: {account}</h1>
    </Grid>
  );
};

export default Tip;
