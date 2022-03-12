import { Button } from "@mui/material";

const Wallet = () => {
  const handleButtonClick = () => {
    alert("Connect Discord");
  };
  return <Button onClick={handleButtonClick}>Connect Discord</Button>;
};

export default Wallet;
