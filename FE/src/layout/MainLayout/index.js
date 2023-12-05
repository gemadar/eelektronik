import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { getTokenDuration, insertUpdateCont, getToken } from 'components/controller';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';
import { useEffect, useState } from 'react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const token = useLoaderData();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const [refresh, setRefresh] = useState(true);
  const { REACT_APP_IP } = process.env;
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const duration = getTokenDuration();

    const refreshToken = async () => {
      const rt = localStorage.getItem('b') ? localStorage.getItem('b').toString() : '';
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rt: rt })
      };
      const rawRes = await fetch(`${REACT_APP_IP}/ref`, requestOptions);

      const res = await rawRes.json();

      if (res == 'Unauthorized') {
        setRefresh(false);
      } else {
        localStorage.setItem('a', res.token);
        localStorage.setItem('b', res.rtoken);
      }
    };

    if (duration < 0) {
      refreshToken();
      if (refresh) {
        return;
      } else {
        insertUpdateCont(getToken().username, `${REACT_APP_IP}/logout`);
        localStorage.removeItem('a');
        localStorage.removeItem('b');
        navigate('/auth');
        window.location.reload();
      }
    }

    setTimeout(() => {
      refreshToken();
      if (refresh) {
        return;
      } else {
        insertUpdateCont(getToken().username, `${REACT_APP_IP}/logout`);
        localStorage.removeItem('a');
        localStorage.removeItem('b');
        navigate('/auth');
        window.location.reload();
      }
    }, duration);
  }, [token, navigate, REACT_APP_IP, refresh]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>
    </Box>
  );
};

export default MainLayout;
