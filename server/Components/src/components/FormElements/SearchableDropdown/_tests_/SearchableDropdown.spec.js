import React from 'react';
import { SearchableDropdown } from '../SearchableDropdown';

const props = {
  items: [
    {
      id: 1,
      name: 'React',
    },
    {
      id: 2,
      name: 'Redux',
    },
    {
      id: 3,
      name: 'Nodejs',
    },
  ],
  itemName: 'name',
};

describe('Searchable Dropdown', () => {
  beforeEach(() => {
    cleanup();
  });
  it('should render without errors', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<SearchableDropdown {...props} onChange={mockedOnChange} />);
    expect(container).toBeInTheDocument();
  });
  it('should call onChange when the first option is selected', async () => {
    const mockedOnChange = jest.fn();
    render(<SearchableDropdown id='search-dropdown' {...props} onChange={mockedOnChange} />);
    const container = Screen.getByRole('combobox');
    const input = document.getElementById('search-dropdown');
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    container.focus();
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.click(document.getElementById('search-dropdown-option-0'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
    expect(input.value).toEqual('React');
  });
  it('search & select first matched element', async () => {
    const mockedOnChange = jest.fn();
    render(<SearchableDropdown id='search-dropdown' {...props} onChange={mockedOnChange} />);
    const container = Screen.getByRole('combobox');
    const input = document.getElementById('search-dropdown');
    container.focus();
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.click(document.getElementById('search-dropdown-option-0'));
    expect(input.value).toEqual('React');
  });
  it('renders no options text', async () => {
    const mockedOnChange = jest.fn();
    render(<SearchableDropdown id='search-dropdown' {...props} onChange={mockedOnChange} />);
    const container = Screen.getByRole('combobox');
    const input = document.getElementById('search-dropdown');
    container.focus();
    fireEvent.change(input, { target: { value: 'qwerty' } });
    expect(document.getElementsByClassName('MuiAutocomplete-noOptions')[0]).toBeInTheDocument();
  });
});
