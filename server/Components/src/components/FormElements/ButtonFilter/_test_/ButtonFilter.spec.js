import React from 'react';
import { ButtonFilter } from '../ButtonFilter';

const props = {
  filtersSelected: 0,
  onReset: true,
  text: 'Filters',
  variant: 'default',
  icons: [
    'FilterNone',
    'Filter1',
    'Filter2',
    'Filter3',
    'Filter4',
    'Filter5',
    'Filter6',
    'Filter7',
    'Filter8',
    'Filter9',
    'Filter9Plus',
  ],
};

describe('Button Filter', () => {
  beforeEach(() => {
    cleanup();
  });
  it('Check label applied to button default state', () => {
    render(<ButtonFilter {...props} />);
    expect(Screen.getByText('Filters')).toBeInTheDocument();
  });
  it('Check state varient', () => {
    render(<ButtonFilter {...props} />);
    expect(props.variant).toMatch('default');
  });
});
