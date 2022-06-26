import React from 'react';
import { Switch } from '../Switch';

let props = {
  id: 'switch1',
  disabled: false,
  value: true,
  name: 'switch',
};

describe('Testing Switch component', () => {
  it('Renders checked Switch', () => {
    props = { ...props, value: true };
    render(<Switch {...props} />);
    expect(document.querySelector('input[type="checkbox"]')).toHaveProperty('checked');
  });

  it('Check Switch state Disable', () => {
    props = { ...props, disabled: true };
    render(<Switch {...props} />);
    expect(document.querySelector('input[type="checkbox"]')).toHaveProperty('disabled');
  });

  it('Check Switch with attribute name', () => {
    render(<Switch {...props} />);
    expect(document.querySelector('#switch1')).toHaveProperty('name', 'switch');
  });
});
