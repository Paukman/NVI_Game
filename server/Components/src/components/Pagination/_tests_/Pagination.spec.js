import React from 'react';
import Pagination from '../Pagination';

const props = {
  count: 10,
  onChange: () => {},
  page: 1,
};

describe('Pagination', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('Check the previous icon is disabled when the page updates', () => {
    render(<Pagination {...props} />);
    expect(Screen.getByLabelText('Go to previous page')).toHaveClass('Mui-disabled');
  });

  it('Check the next icon is enabled when the page updates', () => {
    render(<Pagination {...props} page={props.count} />);
    expect(Screen.getByLabelText('Go to next page')).toHaveClass('Mui-disabled');
  });

  it('Check the current selected page number is 1', () => {
    render(<Pagination {...props} />);
    expect(Screen.getByLabelText('page 1')).toHaveClass('Mui-selected');
  });

  it('Check the current selected page number is 2', () => {
    render(<Pagination {...props} page={2} />);
    expect(Screen.getByLabelText('page 2')).toHaveClass('Mui-selected');
  });
});
