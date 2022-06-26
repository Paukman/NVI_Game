import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { customTableQueries } from './queries/customTableQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useCustomTable = () => {
  const [customTableListState, setCustomTableListState] = useState({ data: null, errors: [] });
  const [customTableUpdateState, setCustomTableUpdateState] = useState({ data: null, errors: [] });

  const [queryCustomTableList, { loading: customTableListLoading }] = useLazyQuery(customTableQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.customTableList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setCustomTableListState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching Custom Table List: ', ex);

        setCustomTableListState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching Custom Table List. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching Custom Table List:', response);

      setCustomTableListState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching Custom Table List. Please try later`],
          },
        ],
      });
    },
  });
  const [mutationCustomTableUpdate, { loading: customTableUpdateLoading }] = useMutation(customTableQueries.update, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.customTableUpdate || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setCustomTableUpdateState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching Custom Table List:', ex);

        setCustomTableUpdateState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching Custom Table List. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching Custom Table List:', response);

      setCustomTableUpdateState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching Custom Table List. Please try later`],
          },
        ],
      });
    },
  });

  const customTableList = useCallback(
    (params) => {
      setCustomTableListState({ data: null, errors: [] });
      queryCustomTableList({ variables: { params } });
    },
    [queryCustomTableList],
  );
  const customTableUpdate = useCallback(
    (id, params) => {
      setCustomTableUpdateState({ data: null, errors: [] });
      mutationCustomTableUpdate({ variables: { id, params } });
    },
    [mutationCustomTableUpdate],
  );

  return {
    customTableList,
    customTableListState,
    customTableListLoading,

    customTableUpdate,
    customTableUpdateState,
    customTableUpdateLoading,
  };
};
