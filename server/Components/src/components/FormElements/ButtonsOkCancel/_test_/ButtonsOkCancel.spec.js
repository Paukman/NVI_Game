import React from 'react';
import { ButtonsOkCancel } from '../ButtonsOkCancel';

describe('ButtonsOkCancel component', () => {
  it('Renders ButtonsOkCancel with 2 buttons', () => {
    render(<ButtonsOkCancel />);
    expect(document.getElementsByTagName('button').length).toEqual(2);
  });

  it('Renders ButtonsOkCancel with OK button', async () => {
    const { getByText } = render(<ButtonsOkCancel />);

    expect(getByText('OK')).toBeInTheDocument();
  });
});
