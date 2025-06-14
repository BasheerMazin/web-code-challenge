import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", py: 10 }}>
      <Box
        component="img"
        src="../../assets/404.png"
        alt="Not Found"
        sx={{ width: "100%", maxWidth: 400, mb: 4 }}
      />
      <Typography variant="h4" gutterBottom>
        Lost in the wilderness?
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        This page is nowhere to be found. Let us help you find your way back
        home.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ borderRadius: 2 }}
        onClick={() => navigate("/")}
      >
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFoundPage;
