import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cleanup, render } from '@testing-library/react';
import { Snackbar } from '../Snackbar';

const props = {
  vertical: 'bottom',
  horizontal: 'center',
  autoHideDuration: 4000,
};

const SnackbarTest = (props) => {
  const { onClose } = props;
  const [open, setOpen] = useState(true);
  return (
    <Snackbar
      {...props}
      open={open}
      onClose={(event) => {
        setOpen(false);
        onClose(event);
      }}
    />
  );
};

SnackbarTest.propTypes = {
  onClose: PropTypes.func,
};

describe('Snackbar', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders without errors', () => {
    render(<Snackbar {...props} />);
    expect(document.querySelector('div.MuiSnackbar-root')).toBeDefined();
  });
});
