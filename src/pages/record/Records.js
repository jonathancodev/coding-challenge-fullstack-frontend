import { Container, Stack, Typography } from '@mui/material';
import RecordList from '../../components/record/RecordList';
import Navbar from '../../layouts/Navbar';
import { RootStyle, MainStyle, ContentStyle } from '../../layouts/MainLayout';

export default function Records() {
  return (
    <RootStyle>
      <MainStyle>
        <Navbar refreshBalance={false}/>
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
      </MainStyle>
    </RootStyle>
  );
}
