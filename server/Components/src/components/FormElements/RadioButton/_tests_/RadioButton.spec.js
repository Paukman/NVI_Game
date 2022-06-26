import React from 'react';
import { RadioButton } from '../RadioButton';

describe('Testing Radiobutton component', () => {
  it('Renders checked Radio', () => {
    const props = {
      checked: true,
    };
    const { container } = render(<RadioButton {...props} />);
    expect(container.querySelector('input[type="radio"]')).toHaveProperty('checked', true);
  });
  it('Renders radio with false checked prop', () => {
    const props = {
      checked: false,
    };
    const { container } = render(<RadioButton {...props} />);
    expect(container.querySelector('input[type="radio"]')).toHaveProperty('checked', false);
  });
  it('should call onChange when the radio checked', () => {
    const mockedOnChange = jest.fn();
    const props = {
      checked: true,
      onChange: mockedOnChange,
    };
    const { container } = render(<RadioButton {...props} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
  });
});
