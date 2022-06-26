import React from 'react';
import PropTypes from 'prop-types';
import { GlobalFilterContext } from '../contexts';
import { useGlobalFilter } from '../hooks';

const GlobalFilterProvider = (props) => {
  const { children } = props;
  const hooks = useGlobalFilter();

  return <GlobalFilterContext.Provider value={hooks}>{children}</GlobalFilterContext.Provider>;
};

GlobalFilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GlobalFilterProvider };
