import React from 'react';
import { SideBar } from '../SideBar';
import { items } from '../mock';

const SideBarTest = (props) => {
  return <SideBar {...props} items={items} />;
};

describe('Testing SideBar component', () => {
  beforeEach(() => {
    cleanup();
  });

  /**
   * As the Drawer and BaseList are used in the SideBar component which are already tested
   * we just need to create a set of test for the SideBar component to make sure it renders children
   */
  it('Closed SideBar does not render when closed', () => {
    render(<SideBarTest />);
    expect(document.querySelector('ul.MuiDrawer-root')).toEqual(null);
  });

  it('Renders SideBar with children when open', () => {
    render(<SideBarTest open />);
    // As we render Collapse for each item with children we are expecting 7 children in this test:
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').childElementCount).toEqual(7);
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[0].textContent).toEqual('Dashboard');
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[5]).toHaveClass('MuiListItem-divider');
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[6].textContent).toEqual('Logout');
  });

  it('Renders SideBar with dense setup', () => {
    render(<SideBarTest open dense={true} />);
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root.MuiList-dense')).toHaveClass('MuiList-dense');
  });

  it('Renders SideBar with disablePadding setup', () => {
    render(<SideBarTest open disablePadding={true} />);
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root')).not.toHaveClass('MuiList-padding');
  });

  it('Renders SideBar with disableGutters setup', () => {
    render(<SideBarTest open disableGutters={true} />);
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[0]).not.toHaveClass(
      'MuiListItem-gutters',
    );
  });

  it('Renders SideBar with disabled', () => {
    render(<SideBarTest open />);
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[4]).toHaveClass('Mui-disabled');
  });

  it('Renders SideBar with selected', () => {
    render(<SideBarTest open selectedId={2} />);
    expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[2]).toHaveClass('Mui-selected');
  });

  it('onClick is called on item click', () => {
    const mockedOnChange = jest.fn();
    render(<SideBarTest open onClick={mockedOnChange} />);
    fireEvent.click(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[2]);
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });

  it('Expanded SideBar item', () => {
    render(<SideBarTest open selectedId={1} />);
    fireEvent.click(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[0]);
    setTimeout(() => {
      expect(document.querySelector('div.MuiDrawer-root ul.MuiList-root').children[1]).toHaveClass(
        'MuiCollapse-entered',
      );
    }, 500);
  });
});
