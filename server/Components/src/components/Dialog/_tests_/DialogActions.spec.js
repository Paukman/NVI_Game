import React from 'react';
import { DialogActions } from '../DialogActions';

describe('Testing DialogActions component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Renders DialogActions with 2 buttons', () => {
    render(
      <DialogActions>
        <button>1</button>
        <button>2</button>
      </DialogActions>,
    );
    expect(document.querySelector('div.MuiDialogActions-root').childElementCount).toEqual(2);
    expect(document.querySelector('div.MuiDialogActions-root').children[0].textContent).toEqual('1');
    expect(document.querySelector('div.MuiDialogActions-root').children[1].textContent).toEqual('2');
  });
});
