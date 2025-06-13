import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height={100}>
    <CircularProgress size={50} color="primary" />
  </Box>
);

export default LoadingSpinner;
