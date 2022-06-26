import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { organizationQueries } from './queries';

export const useOrganization = () => {
  const [organizations, setOrganizations] = useState({ data: [], ...buildErrors() });
  const [organization, setOrganization] = useState({ data: null, ...buildErrors() });

  const [queryUserList, { loading: organizationsLoading, called: organizationListCalled }] = useLazyQuery(
    organizationQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.organizationList || {};

        const data = Array.isArray(result.data) ? result.data : [];
        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying organizations list:', errors.errors);
        }

        setOrganizations({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying organizations list:', response);

        setOrganizations({
          data: [],
          slugs: {},
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying organizations list. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [queryUserGet, { loading: organizationLoading, called: organizationGetCalled }] = useLazyQuery(
    organizationQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.organizationGet || {};

        const data = Array.isArray(result.data) ? result.data[0] : null;

        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying organization details:', errors.errors);
        }

        setOrganization({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying organization details:', response);

        setOrganization({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying organization details. Please try later.`],
              },
            ],
          }),
        });
      },
    },
  );

  const [mutationUserCreate, { loading: organizationCreating, called: organizationCreateCalled }] = useMutation(
    organizationQueries.create,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        const result = response?.organizationCreate || {};

        setOrganization({
          data: result?.data?.[0] || {},
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when creating a organization:', response);

        setOrganization({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when creating a organization. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [mutationUserUpdate, { loading: organizationUpdating, called: organizationUpdateCalled }] = useMutation(
    organizationQueries.udpate,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        const result = response?.organizationUdpate || {};

        setOrganization({
          data: result?.data?.[0] || {},
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when updating a organization:', response);

        setOrganization({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when updating a organization. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [mutationUserRemove, { loading: organizationRemoving, called: organizationRemoveCalled }] = useMutation(
    organizationQueries.remove,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        const result = response?.organizationRemove || {};

        setOrganization({
          data: result?.data?.[0] || {},
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when removing a organization:', response);

        setOrganization({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when removing a organization. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const organizationList = useCallback(
    (variables) => {
      queryUserList({ variables });
    },
    [queryUserList],
  );

  const organizationGet = useCallback(
    (id) => {
      queryUserGet({ variables: { id } });
    },
    [queryUserGet],
  );

  const organizationCreate = useCallback(
    (params) => {
      mutationUserCreate({ variables: { params } });
    },
    [mutationUserCreate],
  );

  const organizationUpdate = useCallback(
    (variables) => {
      mutationUserUpdate({ variables });
    },
    [mutationUserUpdate],
  );

  const organizationRemove = useCallback(
    (id) => {
      mutationUserRemove({ variables: { id } });
    },
    [mutationUserRemove],
  );

  return {
    organizationList,
    organizationGet,
    organizationCreate,
    organizationUpdate,
    organizationRemove,
    organizations,
    organization,
    organizationsLoading,
    organizationLoading,
    organizationCreating,
    organizationUpdating,
    organizationRemoving,
    organizationListCalled,
    organizationGetCalled,
    organizationCreateCalled,
    organizationUpdateCalled,
    organizationRemoveCalled,
  };
};
