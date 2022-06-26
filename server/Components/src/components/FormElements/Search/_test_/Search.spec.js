import React from 'react';
import { Search } from '../Search';

describe('Search Input', () => {
  beforeEach(() => {
    cleanup();
  });
  it('renders search input component', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<Search label='search' requests={mockedOnChange} />);
    expect(container).toBeInTheDocument();
  });
  it('should call onChange when the search input is changed', () => {
    const mockedOnChange = jest.fn();
    const { container } = render(<Search label='search' requests={mockedOnChange} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'Dynamic Input' } });
    jest.setTimeout(() => {
      expect(mockedOnChange).toHaveBeenCalledTimes(1);
    }, 600);
  });
  it('should render loading icon when the search input is changed', () => {
    const mockedOnChange = jest.fn();
    const { container, rerender } = render(<Search label='search' requests={mockedOnChange} />);
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
    fireEvent.change(container.getElementsByTagName('input')[0], { target: { value: 'Dynamic Input' } });
    jest.setTimeout(() => {
      expect(mockedOnChange).toHaveBeenCalledTimes(1);
    }, 600);
    rerender(<Search label='search' requests={mockedOnChange} loading={true} />);
    expect(Screen.queryByRole('progressbar')).toBeInTheDocument();
  });
});
