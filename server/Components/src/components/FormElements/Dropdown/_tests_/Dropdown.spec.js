import React from 'react';
import { Dropdown } from '../Dropdown';

const props = {
  label: 'libraries',
  id: 'dropdown-box-test-id',
  items: [
    {
      label: 'react',
      value: 'react',
    },
    {
      label: 'redux',
      value: 'redux',
    },
    {
      label: 'flux',
      value: 'flux',
    },
  ],
  value: '',
};

describe('Dropdown', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    render(<Dropdown {...props} onChange={mockedOnChange} />);
    expect(document.querySelector('#dropdown-box-test-id')).toBeDefined();
  });

  it('should call onChange when the first option is selected', async () => {
    const mockedOnChange = jest.fn();
    render(<Dropdown {...props} onChange={mockedOnChange} />);
    const selectComponent = document.querySelector('#dropdown-box-test-id');
    expect(selectComponent).toBeDefined();
    expect(selectComponent).not.toBeNull();
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => Screen.getByText('react'));
    fireEvent.click(Screen.getByText('react'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange when the first option is selected then second option then the third one', async () => {
    const mockedOnChange = jest.fn();
    render(<Dropdown {...props} onChange={mockedOnChange} />);
    const selectComponent = document.querySelector('#dropdown-box-test-id');
    expect(selectComponent).toBeDefined();
    expect(selectComponent).not.toBeNull();
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => Screen.getByText('react'));
    fireEvent.click(Screen.getByText('react'));
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => Screen.getByText('redux'));
    fireEvent.click(Screen.getByText('redux'));
    fireEvent.keyDown(selectComponent.firstChild, { key: 'ArrowDown' });
    await waitFor(() => Screen.getByText('flux'));
    fireEvent.click(Screen.getByText('flux'));

    expect(mockedOnChange).toHaveBeenCalledTimes(3);
  });

  it('should display helper text', async () => {
    const mockedOnChange = jest.fn();
    const { getByText } = render(<Dropdown {...props} helperText={'This field is required'} />);
    expect(getByText('This field is required')).toBeInTheDocument();
  });

  it('should display error', async () => {
    const mockedOnChange = jest.fn();
    const { getByText } = render(<Dropdown {...props} helperText={'This is an error'} error={true} />);
    expect(getByText('This is an error')).toBeInTheDocument();
  });

  it('should have dataEl identifier', async () => {
    const mockedOnChange = jest.fn();
    const { getByText } = render(<Dropdown {...props} dataEl={'el-identifier'} />);
    expect(document.querySelector("div[data-el='el-identifier']")).toBeDefined();
  });
});
