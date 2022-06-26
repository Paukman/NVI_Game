import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as MdoCloudEmptyScreen } from '../../../assets/Images/mdo-cloud-empty-screen.svg';

import { Container, Message } from './styled';

const NoDataToShow = memo((props) => {
  const { message, dataEl } = props;

  return (
    <Container data-el={dataEl}>
      <MdoCloudEmptyScreen />
      {message && <Message>{message}</Message>}
    </Container>
  );
});

NoDataToShow.displayName = 'NoDataToShow';

NoDataToShow.propTypes = {
  message: PropTypes.string,
  dataEl: PropTypes.string,
};

NoDataToShow.defaultProps = {
  message: '',
  dataEl: 'noDataToShow',
};

export { NoDataToShow };
