import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { HmgGlCodeContext } from '../contexts';
import { useHmgGlCodes } from '../graphql';

const HmgGlCodeProvider = (props) => {
  const { children } = props;
  const hooks = useHmgGlCodes();

  return <HmgGlCodeContext.Provider value={hooks}>{children}</HmgGlCodeContext.Provider>;
};

HmgGlCodeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { HmgGlCodeProvider };
