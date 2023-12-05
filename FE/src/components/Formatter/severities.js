const userSeverity = (role) => {
  switch (role) {
    case 'root':
      return 'danger';

    case 'employee':
      return 'success';

    case 'admin':
      return 'warning';
  }
};

const goodsSeverity = (Goods) => {
  switch (true) {
    case Goods.quantity <= 3:
      return 'danger';

    case Goods.quantity < 10:
      return 'warning';

    case Goods.quantity >= 10:
      return 'success';

    default:
      return null;
  }
};

const trxSeverity = (status) => {
  switch (status) {
    case 'paid':
      return 'success';

    case 'unpaid':
      return 'danger';
  }
};

export { userSeverity, goodsSeverity, trxSeverity };
