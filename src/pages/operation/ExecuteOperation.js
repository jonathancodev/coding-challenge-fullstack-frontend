import { experimentalStyled as styled } from '@mui/material';
import { Box, Container, Stack, Typography } from '@mui/material';
import ExecuteOperationForm from '../../components/operation/ExecuteOperationForm';

const ContentStyle = styled('div')(({ theme }) => ({
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
    <Box>
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
    </Box>
  );
}
