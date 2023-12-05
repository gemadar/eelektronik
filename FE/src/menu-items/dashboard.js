// assets
import { IconGardenCart } from '@tabler/icons';

// constant
const icons = { IconGardenCart };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconGardenCart,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
