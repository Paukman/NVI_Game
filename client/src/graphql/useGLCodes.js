import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { gLCodesQueries } from './queries/gLCodesQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useGLCodes = () => {
  const [hmgGlCodeListState, setHmgGlCodeListState] = useState({ data: null, errors: [] });
  const [hmgGlCodeGetState, setHmgGlCodeGetState] = useState({ data: null, errors: [] });
  const [hmgGlCodeCreateState, setHmgGlCodeCreateState] = useState({ data: null, errors: [] });
  const [hmgGlCodeUpdateState, setHmgGlCodeUpdateState] = useState({ data: null, errors: [] });
  const [hmgGlCodeRemoveState, setHmgGlCodeRemoveState] = useState({ data: null, errors: [] });
  const [hmgGlCodeMapState, setHmgGlCodeMapState] = useState({ data: null, errors: [] });
  const [hmgGlCodeSetStatusState, setHmgGlCodeSetStatusState] = useState({ data: null, errors: [] });
  const [hmgGlCodeSetStatusAllState, setHmgGlCodeSetStatusAllState] = useState({ data: null, errors: [] });
  const [hmgGlCodeListMdoStatusState, setHmgGlCodeListMdoStatusState] = useState({ data: null, errors: [] });
  const [hmgGlCodeCopyMappingState, setHmgGlCodeCopyMappingState] = useState({ data: null, errors: [] });
  const [hmgGlCodeImportingState, setHmgGlCodeImportingState] = useState({ data: null, errors: [] });

  const [queryHmgGlCodeList, { loading: hmgGlCodeListLoading }] = useLazyQuery(gLCodesQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeListState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching GL Code List: ', ex);

        setHmgGlCodeListState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching GL Code List. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching GL Code List:', response);

      setHmgGlCodeListState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching GL Code List. Please try later`],
          },
        ],
      });
    },
  });

  const [queryHmgGlCodeGet, { loading: hmgGlCodeGetLoading }] = useLazyQuery(gLCodesQueries.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeGet || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeGetState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when getting GL Code: ', ex);

        setHmgGlCodeGetState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when getting GL Code. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when getting GL Code:', response);

      setHmgGlCodeGetState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when getting GL Code. Please try later`],
          },
        ],
      });
    },
  });

  const [queryHmgGlCodeListMdoStatus, { loading: hmgGlCodeListMdoStatusLoading }] = useLazyQuery(
    gLCodesQueries.listMdo,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.hmgGlCodeListMdoStatus || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setHmgGlCodeListMdoStatusState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when listing MDO status: ', ex);

          setHmgGlCodeListMdoStatusState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when listing MDO status. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when listing MDO status:', response);

        setHmgGlCodeListMdoStatusState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when listing MDO status. Please try later`],
            },
          ],
        });
      },
    },
  );
  const [mutationHmgGlCodeCreate, { loading: hmgGlCodeCreateLoading }] = useMutation(gLCodesQueries.create, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeCreate || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeCreateState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when creating GL Code:', ex);

        setHmgGlCodeCreateState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when creating GL Code. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when creating GL Code:', response);

      setHmgGlCodeCreateState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when creating GL Code. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHmgGlCodeUpdate, { loading: hmgGlCodeUpdateLoading }] = useMutation(gLCodesQueries.update, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeUpdate || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeUpdateState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when updating Custom View:', ex);

        setHmgGlCodeUpdateState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when updating Custom View. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when updating Custom View:', response);

      setHmgGlCodeUpdateState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when updating Custom View. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHmgGlCodeRemove, { loading: hmgGlCodeRemoveLoading }] = useMutation(gLCodesQueries.remove, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeRemove || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeRemoveState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when removing GL Code:', ex);

        setHmgGlCodeRemoveState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when removing GL Code. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when removing GL Code:', response);

      setHmgGlCodeRemoveState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when removing GL Code. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHmgGlCodeMap, { loading: hmgGlCodeMapLoading }] = useMutation(gLCodesQueries.mapping, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeMap || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeMapState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when mapping GL Code:', ex);

        setHmgGlCodeMapState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when mapping GL Code. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when mapping GL Code:', response);

      setHmgGlCodeMapState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when mapping GL Code. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHmgGlCodeSetStatus, { loading: hmgGlCodeSetStatusLoading }] = useMutation(gLCodesQueries.setStatus, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeSetStatus || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeSetStatusState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when setting GL Code Status:', ex);

        setHmgGlCodeSetStatusState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when setting GL Code Status. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when setting GL Code Status:', response);

      setHmgGlCodeSetStatusState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when setting GL Code Status. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHmgGlCodeSetStatusAll, { loading: hmgGlCodeSetStatusAllLoading }] = useMutation(
    gLCodesQueries.setStatusAll,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.hmgGlCodeSetStatusAll || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setHmgGlCodeSetStatusAllState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when setting All GL Code Statuses:', ex);

          setHmgGlCodeSetStatusAllState({
            data: [],
            errors: [
              { name: '', message: [`Something went wrong when setting All GL Code Statuses. Please try later`] },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when setting All GL Code Statuses:', response);

        setHmgGlCodeSetStatusAllState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when setting All GL Code Statuses. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationHmgGlCodeCopyMapping, { loading: hmgGlCodeCopyMappingLoading }] = useMutation(gLCodesQueries.copy, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeCopyMapping || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeCopyMappingState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when copying mapping:', ex);

        setHmgGlCodeCopyMappingState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when copying mapping. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when copying mapping:', response);

      setHmgGlCodeCopyMappingState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when copying mapping. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHmgGlCodeImport, { loading: hmgGlCodeImportLoading }] = useMutation(gLCodesQueries.importHmg, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hmgGlCodeCreateMany || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHmgGlCodeImportingState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when importing:', ex);

        setHmgGlCodeImportingState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when importing. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when importing:', response);

      setHmgGlCodeImportingState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when importing. Please try later`],
          },
        ],
      });
    },
  });

  const hmgGlCodeList = useCallback(
    (params) => {
      setHmgGlCodeListState({ data: null, errors: [] });
      queryHmgGlCodeList({ variables: { params } });
    },
    [queryHmgGlCodeList],
  );

  const hmgGlCodeGet = useCallback(
    (id) => {
      setHmgGlCodeGetState({ data: null, errors: [] });
      queryHmgGlCodeGet({ variables: { id } });
    },
    [queryHmgGlCodeGet],
  );

  const hmgGlCodeListMdoStatus = useCallback(
    (params) => {
      setHmgGlCodeListMdoStatusState({ data: null, errors: [] });
      queryHmgGlCodeListMdoStatus({ variables: { params } });
    },
    [queryHmgGlCodeListMdoStatus],
  );
  const hmgGlCodeCreate = useCallback(
    (params) => {
      setHmgGlCodeCreateState({ data: null, errors: [] });
      mutationHmgGlCodeCreate({ variables: { params } });
    },
    [mutationHmgGlCodeCreate],
  );

  const hmgGlCodeUpdate = useCallback(
    (id, params) => {
      setHmgGlCodeUpdateState({ data: null, errors: [] });
      mutationHmgGlCodeUpdate({ variables: { id, params } });
    },
    [mutationHmgGlCodeUpdate],
  );

  const hmgGlCodeRemove = useCallback(
    (id) => {
      setHmgGlCodeRemoveState({ data: null, errors: [] });
      mutationHmgGlCodeRemove({ variables: { id } });
    },
    [mutationHmgGlCodeRemove],
  );

  const hmgGlCodeMap = useCallback(
    (params) => {
      setHmgGlCodeMapState({ data: null, errors: [] });
      mutationHmgGlCodeMap({ variables: { params } });
    },
    [mutationHmgGlCodeMap],
  );

  const hmgGlCodeSetStatus = useCallback(
    (params) => {
      setHmgGlCodeSetStatusState({ data: null, errors: [] });
      mutationHmgGlCodeSetStatus({ variables: { params } });
    },
    [mutationHmgGlCodeSetStatus],
  );

  const hmgGlCodeSetStatusAll = useCallback(
    (params) => {
      setHmgGlCodeSetStatusAllState({ data: null, errors: [] });
      mutationHmgGlCodeSetStatusAll({ variables: { params } });
    },
    [mutationHmgGlCodeSetStatusAll],
  );

  const hmgGlCodeCopyMapping = useCallback(
    (params) => {
      setHmgGlCodeCopyMappingState({ data: null, errors: [] });
      mutationHmgGlCodeCopyMapping({ variables: { params } });
    },
    [mutationHmgGlCodeCopyMapping],
  );

  const hmgGlCodeImport = useCallback(
    (params) => {
      setHmgGlCodeImportingState({ data: null, errors: [] });
      mutationHmgGlCodeImport({ variables: { params } });
    },
    [mutationHmgGlCodeImport],
  );

  return {
    hmgGlCodeList,
    hmgGlCodeListState,
    hmgGlCodeListLoading,

    hmgGlCodeGet,
    hmgGlCodeGetState,
    hmgGlCodeGetLoading,

    hmgGlCodeCreate,
    hmgGlCodeCreateState,
    hmgGlCodeCreateLoading,

    hmgGlCodeUpdate,
    hmgGlCodeUpdateState,
    hmgGlCodeUpdateLoading,

    hmgGlCodeRemove,
    hmgGlCodeRemoveState,
    hmgGlCodeRemoveLoading,

    hmgGlCodeMap,
    hmgGlCodeMapState,
    hmgGlCodeMapLoading,

    hmgGlCodeSetStatus,
    hmgGlCodeSetStatusState,
    hmgGlCodeSetStatusLoading,

    hmgGlCodeSetStatusAll,
    hmgGlCodeSetStatusAllState,
    hmgGlCodeSetStatusAllLoading,

    hmgGlCodeListMdoStatus,
    hmgGlCodeListMdoStatusState,
    hmgGlCodeListMdoStatusLoading,

    hmgGlCodeCopyMapping,
    hmgGlCodeCopyMappingState,
    hmgGlCodeCopyMappingLoading,

    hmgGlCodeImport,
    hmgGlCodeImportingState,
    hmgGlCodeImportLoading,
  };
};
