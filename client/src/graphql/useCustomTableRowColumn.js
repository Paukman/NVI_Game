import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { customTableRowColumnQueries } from './queries/customTableRowColumn';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useCustomTableRowColumn = () => {
  // will use one state for all get/create/update/remove
  const [customTableRowColumn, setCustomTableRowColumn] = useState({ data: null, errors: [] });

  const [queryCustomTableRowColumnGet, { loading: CustomTableRowColumnGetLoading }] = useLazyQuery(
    customTableRowColumnQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.customTableRowColumnGet || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setCustomTableRowColumn({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when fetching Custom Table Row Column :', ex);

          setCustomTableRowColumn({
            data: [],
            errors: [
              { name: '', message: [`Something went wrong when fetching Custom Table Row Column. Please try later`] },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Custom Table Row Column:', response);

        setCustomTableRowColumn({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Custom Table Row Column. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationCustomTableRowColumnCreate, { loading: customTableRowColumnCreateLoading }] = useMutation(
    customTableRowColumnQueries.create,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.customTableRowColumnCreate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setCustomTableRowColumn({
            data: data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setCustomTableRowColumn({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when creating Custom Table Row Column . Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when creating Custom Table Row Column :', response);

        setCustomTableRowColumn({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating Custom Table Row Column . Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationCustomTableRowColumnUpdate, { loading: customTableRowColumnUpdateLoading }] = useMutation(
    customTableRowColumnQueries.update,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.customTableRowColumnUpdate || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setCustomTableRowColumn({
            data: data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setCustomTableRowColumn({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when updating Custom Table Row Column . Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when updating Custom Table Row Column :', response);

        setCustomTableRowColumn({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating Custom Table Row Column . Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationCustomTableRowColumnRemove, { loading: customTableRowColumnUpdateRemove }] = useMutation(
    customTableRowColumnQueries.remove,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.customTableRowColumnRemove || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setCustomTableRowColumn({
            data: data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setCustomTableRowColumn({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when removing Custom Table Row Column . Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing Custom Table Row Column :', response);

        setCustomTableRowColumn({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing Custom Table Row Column . Please try later`],
            },
          ],
        });
      },
    },
  );

  const [mutationCustomTableRowColumnSetOrder, { loading: customTableRowColumnUpdateSetOrder }] = useMutation(
    customTableRowColumnQueries.setOrder,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.customTableRowColumnSetOrder || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setCustomTableRowColumn({
            data: data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setCustomTableRowColumn({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when removing Custom Table Row Column . Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when removing Custom Table Row Column :', response);

        setCustomTableRowColumn({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing Custom Table Row Column . Please try later`],
            },
          ],
        });
      },
    },
  );

  const customTableRowColumnGet = useCallback(
    (id) => {
      setCustomTableRowColumn({ data: null, errors: [] });
      queryCustomTableRowColumnGet({ variables: { id } });
    },
    [queryCustomTableRowColumnGet],
  );

  const customTableRowColumnCreate = useCallback(
    (params) => {
      setCustomTableRowColumn({ data: null, errors: [] });
      mutationCustomTableRowColumnCreate({ variables: { params } });
    },
    [mutationCustomTableRowColumnCreate],
  );

  const customTableRowColumnUpdate = useCallback(
    (id, params) => {
      setCustomTableRowColumn({ data: null, errors: [] });
      mutationCustomTableRowColumnUpdate({ variables: { id, params } });
    },
    [mutationCustomTableRowColumnUpdate],
  );

  const customTableRowColumnRemove = useCallback(
    (id) => {
      setCustomTableRowColumn({ data: null, errors: [] });
      mutationCustomTableRowColumnRemove({ variables: { id } });
    },
    [mutationCustomTableRowColumnRemove],
  );

  const customTableRowColumnSetOrder = useCallback(
    (params) => {
      setCustomTableRowColumn({ data: null, errors: [] });
      mutationCustomTableRowColumnSetOrder({
        variables: {
          params,
        },
      });
    },
    [mutationCustomTableRowColumnSetOrder],
  );

  return {
    customTableRowColumnGet,
    customTableRowColumnCreate,
    customTableRowColumnUpdate,
    customTableRowColumnRemove,
    customTableRowColumnSetOrder,

    customTableRowColumn,
    //customTableRowColumnCRUD,

    CustomTableRowColumnGetLoading,
    customTableRowColumnCreateLoading,
    customTableRowColumnUpdateLoading,
    customTableRowColumnUpdateRemove,
    customTableRowColumnUpdateSetOrder,
  };
};
