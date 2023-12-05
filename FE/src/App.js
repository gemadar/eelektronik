import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import MainRoutes from 'routes/MainRoutes';
import AuthenticationRoutes from 'routes/AuthenticationRoutes';
import { RouterProvider, createBrowserRouter } from 'react-router-dom/dist';

// routing
const route = createBrowserRouter([MainRoutes, AuthenticationRoutes]);

// defaultTheme
import themes from 'themes';

// project imports
// import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <RouterProvider router={route} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
