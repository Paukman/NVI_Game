export const items = [
  {
    id: '1',
    label: 'Dashboard',
    iconName: 'Add',
    items: [
      {
        id: '1.1',
        label: 'Portfolio',
        iconName: 'Widgets',
      },
      {
        id: '1.2',
        label: 'Property',
        iconName: 'AccountBalance',
        selectable: false,
        items: [
          {
            id: '1.2.1',
            label: 'Property A',
            iconName: 'AccountBalanceWallet',
          },
          {
            id: '1.2.2',
            label: 'Property B',
            iconName: 'AccountCircle',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Account Settings',
    iconName: 'AddLocation',
  },
  {
    id: 3,
    label: 'Notifications',
    iconName: 'AddToPhotos',
  },
  {
    id: 4,
    label: 'Billing',
    iconName: 'AccountBalanceWallet',
    disabled: true,
  },
  {
    id: 5,
    divider: true,
  },
  {
    id: 6,
    label: 'Logout',
    iconName: '',
  },
];
