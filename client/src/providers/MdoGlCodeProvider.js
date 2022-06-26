import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdoGlCodeContext } from '../contexts';
import { useMdoGlCodes } from '../graphql';

const MdoGlCodeProvider = (props) => {
  const { children } = props;
  const hooks = useMdoGlCodes();

  return <MdoGlCodeContext.Provider value={hooks}>{children}</MdoGlCodeContext.Provider>;
};

MdoGlCodeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MdoGlCodeProvider };
