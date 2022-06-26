import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from '../Alert';

const Actions = () => {
  return (
    <Fragment>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>OK</button>
    </Fragment>
  );
};

const AlertTest = (props) => {
  const { onClose } = props;
  const [open, setOpen] = useState(true);
  return (
    <Alert
      {...props}
      open={open}
      onClose={(event) => {
        setOpen(false);
        onClose(event);
      }}
      buttons={<Actions />}
    >
      TEST
    </Alert>
  );
};

AlertTest.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  buttons: PropTypes.node,
};

describe('Testing Dialog component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('To close when clicked on the backdrop', () => {
    const mockedOnChange = jest.fn();
    render(<AlertTest disableBackdropClick={false} onClose={mockedOnChange} />);
    fireEvent.click(document.querySelector('div.MuiDialog-root > div.MuiBackdrop-root'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });

  it('To not close when clicked on the backdrop', () => {
    const mockedOnChange = jest.fn();
    render(<AlertTest disableBackdropClick={true} onClose={mockedOnChange} />);
    fireEvent.click(document.querySelector('div.MuiDialog-root > div.MuiBackdrop-root'));
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
  });

  it('Renders AlertTests with 2 buttons', () => {
    render(<AlertTest />);
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogActions-root').childElementCount).toEqual(2);
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogActions-root').children[0].textContent).toEqual(
      'Cancel',
    );
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogActions-root').children[1].textContent).toEqual(
      'OK',
    );
  });
});
