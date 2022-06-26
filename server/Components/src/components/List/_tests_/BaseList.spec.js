import React from 'react';
import { BaseList } from '../BaseList';

const items = [
  {
    id: 1,
    label: 'Profile',
    iconName: 'Add',
  },
  {
    id: 2,
    label: 'Account Settings',
    iconName: 'calendar',
  },
  {
    id: 3,
    label: 'Notifications',
    iconName: 'Plus',
  },
  {
    id: 4,
    label: 'Billing',
    iconName: 'Plus',
    disabled: true,
  },
  {
    id: 5,
    divider: true,
  },
  {
    id: 6,
    label: 'Logout',
    iconName: 'Plus',
  },
];

const BaseListTest = (props) => {
  return <BaseList {...props} items={items} />;
};

describe('Testing BaseList component', () => {
  beforeEach(() => {
    cleanup();
  });

  /**
   * As all the List, ListItem, ListItemIcon are used in the BaseList component and in fact a just wrappers around materil-ua
   * we just need to create a set of test for the BaseList component
   */
  it('Renders BaseList with children', () => {
    render(<BaseListTest />);
    expect(document.querySelector('ul.MuiList-root').childElementCount).toEqual(6);
    expect(document.querySelector('ul.MuiList-root').children[0].textContent).toEqual('Profile');
    expect(document.querySelector('ul.MuiList-root').children[4]).toHaveClass('MuiListItem-divider');
    expect(document.querySelector('ul.MuiList-root').children[5].textContent).toEqual('Logout');
  });

  it('Renders BaseList with dense setup', () => {
    render(<BaseListTest selectedId={2} dense={true} />);
    expect(document.querySelector('ul.MuiList-root')).toHaveClass('MuiList-dense');
  });

  it('Renders BaseList with disablePadding setup', () => {
    render(<BaseListTest selectedId={2} disablePadding={true} />);
    expect(document.querySelector('ul.MuiList-root')).not.toHaveClass('MuiList-padding');
  });

  it('Renders BaseList with disableGutters setup', () => {
    render(<BaseListTest selectedId={2} disableGutters={true} />);
    expect(document.querySelector('ul.MuiList-root').children[0]).not.toHaveClass('MuiListItem-gutters');
  });

  it('Renders BaseList with disabled', () => {
    render(<BaseListTest selectedId={2} />);
    expect(document.querySelector('ul.MuiList-root').children[3]).toHaveClass('Mui-disabled');
  });

  it('Renders BaseList with selected', () => {
    render(<BaseListTest selectedId={2} />);
    expect(document.querySelector('ul.MuiList-root').children[1]).toHaveClass('Mui-selected');
  });

  it('onClick is called on item click', () => {
    const mockedOnChange = jest.fn();
    render(<BaseListTest onClick={mockedOnChange} />);
    fireEvent.click(document.querySelector('ul.MuiList-root').children[1]);
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
