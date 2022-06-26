import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { GET_DEFAULT_STR_REPORT } from './queries/strQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useStrReport = () => {
  const [strDefaultReport, setStrDefaultReport] = useState({ data: null, errors: [] });

  const [queryStrDefaultReportGet, { loading: strDefaultReportGetLoading }] = useLazyQuery(GET_DEFAULT_STR_REPORT, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.strReportDefaultGet || {};
        const data = Array.isArray(result.data) ? result.data[0] : [];

        setStrDefaultReport({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when querying default STR Report list:', ex);

        setStrDefaultReport({
          data: [],
          errors: [
            { name: '', message: [`Something went wrong when querying default STR Report list. Please try later`] },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when querying default STR Report list:', response);

      setStrDefaultReport({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying default STR Report list. Please try later`],
          },
        ],
      });
    },
  });

  const strDefaultReportGet = useCallback(
    (params) => {
      setStrDefaultReport({ data: null, errors: [] });
      queryStrDefaultReportGet({ variables: { params } });
    },
    [queryStrDefaultReportGet],
  );

  return {
    strDefaultReport,
    strDefaultReportGet,
    strDefaultReportGetLoading,
  };
};
