import React, { useState, useEffect, useContext } from 'react';
import { DialogCard, DialogContent, Icon, DialogCloseButton } from 'mdo-react-components';
import { MissingIcon, MissingIconClose } from '../styled';

const MissingDatesModal = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MissingIcon onMouseOver={() => setOpen(true)}>
        <Icon name='MissingDates' size='small' />
      </MissingIcon>
      <DialogCard width={500} open={open} maxWidth='xs'>
        <DialogContent>
          <MissingIconClose onClick={() => setOpen(false)}>
            <Icon name='Close' />
          </MissingIconClose>
          {data}
        </DialogContent>
      </DialogCard>
    </>
  );
};

export default MissingDatesModal;
