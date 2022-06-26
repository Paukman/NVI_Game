import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '../Dialog';

const Actions = () => {
  return (
    <Fragment>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button onClick={() => setOpen(false)}>OK</button>
    </Fragment>
  );
};

const DialogTest = (props) => {
  const { onClose } = props;
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      {...props}
      open={open}
      onClose={(event) => {
        setOpen(false);
        onClose(event);
      }}
      actions={<Actions />}
    >
      TEST
    </Dialog>
  );
};

DialogTest.propTypes = {
  onClose: PropTypes.func,
};

describe('Testing Dialog component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Renders Dialog with children when closed', () => {
    render(<Dialog open={true}>TEST</Dialog>);
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogContent-root').textContent).toEqual('TEST');
  });

  it('Renders nothing with children when closed', () => {
    render(<Dialog open={false}>TEST</Dialog>);
    expect(document.querySelector('div.MuiDialog-root div.MuiPaper-root')).toEqual(null);
  });

  it('Renders Dialog Title', () => {
    render(
      <DialogTest open={true} title='TITLE'>
        TEST
      </DialogTest>,
    );
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogTitle-root > div').textContent).toEqual('TITLE');
  });

  it('To close when clicked on the backdrop', () => {
    const mockedOnChange = jest.fn();
    render(<DialogTest disableBackdropClick={false} onClose={mockedOnChange} />);
    fireEvent.click(document.querySelector('div.MuiDialog-root > div.MuiBackdrop-root'));
    expect(mockedOnChange).toHaveBeenCalledTimes(1);
  });

  it('To not close when clicked on the backdrop', () => {
    const mockedOnChange = jest.fn();
    render(<DialogTest disableBackdropClick={true} onClose={mockedOnChange} />);
    fireEvent.click(document.querySelector('div.MuiDialog-root > div.MuiBackdrop-root'));
    expect(mockedOnChange).toHaveBeenCalledTimes(0);
  });

  it('Renders DialogActions with 2 buttons', () => {
    render(<DialogTest />);
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogActions-root').childElementCount).toEqual(2);
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogActions-root').children[0].textContent).toEqual(
      'Cancel',
    );
    expect(document.querySelector('div.MuiDialog-root div.MuiDialogActions-root').children[1].textContent).toEqual(
      'OK',
    );
  });
});
