import { useCallback, useState } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import logger from 'utils/logger';
import apolloClient from './apolloClient';
import { sortBy } from 'lodash';

import { getLowestLevelItems, mapArrayBy } from 'mdo-react-components';
import { mdoGLCodesQueries } from './queries/mdoGlCodesQueries';

export const useMdoGlCodes = () => {
  const [mdoGlCodes, SetMdoGlCodes] = useState({
    all: [],
    lowest: [],
    mapped: {},
    mdoGlCodeNames: {},
    mdoGlCodeNamesWithDepartments: {},
    departmentNames: {},
    departmentCodes: {},
  });
  const [mdoGlCode, SetMdoGlCode] = useState({ data: null, errors: [] });
  const [mdoGlCodeCreateState, setMdoGlCodeCreateState] = useState({ data: null, errors: [] });
  const [mdoGlCodeUpdateState, setMdoGlCodeUpdateState] = useState({ data: null, errors: [] });
  const [mdoGlCodeRemoveState, setMdoGlCodeRemoveState] = useState({ data: null, errors: [] });

  const [mdoGlCodeDepartment, SetMdoGlCodeDepartment] = useState({ data: null, errors: [] });
  const [mdoGlCodeDepartments, SetMdoGlCodeDepartments] = useState({ data: null, errors: [] });
  const [mdoGlCodeParents, SetMdoGlCodeParents] = useState({ data: null, errors: [] });

  const [queryListMdoGlCodes, { loading: mdoGlCodeListLoading }] = useLazyQuery(mdoGLCodesQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const all = newData.mdoGlCodeList.data || [];

      const lowest = sortBy(getLowestLevelItems(all, 'id', 'parentId', 'children', true), 'id');
      const mapped = mapArrayBy(all, 'id');

      const mix = all.reduce(
        (acc, item) => {
          const departmentName = mapped[item.rootId] ? mapped[item.rootId].displayName : '';
          acc.mdoGlCodeNames[item.id] = `${item.id} - ${item.displayName}`;
          acc.mdoGlCodeNamesWithDepartments[item.id] = `${item.id} - ${item.displayName} ${
            departmentName ? `(${departmentName})` : ''
          }`;
          acc.departmentNames[item.id] = departmentName;
          acc.departmentCodes[item.id] = item.rootId;
          return acc;
        },
        {
          mdoGlCodeNames: {},
          mdoGlCodeNamesWithDepartments: {},
          departmentNames: {},
          departmentCodes: {},
        },
      );

      SetMdoGlCodes({
        all,
        lowest,
        mapped,
        ...mix,
      });
    },
  });

  const [queryGetMdoGlCode, { loading: mdoGlCodeGetLoading }] = useLazyQuery(mdoGLCodesQueries.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.mdoGlCodeGet || {};
        const data = Array.isArray(result.data) ? result.data : [];

        SetMdoGlCode({
          data: data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        SetMdoGlCode({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when Getting mdo gl code . Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when Getting mdo gl code :', response);

      SetMdoGlCode({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when Getting mdo gl code . Please try later`],
          },
        ],
      });
    },
  });

  const [queryListMdoGlCodeParents, { loading: mdoGlCodeParentLoading }] = useLazyQuery(mdoGLCodesQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.mdoGlCodeList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        SetMdoGlCodeParents({
          data: data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        SetMdoGlCodeParents({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when Listing mdo gl code parents. Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when Listing mdo gl code parents :', response);

      SetMdoGlCodeParents({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when Listing mdo gl code parents. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationAddMdoGlCode, { loading: mdoGlCodeCreateLoading }] = useMutation(mdoGLCodesQueries.create, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.mdoGlCodeCreate || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setMdoGlCodeCreateState({
          data: data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setMdoGlCodeCreateState({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when creating mdo gl code . Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when creating mdo gl code :', response);

      setMdoGlCodeCreateState({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when creating mdo gl code . Please try later`],
          },
        ],
      });
    },
  });

  const [mutationUpdateMdoGlCode, { loading: mdoGlCodeUpdateLoading }] = useMutation(mdoGLCodesQueries.update, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      try {
        const result = newData.mdoGlCodeUpdate || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setMdoGlCodeUpdateState({
          data: data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setMdoGlCodeUpdateState({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when updating mdo gl code . Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when updating mdo gl code :', response);

      setMdoGlCodeUpdateState({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when updating mdo gl code . Please try later`],
          },
        ],
      });
    },
  });

  const [mutationRemoveMdoGlCode, { loading: mdoGlCodeRemoveLoading }] = useMutation(mdoGLCodesQueries.remove, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      try {
        const result = newData.mdoGlCodeRemove || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setMdoGlCodeRemoveState({
          data: data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setMdoGlCodeRemoveState({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when removing mdo gl code . Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when removing mdo gl code :', response);

      setMdoGlCodeRemoveState({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when removing mdo gl code . Please try later`],
          },
        ],
      });
    },
  });

  const [queryListMdoGlCodeDepartments, { loading: mdoGlCodeDepartmentsLoading }] = useLazyQuery(
    mdoGLCodesQueries.listDepartment,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (newData) => {
        try {
          const result = newData.mdoGlCodeDepartmentList || {};
          const data = Array.isArray(result.data) ? result.data : [];

          SetMdoGlCodeDepartments({
            data: data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          SetMdoGlCodeDepartments({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when Listing mdo gl code departments. Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when Listing mdo gl code departments :', response);

        SetMdoGlCodeDepartments({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when Listing mdo gl code departments. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryGetMdoGlCodeDepartment, { loading: mdoGlCodeDepartmentLoading }] = useLazyQuery(
    mdoGLCodesQueries.getDepartment,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (newData) => {
        try {
          const result = newData.mdoGlCodeDepartmentGet || {};
          const data = Array.isArray(result.data) ? result.data : [];

          SetMdoGlCodeDepartment({
            data: data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          SetMdoGlCodeDepartment({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when getting mdo gl code department. Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when getting mdo gl code department :', response);

        SetMdoGlCodeDepartment({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when getting mdo gl code department. Please try later`],
            },
          ],
        });
      },
    },
  );

  const listMdoGlCodes = useCallback(
    (params) => {
      queryListMdoGlCodes({ variables: params });
    },
    [queryListMdoGlCodes],
  );

  const getMdoGlCode = useCallback(
    (params) => {
      queryGetMdoGlCode({ variables: params });
    },
    [queryGetMdoGlCode],
  );

  const listMdoGlCodeParents = useCallback(
    (mdoDepartment) => {
      queryListMdoGlCodeParents({ variables: { params: mdoDepartment } });
    },
    [queryListMdoGlCodeParents],
  );

  const createMdoGlCode = useCallback(
    (mdoGlCode) => {
      mutationAddMdoGlCode({ variables: { params: mdoGlCode } });
    },
    [mutationAddMdoGlCode],
  );

  const updateMdoGlCode = useCallback(
    (id, mdoGlCode) => {
      mutationUpdateMdoGlCode({ variables: { id, params: mdoGlCode } });
    },
    [mutationUpdateMdoGlCode],
  );

  const removeMdoGlCode = useCallback(
    (id) => {
      mutationRemoveMdoGlCode({ variables: { id } });
    },
    [mutationRemoveMdoGlCode],
  );

  const listMdoGlCodeDepartment = useCallback(
    (params) => {
      queryListMdoGlCodeDepartments({ variables: params });
    },
    [queryListMdoGlCodeDepartments],
  );

  const getMdoGlCodeDepartment = useCallback(
    (params) => {
      queryGetMdoGlCodeDepartment({ variables: params });
    },
    [queryGetMdoGlCodeDepartment],
  );

  return {
    listMdoGlCodes,
    mdoGlCodeListLoading,
    mdoGlCodes: mdoGlCodes.all,

    lowestMdoGlCodes: mdoGlCodes.lowest,
    mappedMdoGlCodes: mdoGlCodes.mapped,
    mdoGlCodeNames: mdoGlCodes.mdoGlCodeNames,
    mdoGlCodeNamesWithDepartments: mdoGlCodes.mdoGlCodeNamesWithDepartments,
    departmentNames: mdoGlCodes.departmentNames,
    departmentCodes: mdoGlCodes.departmentCodes,

    getMdoGlCode,
    mdoGlCode,
    mdoGlCodeGetLoading,

    listMdoGlCodeParents,
    mdoGlCodeParents,
    mdoGlCodeParentLoading,

    createMdoGlCode,
    mdoGlCodeCreateState,
    mdoGlCodeCreateLoading,

    updateMdoGlCode,
    mdoGlCodeUpdateState,
    mdoGlCodeUpdateLoading,

    removeMdoGlCode,
    mdoGlCodeRemoveState,
    mdoGlCodeRemoveLoading,

    listMdoGlCodeDepartment,
    mdoGlCodeDepartments,
    mdoGlCodeDepartmentsLoading,

    getMdoGlCodeDepartment,
    mdoGlCodeDepartment,
    mdoGlCodeDepartmentLoading,
  };
};
