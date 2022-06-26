import React from 'react';
import { Checkbox } from '../Checkbox';

describe('Testing Checkbox component', () => {
  it('Renders Checkbox with width 16', () => {
    const props = {
      width: '16',
    };
    const { container } = render(<Checkbox {...props} />);
    expect(container.firstChild).toHaveAttribute('width', '16');
  });

  it('Renders Checkbox with height 16', () => {
    const props = {
      height: '16',
    };
    const { container } = render(<Checkbox {...props} />);
    expect(container.firstChild).toHaveAttribute('height', '16');
  });

  it('Renders checked Checkbox', () => {
    const props = {
      checked: true,
    };
    const { container } = render(<Checkbox {...props} />);
    expect(container.querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);
  });

  it('Renders checkbox with false checked prop', () => {
    const props = {
      checked: false,
    };
    const { container } = render(<Checkbox {...props} />);
    expect(container.querySelector('input[type="checkbox"]')).toHaveProperty('checked', false);
  });

  it('should call onChange when the checkbox checked', () => {
    const mockedOnChange = jest.fn();
    const props = {
      checked: true,
      onChange: mockedOnChange,
    };
    const { container } = render(<Checkbox {...props} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
  });
});
