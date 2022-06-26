import React from 'react';
import { cleanup, render } from '@testing-library/react';
import TableRow from '../TableRow';

describe('TableRow', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render without errors', () => {
    render(<TableRow />);
    expect(document.querySelector('div.MuiTableRow-root')).toBeDefined();
  });
  it('should render children', () => {
    const { getByText } = render(<TableRow>TEST</TableRow>);
    expect(getByText('TEST')).toBeInTheDocument();
  });
});
