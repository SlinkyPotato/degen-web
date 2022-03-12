import { Button, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import Tip from "../components/Wallet/Tip";
import { injected } from "../utils/Connectors";

const Wallet = () => {
  const { activate, account } = useWeb3React();

  return (
    <Box pt={12}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5}
      >
        {account ? (
          <Tip />
        ) : (
          <Button variant="contained" onClick={() => activate(injected)}>
            Connect Wallet
          </Button>
        )}
      </Grid>
    </Box>
  );
};

export default Wallet;
