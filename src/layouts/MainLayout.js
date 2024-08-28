import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import Navbar from './Navbar';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

export const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

export const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

export const ContentStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
  }));

 function MainLayout() {
  return (
    <RootStyle>
      <Navbar/>
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}

export default memo(MainLayout);
