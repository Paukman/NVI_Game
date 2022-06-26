import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { dashboardWidgetQueries } from './queries';

export const useDashboardWidget = () => {
  const [dashboardWidgets, setDashboardWidgets] = useState({ data: [], ...buildErrors() });
  const [dashboardWidget, setDashboardWidget] = useState({ data: null, ...buildErrors() });
  const [dashboardWidgetSetOrderResult, setDashboardWidgetSetOrderResult] = useState({ data: null, ...buildErrors() });
  const [dashboardWidgetToggleResult, setDashboardWidgetToggleResult] = useState({ data: null, ...buildErrors() });

  const [
    queryDashboardWidgetList,
    { loading: dashboardWidgetsLoading, called: dashboardWidgetListCalled },
  ] = useLazyQuery(dashboardWidgetQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.dashboardWidgetList || {};

      const data = Array.isArray(result.data) ? result.data : [];
      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying dashboards widgets list:', errors.errors);
      }

      setDashboardWidgets({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying dashboard widgets list:', response);

      setDashboardWidgets({
        data: [],
        slugs: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying dashboard widgets list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryDashboardWidgetGet, { loading: dashboardWidgetLoading, called: dashboardWidgetGetCalled }] = useLazyQuery(
    dashboardWidgetQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.dashboardWidgetGet || {};

        const data = Array.isArray(result.data) ? result.data[0] : null;

        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying dashboard widget details:', errors.errors);
        }

        setDashboardWidget({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying dashboard widget details:', response);

        setDashboardWidget({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying dashboard widget details. Please try later.`],
              },
            ],
          }),
        });
      },
    },
  );

  const [
    mutationDashboardWidgetCreate,
    { loading: dashboardWidgetCreating, called: dashboardWidgetCreateCalled },
  ] = useMutation(dashboardWidgetQueries.create, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.dashboardWidgetCreate || {};

      setDashboardWidget({
        data: result?.data?.[0] || {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when creating a dashboard widget:', response);

      setDashboardWidget({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating a dashboard widget. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [
    mutationDashboardWidgetUpdate,
    { loading: dashboardWidgetUpdating, called: dashboardWidgetUpdateCalled },
  ] = useMutation(dashboardWidgetQueries.udpate, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.dashboardWidgetUdpate || {};

      setDashboardWidget({
        data: result?.data?.[0] || {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when updating a dashboard widget:', response);

      setDashboardWidget({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating a dashboard widget. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [
    mutationDashboardWidgetRemove,
    { loading: dashboardWidgetRemoving, called: dashboardWidgetRemoveCalled },
  ] = useMutation(dashboardWidgetQueries.remove, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.dashboardWidgetRemove || {};

      setDashboardWidget({
        data: result?.data?.[0] || {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when removing a dashboard widget:', response);

      setDashboardWidget({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing a dashboard widget. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [
    mutationDashboardWidgetSetOrder,
    { loading: dashboardWidgetSettingOrder, called: dashboardWidgetSetOrderCalled },
  ] = useMutation(dashboardWidgetQueries.setOrder, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.dashboardWidgetSetOrder || {};

      setDashboardWidgetSetOrderResult({
        data: result.data,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when setting order for the dashboard widgets:', response);

      setDashboardWidgetSetOrderResult({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when setting order for the dashboard widgets. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [
    mutationDashboardWidgetToggle,
    { loading: dashboardWidgetToggleSaving, called: dashboardWidgetToggleCalled },
  ] = useMutation(dashboardWidgetQueries.status, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.dashboardWidgetSetToggle || {};

      setDashboardWidgetToggleResult({
        data: result?.data?.[0] || {},
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when toggling dashboard widgets statuses:', response);

      setDashboardWidgetToggleResult({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when toggling dashboard widgets statuses. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const dashboardWidgetList = useCallback(
    (variables) => {
      queryDashboardWidgetList({ variables });
    },
    [queryDashboardWidgetList],
  );

  const dashboardWidgetGet = useCallback(
    (id) => {
      queryDashboardWidgetGet({ variables: { id } });
    },
    [queryDashboardWidgetGet],
  );

  const dashboardWidgetCreate = useCallback(
    (params) => {
      mutationDashboardWidgetCreate({ variables: { params } });
    },
    [mutationDashboardWidgetCreate],
  );

  const dashboardWidgetUpdate = useCallback(
    (variables) => {
      mutationDashboardWidgetUpdate({ variables });
    },
    [mutationDashboardWidgetUpdate],
  );

  const dashboardWidgetRemove = useCallback(
    (id) => {
      mutationDashboardWidgetRemove({ variables: { id } });
    },
    [mutationDashboardWidgetRemove],
  );

  const dashboardWidgetSetOrder = useCallback(
    (params) => {
      mutationDashboardWidgetSetOrder({ variables: { params } });
    },
    [mutationDashboardWidgetSetOrder],
  );

  const dashboardWidgetToggle = useCallback(
    (params) => {
      mutationDashboardWidgetToggle({ variables: { params } });
    },
    [mutationDashboardWidgetToggle],
  );

  return {
    dashboardWidgetList,
    dashboardWidgetGet,
    dashboardWidgetCreate,
    dashboardWidgetUpdate,
    dashboardWidgetRemove,
    dashboardWidgetSetOrder,
    dashboardWidgetToggle,
    dashboardWidgets,
    dashboardWidget,
    dashboardWidgetsLoading,
    dashboardWidgetLoading,
    dashboardWidgetCreating,
    dashboardWidgetUpdating,
    dashboardWidgetRemoving,
    dashboardWidgetListCalled,
    dashboardWidgetGetCalled,
    dashboardWidgetCreateCalled,
    dashboardWidgetUpdateCalled,
    dashboardWidgetRemoveCalled,
    dashboardWidgetSettingOrder,
    dashboardWidgetSetOrderCalled,
    dashboardWidgetSetOrderResult,
    dashboardWidgetToggleSaving,
    dashboardWidgetToggleCalled,
    dashboardWidgetToggleResult,
  };
};
