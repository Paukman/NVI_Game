import React, { memo } from 'react';
import Progress from '../Progresses/Progress';
import Modal from '../Modal/Modal';

import { Centered } from './styled';

const PageLoading = memo((props) => {
  const { open, onClose, ...rest } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Centered>
        <Progress {...rest} />
      </Centered>
    </Modal>
  );
});

PageLoading.displayName = 'PageLoading';

PageLoading.propTypes = {
  ...Modal.prototype,
  ...Progress.prototype,
};

PageLoading.defaultProps = {
  open: true,
  type: 'circularProgress',
  size: 64,
  colorBar: 'white',
};

export default PageLoading;
