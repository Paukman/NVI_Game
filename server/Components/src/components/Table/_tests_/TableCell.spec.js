import React from 'react';
import { cleanup, render } from '@testing-library/react';
import TableCell from '../TableCell';

describe('TableCell', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    render(<TableCell />);
    expect(document.querySelector('div.MuiTableCell-root')).toBeDefined();
  });
  it('should render children', () => {
    const { getByText } = render(<TableCell>TEST</TableCell>);
    expect(getByText('TEST')).toBeInTheDocument();
  });
});
