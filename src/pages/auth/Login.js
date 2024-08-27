import { experimentalStyled as styled } from '@mui/material';
import { Box, Container, Stack, Typography } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Box>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
          </Stack>
          <LoginForm />
        </ContentStyle>
      </Container>
    </Box>
  );
}
