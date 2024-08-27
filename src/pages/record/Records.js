import { Box, experimentalStyled as styled } from '@mui/material';
import { Container, Stack, Typography } from '@mui/material';
import RecordList from '../../components/record/RecordList';

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

export default function Records() {
  return (
    <Box>
      <Container maxWidth="lg">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Records
            </Typography>
          </Stack>
          <RecordList />
        </ContentStyle>
      </Container>
    </Box>
  );
}
