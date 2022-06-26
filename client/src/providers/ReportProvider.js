import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReportContext } from '../contexts';
import { useReport } from '../graphql';

/**
 * Provider that reads reports settings like filters and etc
 * @param {object} props Provider component properties
 */
const ReportProvider = (props) => {
  const { children } = props;
  const hooks = useReport();
  const { reportList } = hooks;

  useEffect(() => {
    reportList({ params: {}, pagination: {} });
  }, [reportList]);

  return <ReportContext.Provider value={hooks}>{children}</ReportContext.Provider>;
};

ReportProvider.propTypes = {
  children: PropTypes.node,
};

export { ReportProvider };
