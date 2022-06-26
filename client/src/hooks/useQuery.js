import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import apolloClient from '../graphql/apolloClient';
import logger from '../utils/logger';

export const useQuery = (queryConfiguration) => {
  const [config, _] = useState(queryConfiguration);
  const [queryState, updateState] = useState({ data: null, errors: [] });

  const [query, { loading: queryLoading }] = useLazyQuery(config.action, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: config.fetchPolicy ?? 'network-only',
    onCompleted: (response) => {
      try {
        const result = response[config.query] || {};
        const data = Array.isArray(result.data) ? result.data : [];

        updateState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error(`Something went wrong when ${config.message}: `, ex);

        updateState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when ${config.message}. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error(`Something went wrong when ${config.message}:`, response);

      updateState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when ${config.message}. Please try later`],
          },
        ],
      });
    },
  });

  const queryActioin = useCallback(
    (params) => {
      updateState({ data: null, errors: [] });
      query({ variables: { params } });
    },
    [query],
  );

  return [queryState, queryActioin, queryLoading];
};
