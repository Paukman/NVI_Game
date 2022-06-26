import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cleanup, render } from '@testing-library/react';
import { Toast } from '../Toast';

const props = {
  message: 'Success Toast',
  severity: 'success',
  variant: 'filled',
  elevation: 6,
  vertical: 'bottom',
  horizontal: 'center',
  autoHideDuration: 4000,
};

const ToastTest = (props) => {
  const { onClose } = props;
  const [open, setOpen] = useState(true);
  return (
    <Toast
      {...props}
      open={open}
      onClose={(event) => {
        setOpen(false);
        onClose(event);
      }}
    />
  );
};

ToastTest.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

describe('Toast', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders without errors', () => {
    const { getByText } = render(<ToastTest {...props} />);
    expect(getByText('Success Toast')).toBeInTheDocument();
  });

  it('should close when clicked close button', () => {
    const mockedOnChange = jest.fn();
    render(<ToastTest {...props} onClose={mockedOnChange} />);
    fireEvent.click(document.querySelector('div.MuiAlert-action > button.MuiButtonBase-root'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });
});
