import { Container, Typography, Button } from "@mui/material";

const Home = () => {
  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        Collaborative Coding Platform
      </Typography>

      <Button variant="contained">
        Create Room
      </Button>
    </Container>
  );
};

export default Home;