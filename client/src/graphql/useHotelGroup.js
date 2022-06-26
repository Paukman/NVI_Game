import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { hotelGroupQueries } from './queries';

export const useHotelGroup = () => {
  const [hotelGroups, setHotelGroups] = useState({ data: [], ...buildErrors() });
  const [hotelGroup, setHotelGroup] = useState({ data: null, ...buildErrors() });

  const [queryUserList, { loading: hotelGroupsLoading, called: hotelGroupListCalled }] = useLazyQuery(
    hotelGroupQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.hotelGroupList || {};

        const data = Array.isArray(result.data) ? result.data : [];
        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying hotelGroups list:', errors.errors);
        }

        setHotelGroups({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying hotelGroups list:', response);

        setHotelGroups({
          data: [],
          slugs: {},
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying hotelGroups list. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [queryUserGet, { loading: hotelGroupLoading, called: hotelGroupGetCalled }] = useLazyQuery(
    hotelGroupQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.hotelGroupGet || {};

        const data = Array.isArray(result.data) ? result.data[0] : null;

        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying hotelGroup details:', errors.errors);
        }

        setHotelGroup({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying hotelGroup details:', response);

        setHotelGroup({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying hotelGroup details. Please try later.`],
              },
            ],
          }),
        });
      },
    },
  );

  const [mutationUserCreate, { loading: hotelGroupCreating, called: hotelGroupCreateCalled }] = useMutation(
    hotelGroupQueries.create,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        const result = response?.hotelGroupCreate || {};

        setHotelGroup({
          data: result?.data?.[0] || {},
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when creating a hotelGroup:', response);

        setHotelGroup({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when creating a hotelGroup. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [mutationUserUpdate, { loading: hotelGroupUpdating, called: hotelGroupUpdateCalled }] = useMutation(
    hotelGroupQueries.udpate,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        const result = response?.hotelGroupUdpate || {};

        setHotelGroup({
          data: result?.data?.[0] || {},
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when updating a hotelGroup:', response);

        setHotelGroup({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when updating a hotelGroup. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [mutationUserRemove, { loading: hotelGroupRemoving, called: hotelGroupRemoveCalled }] = useMutation(
    hotelGroupQueries.remove,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        const result = response?.hotelGroupRemove || {};

        setHotelGroup({
          data: result?.data?.[0] || {},
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when removing a hotelGroup:', response);

        setHotelGroup({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when removing a hotelGroup. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const hotelGroupList = useCallback(
    (variables) => {
      queryUserList({ variables });
    },
    [queryUserList],
  );

  const hotelGroupGet = useCallback(
    (id) => {
      queryUserGet({ variables: { id } });
    },
    [queryUserGet],
  );

  const hotelGroupCreate = useCallback(
    (params) => {
      mutationUserCreate({ variables: { params } });
    },
    [mutationUserCreate],
  );

  const hotelGroupUpdate = useCallback(
    (variables) => {
      mutationUserUpdate({ variables });
    },
    [mutationUserUpdate],
  );

  const hotelGroupRemove = useCallback(
    (id) => {
      mutationUserRemove({ variables: { id } });
    },
    [mutationUserRemove],
  );

  return {
    hotelGroupList,
    hotelGroupGet,
    hotelGroupCreate,
    hotelGroupUpdate,
    hotelGroupRemove,
    hotelGroups,
    hotelGroup,
    hotelGroupsLoading,
    hotelGroupLoading,
    hotelGroupCreating,
    hotelGroupUpdating,
    hotelGroupRemoving,
    hotelGroupListCalled,
    hotelGroupGetCalled,
    hotelGroupCreateCalled,
    hotelGroupUpdateCalled,
    hotelGroupRemoveCalled,
  };
};
