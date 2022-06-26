import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { pnlReportCustomViewQueries } from './queries/pnlReportCustomViewQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const usePnlReportCustomView = () => {
  const [pnlReportCustomViewListState, setPnlReportCustomViewListState] = useState({ data: null, errors: [] });
  const [pnlReportCustomViewGetState, setPnlReportCustomViewGetState] = useState({ data: null, errors: [] });
  const [pnlReportCustomViewGetManyState, setPnlReportCustomViewGetManyState] = useState({ data: null, errors: [] });
  const [pnlReportCustomViewCreateState, setPnlReportCustomViewCreateState] = useState({ data: null, errors: [] });
  const [pnlReportCustomViewUpdateState, setPnlReportCustomViewUpdateState] = useState({ data: null, errors: [] });
  const [pnlReportCustomViewRemoveState, setPnlReportCustomViewRemoveState] = useState({ data: null, errors: [] });
  const [pnlReportCustomViewRemoveManyState, setPnlReportCustomViewRemoveManyState] = useState({
    data: null,
    errors: [],
  });

  const [queryPnlReportCustomViewList, { loading: pnlReportCustomViewListLoading }] = useLazyQuery(
    pnlReportCustomViewQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewList || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewListState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when fetching Custom View List: ', ex);

          setPnlReportCustomViewListState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when fetching Custom View List. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Custom View List:', response);

        setPnlReportCustomViewListState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Custom View List. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryPnlReportCustomViewGet, { loading: pnlReportCustomViewGetLoading }] = useLazyQuery(
    pnlReportCustomViewQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewGet || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewGetState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when getting Custom View: ', ex);

          setPnlReportCustomViewGetState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when getting Custom View. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when getting Custom View:', response);

        setPnlReportCustomViewGetState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when getting Custom View. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryPnlReportCustomViewGetMany, { loading: pnlReportCustomViewGetManyLoading }] = useLazyQuery(
    pnlReportCustomViewQueries.getMany,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewGetMany || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewGetManyState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when getting Custom Views: ', ex);

          setPnlReportCustomViewGetManyState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when getting Custom Views. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when getting Custom Views:', response);

        setPnlReportCustomViewGetManyState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when getting Custom Views. Please try later`],
            },
          ],
        });
      },
    },
  );
  const [mutationPnlReportCustomViewCreate, { loading: pnlReportCustomViewCreateLoading }] = useMutation(
    pnlReportCustomViewQueries.create,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewCreate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewCreateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when creating Custom View:', ex);

          setPnlReportCustomViewCreateState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when creating Custom View. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when creating Custom View:', response);

        setPnlReportCustomViewCreateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating Custom View. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlReportCustomViewUpdate, { loading: pnlReportCustomViewUpdateLoading }] = useMutation(
    pnlReportCustomViewQueries.update,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewUpdate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewUpdateState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when updating Custom View:', ex);

          setPnlReportCustomViewUpdateState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when updating Custom View. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when updating Custom View:', response);

        setPnlReportCustomViewUpdateState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating Custom View. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlReportCustomViewRemove, { loading: pnlReportCustomViewRemoveLoading }] = useMutation(
    pnlReportCustomViewQueries.remove,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewRemove || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewRemoveState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when removing Custom View:', ex);

          setPnlReportCustomViewRemoveState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when removing Custom View. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing Custom View:', response);

        setPnlReportCustomViewRemoveState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing Custom View. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationPnlReportCustomViewRemoveMany, { loading: pnlReportCustomViewRemoveManyLoading }] = useMutation(
    pnlReportCustomViewQueries.removeMany,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.pnlReportCustomViewRemoveMany || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setPnlReportCustomViewRemoveManyState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when removing Custom Views:', ex);

          setPnlReportCustomViewRemoveManyState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when removing Custom Views. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing Custom Views:', response);

        setPnlReportCustomViewRemoveManyState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing Custom Views. Please try later`],
            },
          ],
        });
      },
    },
  );

  const pnlReportCustomViewList = useCallback(
    (params) => {
      setPnlReportCustomViewListState({ data: null, errors: [] });
      queryPnlReportCustomViewList({ variables: { params } });
    },
    [queryPnlReportCustomViewList],
  );

  const pnlReportCustomViewGet = useCallback(
    (id) => {
      setPnlReportCustomViewGetState({ data: null, errors: [] });
      queryPnlReportCustomViewGet({ variables: { id } });
    },
    [queryPnlReportCustomViewGet],
  );

  const pnlReportCustomViewGetMany = useCallback(
    (id) => {
      setPnlReportCustomViewGetManyState({ data: null, errors: [] });
      queryPnlReportCustomViewGetMany({ variables: { id } });
    },
    [queryPnlReportCustomViewGetMany],
  );
  const pnlReportCustomViewCreate = useCallback(
    (id) => {
      setPnlReportCustomViewCreateState({ data: null, errors: [] });
      mutationPnlReportCustomViewCreate({ variables: { id } });
    },
    [mutationPnlReportCustomViewCreate],
  );

  const pnlReportCustomViewUpdate = useCallback(
    (id, params) => {
      setPnlReportCustomViewUpdateState({ data: null, errors: [] });
      mutationPnlReportCustomViewUpdate({ variables: { id, params } });
    },
    [mutationPnlReportCustomViewUpdate],
  );

  const pnlReportCustomViewRemove = useCallback(
    (id) => {
      setPnlReportCustomViewRemoveState({ data: null, errors: [] });
      mutationPnlReportCustomViewRemove({ variables: { id } });
    },
    [mutationPnlReportCustomViewRemove],
  );

  const pnlReportCustomViewRemoveMany = useCallback(
    (id) => {
      setPnlReportCustomViewRemoveManyState({ data: null, errors: [] });
      mutationPnlReportCustomViewRemoveMany({ variables: { id } });
    },
    [mutationPnlReportCustomViewRemoveMany],
  );

  return {
    pnlReportCustomViewList,
    pnlReportCustomViewListState,
    pnlReportCustomViewListLoading,

    pnlReportCustomViewGet,
    pnlReportCustomViewGetState,
    pnlReportCustomViewGetLoading,

    pnlReportCustomViewGetMany,
    pnlReportCustomViewGetManyState,
    pnlReportCustomViewGetManyLoading,

    pnlReportCustomViewCreate,
    pnlReportCustomViewCreateState,
    pnlReportCustomViewCreateLoading,

    pnlReportCustomViewUpdate,
    pnlReportCustomViewUpdateState,
    pnlReportCustomViewUpdateLoading,

    pnlReportCustomViewRemove,
    pnlReportCustomViewRemoveState,
    pnlReportCustomViewRemoveLoading,

    pnlReportCustomViewRemoveMany,
    pnlReportCustomViewRemoveManyState,
    pnlReportCustomViewRemoveManyLoading,
  };
};
