import { experimentalStyled as styled } from '@mui/material';
import { Container, Stack, Typography } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
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
    <RootStyle title="Login">

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
    </RootStyle>
  );
}
