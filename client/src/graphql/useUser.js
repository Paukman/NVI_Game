import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { userQueries } from './queries';

export const useUser = () => {
  const [users, setUsers] = useState({ data: [], ...buildErrors() });
  const [user, setUser] = useState({ data: null, ...buildErrors() });

  const [queryUserList, { loading: usersLoading, called: userListCalled }] = useLazyQuery(userQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.userList || {};

      const data = Array.isArray(result.data) ? result.data : [];
      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying users list:', errors.errors);
      }

      setUsers({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying users list:', response);

      setUsers({
        data: [],
        slugs: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying users list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryUserGet, { loading: userLoading, called: userGetCalled }] = useLazyQuery(userQueries.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.userGet || {};

      const data = Array.isArray(result.data) ? result.data[0] : {};

      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying user details:', errors.errors);
      }

      setUser({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying user details:', response);

      setUser({
        data: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying user details. Please try later.`],
            },
          ],
        }),
      });
    },
  });

  const [mutationUserCreate, { loading: userCreating, called: userCreateCalled }] = useMutation(userQueries.create, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.userCreate || {};

      setUser({
        data: result?.data?.[0] ?? {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when creating a user:', response);

      setUser({
        data: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating a user. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationUserUpdate, { loading: userUpdating, called: userUpdateCalled }] = useMutation(userQueries.udpate, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.userUpdate || {};

      setUser({
        data: result?.data?.[0] ?? {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when updating a user:', response);

      setUser({
        data: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating a user. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationUserRemove, { loading: userRemoving, called: userRemoveCalled }] = useMutation(userQueries.remove, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.userRemove || {};

      setUser({
        data: result?.data?.[0] ?? {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when removing a user:', response);

      setUser({
        data: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing a user. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const userList = useCallback(
    (variables) => {
      queryUserList({ variables });
    },
    [queryUserList],
  );

  const userGet = useCallback(
    (id) => {
      queryUserGet({ variables: { id } });
    },
    [queryUserGet],
  );

  const userCreate = useCallback(
    (params) => {
      mutationUserCreate({ variables: { params } });
    },
    [mutationUserCreate],
  );

  const userUpdate = useCallback(
    (variables) => {
      mutationUserUpdate({ variables });
    },
    [mutationUserUpdate],
  );

  const userRemove = useCallback(
    (id) => {
      mutationUserRemove({ variables: { id } });
    },
    [mutationUserRemove],
  );

  return {
    userList,
    userGet,
    userCreate,
    userUpdate,
    userRemove,
    users,
    user,
    usersLoading,
    userLoading,
    userCreating,
    userUpdating,
    userRemoving,
    userListCalled,
    userGetCalled,
    userCreateCalled,
    userUpdateCalled,
    userRemoveCalled,
  };
};
