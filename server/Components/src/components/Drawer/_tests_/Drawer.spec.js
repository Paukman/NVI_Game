import React from 'react';
import { Drawer } from '../Drawer';

const TextToCheck = 'HERE WE HAVE CONTENT.';

const DrawerTest = (props) => {
  return <Drawer {...props}>{TextToCheck}</Drawer>;
};

describe('Drawer testing', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Check Drawer renders content when open as temporary', () => {
    render(<DrawerTest open variant='temporary' />);
    expect(document.querySelector('div.MuiDrawer-root.MuiDrawer-modal').textContent).toEqual(TextToCheck);
  });

  it('Check Drawer renders content when open  as persistent', () => {
    render(<DrawerTest open variant='persistent' />);
    expect(document.querySelector('div.MuiDrawer-root.MuiDrawer-docked').textContent).toEqual(TextToCheck);
  });

  it('Check Drawer renders content when open  as permanent', () => {
    render(<DrawerTest open variant='permanent' />);
    expect(document.querySelector('div.MuiDrawer-root.MuiDrawer-docked').textContent).toEqual(TextToCheck);
  });

  it('Check Drawer renders on the right', () => {
    render(<DrawerTest open variant='temporary' anchor='right' />);
    expect(
      document.querySelector('div.MuiDrawer-root.MuiDrawer-modal > div.MuiDrawer-paperAnchorRight').textContent,
    ).toEqual(TextToCheck);
  });

  it('Check Drawer renders on the top', () => {
    render(<DrawerTest open variant='temporary' anchor='top' />);
    expect(
      document.querySelector('div.MuiDrawer-root.MuiDrawer-modal > div.MuiDrawer-paperAnchorTop').textContent,
    ).toEqual(TextToCheck);
  });

  it('Check Drawer renders on the bottom', () => {
    render(<DrawerTest open variant='temporary' anchor='bottom' />);
    expect(
      document.querySelector('div.MuiDrawer-root.MuiDrawer-modal > div.MuiDrawer-paperAnchorBottom').textContent,
    ).toEqual(TextToCheck);
  });
});
