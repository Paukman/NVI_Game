import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ToastAlert } from '../ToastAlert';

const props = {
  message: 'Successful',
  severity: 'success',
  variant: 'filled',
  elevation: 6,
};

describe('ToastAlert', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders without errors', () => {
    render(<ToastAlert {...props} />);
    expect(document.querySelector('div.MuiAlert-message')).toBeDefined();
  });
});
