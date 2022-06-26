import React from 'react';
import PropTypes from 'prop-types';
import { KpiContext } from '../contexts';
import { useKpi } from '../graphql';

const KpiProvider = (props) => {
  const { children } = props;
  const hooks = useKpi();

  return <KpiContext.Provider value={hooks}>{children}</KpiContext.Provider>;
};

KpiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { KpiProvider };
