import React from 'react';
import { InputField } from '../InputField';

const props = {
  label: 'name',
};

describe('Input Field', () => {
  beforeEach(() => {
    cleanup();
  });
  const mockedOnChange = jest.fn();
  it('renders input field component', () => {
    const { container } = render(<InputField {...props} onChange={mockedOnChange} />);
    expect(container).toBeInTheDocument();
  });
  it('binds value to the input field component', () => {
    const { container } = render(<InputField {...props} defaultValue='Default Value' onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('input')[0].value).toBe('Default Value');
  });
  it('should call onChange when the input is changed', () => {
    const { container } = render(<InputField {...props} onChange={mockedOnChange} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'Dynamic Input' } });
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
  it('should show error when input field has error flag', () => {
    const { container } = render(<InputField {...props} error onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('label')[0]).toHaveClass('Mui-error');
  });
  it('render input field with outlined variant', () => {
    const { container } = render(<InputField {...props} variant='outlined' onChange={mockedOnChange} />);
    expect(container.getElementsByTagName('input')[0]).toHaveClass('MuiOutlinedInput-input');
  });
});
