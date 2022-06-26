import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { dashboardCommentsQueries } from './queries/dashboardCommentsQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useDashboardComments = () => {
  const [dashboardCommentListState, setDashboardCommentListState] = useState({ data: null, errors: [] });
  const [dashboardCommentCreateState, setDashboardCommentCreateState] = useState({ data: null, errors: [] });
  const [dashboardCommentUpdateState, setDashboardCommentUpdateState] = useState({ data: null, errors: [] });
  const [dashboardCommentRemoveState, setDashboardCommentRemoveState] = useState({ data: null, errors: [] });
  const [dashboardCommentStatusSetState, setDashboardCommentStatusSetState] = useState({ data: null, errors: [] });

  const [queryDashboardCommentList, { loading: dashboardCommentListLoading }] = useLazyQuery(
    dashboardCommentsQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.dashboardCommentList || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setDashboardCommentListState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when fetching Dashboard Comment List: ', ex);

          setDashboardCommentListState({
            data: [],
            errors: [
              { name: '', message: [`Something went wrong when fetching Dashboard Comment List. Please try later`] },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Dashboard Comment List:', response);

        setDashboardCommentListState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Dashboard Comment List. Please try later`],
            },
          ],
        });
      },
    },
  );
  const [mutationDashboardCommentCreate, { loading: dashboardCommentCreateLoading }] = useMutation(
    dashboardCommentsQueries.create,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.dashboardCommentCreate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setDashboardCommentCreateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when creating Dashboard Comment:', ex);

          setDashboardCommentCreateState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when creating Dashboard Comment. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when creating Dashboard Comment:', response);

        setDashboardCommentCreateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating Dashboard Comment. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationDashboardCommentUpdate, { loading: dashboardCommentUpdateLoading }] = useMutation(
    dashboardCommentsQueries.update,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.dashboardCommentUpdate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setDashboardCommentUpdateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when updating Dashboard Comment:', ex);

          setDashboardCommentUpdateState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when updating Dashboard Comment. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when updating Dashboard Comment:', response);

        setDashboardCommentUpdateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating Dashboard Comment. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationDashboardCommentRemove, { loading: dashboardCommentRemoveLoading }] = useMutation(
    dashboardCommentsQueries.remove,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.dashboardCommentRemove || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setDashboardCommentRemoveState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when removing Dashboard Comment:', ex);

          setDashboardCommentRemoveState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when removing Dashboard Comment. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing Dashboard Comment:', response);

        setDashboardCommentRemoveState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing Dashboard Comment. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationDashboardCommentStatusSet, { loading: dashboardCommentStatusSetLoading }] = useMutation(
    dashboardCommentsQueries.setStatus,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.dashboardCommentStatusSet || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setDashboardCommentStatusSetState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when setting Dashboard Comment status:', ex);

          setDashboardCommentStatusSetState({
            data: [],
            errors: [
              { name: '', message: [`Something went wrong when setting Dashboard Comment status. Please try later`] },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when setting Dashboard Comment status:', response);

        setDashboardCommentStatusSetState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when setting Dashboard Comment status. Please try later`],
            },
          ],
        });
      },
    },
  );

  const dashboardCommentList = useCallback(
    (params) => {
      setDashboardCommentListState({ data: null, errors: [] });
      queryDashboardCommentList({ variables: { params } });
    },
    [queryDashboardCommentList],
  );
  const dashboardCommentCreate = useCallback(
    (params) => {
      setDashboardCommentCreateState({ data: null, errors: [] });
      mutationDashboardCommentCreate({ variables: { params } });
    },
    [mutationDashboardCommentCreate],
  );

  const dashboardCommentUpdate = useCallback(
    (id, params) => {
      setDashboardCommentUpdateState({ data: null, errors: [] });
      mutationDashboardCommentUpdate({ variables: { id, params } });
    },
    [mutationDashboardCommentUpdate],
  );

  const dashboardCommentRemove = useCallback(
    (id) => {
      setDashboardCommentRemoveState({ data: null, errors: [] });
      mutationDashboardCommentRemove({ variables: { id } });
    },
    [mutationDashboardCommentRemove],
  );

  const dashboardCommentStatusSet = useCallback(
    (id, params) => {
      setDashboardCommentStatusSetState({ data: null, errors: [] });
      mutationDashboardCommentStatusSet({ variables: { id, params } });
    },
    [mutationDashboardCommentStatusSet],
  );

  return {
    dashboardCommentList,
    dashboardCommentListState,
    dashboardCommentListLoading,

    dashboardCommentCreate,
    dashboardCommentCreateState,
    dashboardCommentCreateLoading,

    dashboardCommentUpdate,
    dashboardCommentUpdateState,
    dashboardCommentUpdateLoading,

    dashboardCommentRemove,
    dashboardCommentRemoveState,
    dashboardCommentRemoveLoading,

    dashboardCommentStatusSet,
    dashboardCommentStatusSetState,
    dashboardCommentStatusSetLoading,
  };
};
