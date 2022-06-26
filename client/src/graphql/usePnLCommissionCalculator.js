import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { pnlComissionCalculatorQueries } from './queries/pnlComissionCalculatorQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const usePnLCommissionCalculator = () => {
  // will use one state for all get/create/update/remove
  const [pnlCommissionCalculatorGetState, setPnlCommissionCalculatorGetState] = useState({ data: null, errors: [] });
  const [pnlCommissionCalculatorListState, setPnlCommissionCalculatorListState] = useState({ data: null, errors: [] });
  const [pnlCommissionCalculatorGetManyState, setPnlCommissionCalculatorGetManyState] = useState({
    data: null,
    errors: [],
  });
  const [pnlCommissionCalculatorCreateState, setPnlCommissionCalculatorCreateState] = useState({
    data: null,
    errors: [],
  });
  const [pnlCommissionCalculatorUpdateState, setPnlCommissionCalculatorUpdateState] = useState({
    data: null,
    errors: [],
  });
  const [pnlCommissionCalculatorRemoveState, setPnlCommissionCalculatorRemoveState] = useState({
    data: null,
    errors: [],
  });
  const [pnlCommissionCalculatorRemoveManyState, setPnlCommissionCalculatorRemoveManyState] = useState({
    data: null,
    errors: [],
  });

  const [pnlCommissionsCalculateState, setPnlCommissionsCalculateState] = useState({
    data: null,
    errors: [],
  });

  const [queryPnlCommissionCalculatorList, { loading: pnlCommissionCalculatorListLoading }] = useLazyQuery(
    pnlComissionCalculatorQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionList || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorListState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when listing PnL Commisions:', ex);

          setPnlCommissionCalculatorListState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when listing PnL Commisions. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when listing PnL Commisions:', response);

        setPnlCommissionCalculatorListState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when listing PnL Commisions. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryPnlCommissionCalculatorGet, { loading: pnlCommissionCalculatorGetLoading }] = useLazyQuery(
    pnlComissionCalculatorQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionGet || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorGetState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when getting PnL Commision:', ex);

          setPnlCommissionCalculatorGetState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when getting PnL Commision. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when getting PnL Commision:', response);

        setPnlCommissionCalculatorGetState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when getting PnL Commision. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryPnlCommissionCalculatorGetMany, { loading: pnlCommissionCalculatorGetManyLoading }] = useLazyQuery(
    pnlComissionCalculatorQueries.getMany,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionGetMany || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorGetManyState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when getting PnL Commisions:', ex);

          setPnlCommissionCalculatorGetManyState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when getting PnL Commisions. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when getting PnL Commisions:', response);

        setPnlCommissionCalculatorGetManyState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when getting PnL Commisions. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlCommissionCalculatorCreate, { loading: pnlCommissionCalculatorCreateLoading }] = useMutation(
    pnlComissionCalculatorQueries.create,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionCreate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorCreateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when creating PnL Commision:', ex);

          setPnlCommissionCalculatorCreateState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when creating PnL Commision. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when creating PnL Commision:', response);

        setPnlCommissionCalculatorCreateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating PnL Commision. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlCommissionCalculatorUpdate, { loading: pnlCommissionCalculatorUpdateLoading }] = useMutation(
    pnlComissionCalculatorQueries.update,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionUpdate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorUpdateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when updating PnL Commision:', ex);

          setPnlCommissionCalculatorUpdateState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when updating PnL Commision. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when updating PnL Commision:', response);

        setPnlCommissionCalculatorUpdateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating PnL Commision. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlCommissionCalculatorRemove, { loading: pnlCommissionCalculatorRemoveLoading }] = useMutation(
    pnlComissionCalculatorQueries.remove,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionRemove || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorRemoveState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when removing PnL Commision:', ex);

          setPnlCommissionCalculatorRemoveState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when removing PnL Commision. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing PnL Commision:', response);

        setPnlCommissionCalculatorRemoveState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing PnL Commision. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlCommissionCalculatorRemoveMany, { loading: pnlCommissionCalculatorRemoveManyLoading }] =
    useMutation(pnlComissionCalculatorQueries.removeMany, {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionRemoveMany || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionCalculatorRemoveManyState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when removing PnL Commisions:', ex);

          setPnlCommissionCalculatorRemoveManyState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when removing PnL Commisions. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing PnL Commisions:', response);

        setPnlCommissionCalculatorRemoveManyState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing PnL Commisions . Please try later`],
            },
          ],
        });
      },
    });

  const [queryPnlCommissionsCalculate, { loading: pnlCommissionsCalculateLoading }] = useLazyQuery(
    pnlComissionCalculatorQueries.calcCommissions,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlCommissionCalculate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlCommissionsCalculateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when calculating PnL Commissions:', ex);

          setPnlCommissionsCalculateState({
            data: [],
            errors: [
              { name: '', message: [`Something went wrong when calculating PnL Commissions. Please try later`] },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when calculating PnL Commissions:', response);

        setPnlCommissionsCalculateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when calculating PnL Commissions. Please try later`],
            },
          ],
        });
      },
    },
  );

  const pnlCommissionCalculatorList = useCallback(
    (params) => {
      setPnlCommissionCalculatorListState({ data: null, errors: [] });
      queryPnlCommissionCalculatorList({ variables: { params } });
    },
    [queryPnlCommissionCalculatorList],
  );

  const pnlCommissionCalculatorGet = useCallback(
    (id) => {
      setPnlCommissionCalculatorGetState({ data: null, errors: [] });
      queryPnlCommissionCalculatorGet({ variables: { id } });
    },
    [queryPnlCommissionCalculatorGet],
  );

  const pnlCommissionCalculatorGetMany = useCallback(
    (id) => {
      setPnlCommissionCalculatorGetManyState({ data: null, errors: [] });
      queryPnlCommissionCalculatorGetMany({ variables: { id } });
    },
    [queryPnlCommissionCalculatorGetMany],
  );

  const pnlCommissionCalculatorCreate = useCallback(
    (params) => {
      setPnlCommissionCalculatorCreateState({ data: null, errors: [] });
      mutationPnlCommissionCalculatorCreate({ variables: { params } });
    },
    [mutationPnlCommissionCalculatorCreate],
  );

  const pnlCommissionCalculatorUpdate = useCallback(
    (params) => {
      setPnlCommissionCalculatorUpdateState({ data: null, errors: [] });
      mutationPnlCommissionCalculatorUpdate({ variables: { params } });
    },
    [mutationPnlCommissionCalculatorUpdate],
  );

  const pnlCommissionCalculatorRemove = useCallback(
    (params) => {
      setPnlCommissionCalculatorRemoveState({ data: null, errors: [] });
      mutationPnlCommissionCalculatorRemove({ variables: { params } });
    },
    [mutationPnlCommissionCalculatorRemove],
  );

  const pnlCommissionCalculatorRemoveMany = useCallback(
    (params) => {
      setPnlCommissionCalculatorRemoveManyState({ data: null, errors: [] });
      mutationPnlCommissionCalculatorRemoveMany({ variables: { params } });
    },
    [mutationPnlCommissionCalculatorRemoveMany],
  );

  const pnlCommissionsCalculate = useCallback(
    (params) => {
      setPnlCommissionsCalculateState({ data: null, errors: [] });
      queryPnlCommissionsCalculate({ variables: { params } });
    },
    [queryPnlCommissionsCalculate],
  );

  return {
    pnlCommissionCalculatorGet,
    pnlCommissionCalculatorGetLoading,
    pnlCommissionCalculatorGetState,

    pnlCommissionCalculatorList,
    pnlCommissionCalculatorListState,
    pnlCommissionCalculatorListLoading,

    pnlCommissionCalculatorGetMany,
    pnlCommissionCalculatorGetManyLoading,
    pnlCommissionCalculatorGetManyState,

    pnlCommissionCalculatorCreate,
    pnlCommissionCalculatorCreateState,
    pnlCommissionCalculatorCreateLoading,

    pnlCommissionCalculatorUpdate,
    pnlCommissionCalculatorUpdateState,
    pnlCommissionCalculatorUpdateLoading,

    pnlCommissionCalculatorRemove,
    pnlCommissionCalculatorRemoveState,
    pnlCommissionCalculatorRemoveLoading,

    pnlCommissionCalculatorRemoveMany,
    pnlCommissionCalculatorRemoveManyState,
    pnlCommissionCalculatorRemoveManyLoading,

    pnlCommissionsCalculate,
    pnlCommissionsCalculateState,
    pnlCommissionsCalculateLoading,
  };
};
