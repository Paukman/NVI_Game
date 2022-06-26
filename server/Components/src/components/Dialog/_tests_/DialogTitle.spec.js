import React from 'react';
import { DialogTitle } from '../DialogTitle';

describe('Testing DialogTitle component', () => {
  beforeEach(() => {
    cleanup();
  });

  const mockedOnChange = jest.fn();

  it('Renders DialogTitle with children', () => {
    render(<DialogTitle>TEST</DialogTitle>);
    expect(document.querySelector('div.MuiDialogTitle-root > div').textContent).toEqual('TEST');
  });

  it('Renders Close Icon in DialogTitle', () => {
    render(<DialogTitle onClose={mockedOnChange}>TEST</DialogTitle>);
    expect(document.querySelector('div.MuiDialogTitle-root > button')).toBeDefined();
  });

  it('Calls onClose when Close Icon in DialogTitle is clicked', () => {
    render(<DialogTitle onClose={mockedOnChange}>TEST</DialogTitle>);
    fireEvent.click(document.querySelector('div.MuiDialogTitle-root > div > button'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
