import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogCard } from '../DialogCard';

const DialogTest = (props) => {
  const { onClose } = props;
  const [open, setOpen] = useState(true);
  return (
    <DialogCard
      {...props}
      open={open}
      onClose={(event) => {
        setOpen(false);
        onClose(event);
      }}
    >
      TEST
    </DialogCard>
  );
};

DialogTest.propTypes = {
  onClose: PropTypes.func,
};

describe('Testing DialogCard component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Renders DialogCard with children when open', () => {
    render(<DialogCard open={true}>TEST</DialogCard>);
    expect(document.querySelector('div.MuiDialog-root div.MuiPaper-root').textContent).toEqual('TEST');
  });

  it('Renders nothing with children when closed', () => {
    render(<DialogCard open={false}>TEST</DialogCard>);
    expect(document.querySelector('div.MuiDialog-root div.MuiPaper-root')).toEqual(null);
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
});
