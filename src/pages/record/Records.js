import { experimentalStyled as styled } from '@mui/material';
import { Container, Stack, Typography } from '@mui/material';
import RecordList from '../../components/record/RecordList';

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

export default function Records() {
  return (
    <RootStyle title="Records">

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Records
            </Typography>
          </Stack>
          <RecordList />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
