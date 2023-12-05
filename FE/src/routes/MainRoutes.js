import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { tokenLoader } from 'components/controller';
import checkAuthLoader from 'components/controller';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// users
const ActiveUser = Loadable(lazy(() => import('views/users/ActiveUser')));

// suppliers
const Supplier = Loadable(lazy(() => import('views/suppliers/Supplier')));

// customers
const Customer = Loadable(lazy(() => import('views/customers/Customer')));

// goods
const Goods = Loadable(lazy(() => import('views/goods/Goods')));

// transactions
const Transactions = Loadable(lazy(() => import('views/transactions/Transactions')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  id: 'root',
  loader: tokenLoader,
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
      loader: checkAuthLoader
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />,
          loader: checkAuthLoader
        }
      ]
    },
    {
      path: 'users',
      children: [
        {
          path: 'active',
          element: <ActiveUser />,
          loader: checkAuthLoader
        }
      ]
    },
    {
      path: 'suppliers',
      element: <Supplier />,
      loader: checkAuthLoader
    },
    {
      path: 'customers',
      element: <Customer />,
      loader: checkAuthLoader
    },
    {
      path: 'goods',
      element: <Goods />,
      loader: checkAuthLoader
    },
    {
      path: 'transactions',
      element: <Transactions />,
      loader: checkAuthLoader
    }
  ]
};

export default MainRoutes;
