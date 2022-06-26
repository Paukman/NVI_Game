import React from 'react';
import { DialogContent } from '../DialogContent';

describe('Testing DialogContent component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Renders DialogContent with children', () => {
    render(<DialogContent>TEST</DialogContent>);
    expect(document.querySelector('div.MuiDialogContent-root').textContent).toEqual('TEST');
  });
});
