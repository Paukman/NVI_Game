import React from 'react';
import FormState from '../FormState';
import Grid from '../../Grid/Grid';

describe('Form State Component', () => {
  beforeEach(() => {
    cleanup();
  });
  it('Form State should have class MuiGrid-container', () => {
    const { container } = render(<Grid data={{}} />);
    expect(container.firstChild).toHaveClass('MuiGrid-container');
  });
});
