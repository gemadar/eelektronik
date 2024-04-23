import { lazy } from 'react';
import { redirect } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

import { getAuthToken } from 'components/controller';

function checkAuthLoaderTst() {
  const token = getAuthToken();
  if (token) {
    return redirect('/');
  }
}

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/auth',
      element: <AuthLogin3 />,
      loader: checkAuthLoaderTst
    }
  ]
};

export default AuthenticationRoutes;
