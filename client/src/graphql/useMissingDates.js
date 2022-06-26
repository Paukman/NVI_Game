import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { missingDatesQueries } from './queries/missingDatesQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useMissingDates = () => {
  const [missingDataGetState, setMissingDataGetState] = useState({ data: null, errors: [] });

  const [queryMissingDataGet, { loading: missingDataGetLoading }] = useLazyQuery(missingDatesQueries.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.missingDataGet || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setMissingDataGetState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching Missing Data: ', ex);

        setMissingDataGetState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching  Missing Data. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching  Missing Data:', response);

      setMissingDataGetState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching Missing Data. Please try later`],
          },
        ],
      });
    },
  });

  const missingDataGet = useCallback(
    (params) => {
      setMissingDataGetState({ data: null, errors: [] });
      queryMissingDataGet({ variables: { params } });
    },
    [queryMissingDataGet],
  );

  return {
    missingDataGet,
    missingDataGetState,
    missingDataGetLoading,
  };
};
