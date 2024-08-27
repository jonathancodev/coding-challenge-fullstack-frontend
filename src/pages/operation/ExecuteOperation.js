import { experimentalStyled as styled } from '@mui/material';
import { Container, Stack, Typography } from '@mui/material';
import ExecuteOperationForm from '../../components/operation/ExecuteOperationForm';

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

export default function ExecuteOperation() {
  return (
    <RootStyle title="Execute Operation">

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
            Execute Operation
            </Typography>
          </Stack>
          <ExecuteOperationForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
