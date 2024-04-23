// assets
import { IconKey, IconUsers, IconLayoutDashboard, IconFriends, IconTir, IconBoxSeam, IconCoin, IconUserPlus } from '@tabler/icons';
import { getToken } from 'components/controller';

const role = localStorage.getItem('a') ? getToken().role : '';

// constant
const icons = {
  IconKey,
  IconUsers,
  IconLayoutDashboard,
  IconFriends,
  IconTir,
  IconBoxSeam,
  IconCoin,
  IconUserPlus
};

const directory = {
  id: 'directory',
  title: 'Directory',
  type: 'group',
  icon: icons.IconKey,
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    },
    role === 'admin' && {
      id: 'user',
      title: 'Active Users',
      url: '/users/active',
      type: 'item',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'customers',
      title: 'Customers',
      url: '/customers',
      type: 'item',
      icon: icons.IconFriends,
      breadcrumbs: false
    },
    role === 'admin' && {
      id: 'suppliers',
      title: 'Suppliers',
      url: '/suppliers',
      type: 'item',
      icon: icons.IconTir,
      breadcrumbs: false
    },
    {
      id: 'goods',
      title: 'Goods',
      url: '/goods',
      type: 'item',
      icon: icons.IconBoxSeam,
      breadcrumbs: false
    },
    {
      id: 'transactions',
      title: 'Transactions',
      url: '/transactions',
      type: 'item',
      icon: icons.IconCoin,
      breadcrumbs: false
    }
  ]
};

export default directory;
