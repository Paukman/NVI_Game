import React from 'react';
import { Button } from '../Button';

let props = {
  id: 'text-button',
  text: 'Button',
  size: 'small',
  variant: 'default',
  disabled: false,
  buttonType: 'textOnly',
  iconName: 'AddOutlined',
};

describe('Text Button', () => {
  it('Check label applied to button', () => {
    render(<Button {...props} />);
    expect(Screen.getByText('Button')).toBeInTheDocument();
  });
  it('Check Button with attribute size small', () => {
    render(<Button {...props} />);
    expect(document.querySelector('#text-button')).toHaveStyle({ height: '35px' });
  });

  it('Check Button with attribute size large', () => {
    props = { ...props, size: 'large' };
    render(<Button {...props} />);
    expect(document.querySelector('#text-button')).toHaveStyle({ height: '55px' });
  });

  it('Check Button with color', () => {
    props = { ...props, variant: 'default' };
    render(<Button {...props} />);
    expect(document.querySelector('#text-button')).toHaveStyle({ background: '#ffffff' });
  });

  it('Check Button state Disable', () => {
    props = { ...props, disabled: true };
    render(<Button {...props} />);
    expect(Screen.getByRole('button')).toHaveAttribute('disabled');
  });
});
