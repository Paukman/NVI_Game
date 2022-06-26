import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { permissionsQueries } from './queries/permissionsQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const usePermissions = () => {
  const [permissionsListState, setPermissionsListState] = useState({ data: null, errors: [] });

  const [queryPermissionsList, { loading: permissionsListLoading }] = useLazyQuery(permissionsQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.permissionsList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setPermissionsListState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching Permission List: ', ex);

        setPermissionsListState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching Permission List. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching Permission List:', response);

      setPermissionsListState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching Permission List. Please try later`],
          },
        ],
      });
    },
  });

  const permissionsList = useCallback(
    (params) => {
      setPermissionsListState({ data: null, errors: [] });
      queryPermissionsList({ variables: { params } });
    },
    [queryPermissionsList],
  );

  return {
    permissionsList,
    permissionsListState,
    permissionsListLoading,
  };
};
