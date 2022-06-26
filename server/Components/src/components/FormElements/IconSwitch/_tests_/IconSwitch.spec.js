import React from 'react';
import { IconSwitch } from '../IconSwitch';

let props = {
  value: true,
  iconName: 'BarChart',
};

describe('IconSwitch', () => {
  beforeEach(() => {
    cleanup();
  });
  it('Renders checked Switch', () => {
    const iconswitchClick = jest.fn(() => {
      return false;
    });
    render(<IconSwitch {...props} onChange={iconswitchClick} />);
    fireEvent.click(document.querySelector('span.MuiSwitch-thumb'));
    expect(iconswitchClick).toHaveBeenCalledTimes(1);
  });
});
