import { AppBar, Box, Toolbar } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ py: 2, px: 4 }}>
      <Toolbar>
        <Box
          component="img"
          src="/assets/almosafer-logo.svg"
          alt="Almosafer-logo"
          width={{ xs: 130, sm: 200 }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
