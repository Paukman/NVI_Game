import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { roleQueries } from './queries';

export const useRole = () => {
  const [roles, setRoles] = useState({ data: [], ...buildErrors() });
  const [role, setRole] = useState({ data: null, ...buildErrors() });

  const [queryRoleList, { loading: rolesLoading, called: roleListCalled }] = useLazyQuery(roleQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.roleList || {};

      const data = Array.isArray(result.data) ? result.data : [];
      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying roles list:', errors.errors);
      }

      setRoles({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying roles list:', response);

      setRoles({
        data: [],
        slugs: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying roles list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryRoleGet, { loading: roleLoading, called: roleGetCalled }] = useLazyQuery(roleQueries.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.roleGet || {};

      const data = Array.isArray(result.data) ? result.data[0] : {};

      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying role details:', errors.errors);
      }

      setRole({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying role details:', response);

      setRole({
        data: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying role details. Please try later.`],
            },
          ],
        }),
      });
    },
  });

  const roleList = useCallback(
    (variables) => {
      queryRoleList({ variables });
    },
    [queryRoleList],
  );

  const roleGet = useCallback(
    (id) => {
      queryRoleGet({ variables: { id } });
    },
    [queryRoleGet],
  );

  return {
    roleList,
    roleGet,
    roles,
    role,
    rolesLoading,
    roleLoading,
    roleListCalled,
    roleGetCalled,
  };
};
