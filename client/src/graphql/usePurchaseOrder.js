import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import {
  PO_CREATE_MUTATION,
  PO_LIST_QUERY,
  PO_QUERY_GET,
  PO_RECEIVED_MARK_SET_MUTATION,
  PO_UPDATE_MUTATION,
} from './purchaseOrderQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const usePurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState({ data: [], errors: [] });
  const [purchaseOrder, setPurchaseOrder] = useState({ data: null, errors: [] });
  const [purchaseOrderGetState, setPOGetState] = useState({ data: null, errors: [] });
  const [purchaseOrderReceived, setPurchaseOrderReceived] = useState({ data: null, errors: [] });

  const [mutationPurchaseOrderCreate, { loading: porchaseOrderCreateLoading }] = useMutation(PO_CREATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.purchaseOrderCreate || {};
        const data = Array.isArray(result.data) ? result.data : [];
        const updatedItem = data[0];

        setPurchaseOrder({
          data: updatedItem,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setPurchaseOrder({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when creating Purchase Order. Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when creating Purchase Order:', response);

      setPurchaseOrder({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when creating Purchase Order. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationPurchaseOrderUpdate, { loading: porchaseOrderUpdateLoading }] = useMutation(PO_UPDATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.purchaseOrderUpdate || {};
        const data = Array.isArray(result.data) ? result.data : [];
        const updatedItem = data[0];

        setPurchaseOrder({
          data: updatedItem,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setPurchaseOrder({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when updating Purchase Order. Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when updating Purchase Order:', response);

      setPurchaseOrder({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when updating Purchase Order. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationPurchaseOrderSetReceivedMark, { loading: porchaseOrderReceivedMarkSetLoading }] = useMutation(
    PO_RECEIVED_MARK_SET_MUTATION,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.purchaseOrderReceivedMarkSet || {};
          const data = Array.isArray(result.data) ? result.data[0] : null;

          setPurchaseOrderReceived({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setPurchaseOrderReceived({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Receive Mark. Please try later`,
                ],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when setting Receive Mark:', response);

        setPurchaseOrderReceived({
          data: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when setting Receive Mark. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryPurchaseOrderList, { loading: purchaseOrderListLoading }] = useLazyQuery(PO_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.purchaseOrderList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setPurchaseOrders({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when querying Purchase Orders list:', ex);

        setPurchaseOrders({
          data: [],
          errors: [
            { name: '', message: [`Something went wrong when querying Purchase Orders list. Please try later`] },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when querying Purchase Orders list:', response);

      setPurchaseOrders({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying Purchase Orders list. Please try later`],
          },
        ],
      });
    },
  });

  const [queryPurchaseOrderGet, { loading: purchaseOrderGetLoading }] = useLazyQuery(PO_QUERY_GET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.purchaseOrderGet || {};
        const data = Array.isArray(result.data) ? result.data[0] : null;

        setPOGetState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when querying Purchase Order:', ex);

        setPOGetState({
          data: null,
          errors: [
            { name: '', message: [`Something went wrong when querying querying Purchase Order. Please try later`] },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when querying Purchase Orders:', response);

      setPOGetState({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying Purchase Orders list. Please try later`],
          },
        ],
      });
    },
  });

  const purchaseOrderList = useCallback(
    (params) => {
      setPurchaseOrders({ data: null, errors: [] });
      queryPurchaseOrderList({ variables: { params } });
    },
    [queryPurchaseOrderList],
  );

  const purchaseOrderCreate = useCallback(
    (params) => {
      //setPurchaseOrder({ data: [], errors: [] });
      mutationPurchaseOrderCreate({ variables: { params } });
    },
    [mutationPurchaseOrderCreate],
  );

  const purchaseOrderGet = useCallback(
    (id) => {
      setPOGetState({ data: null, errors: [] });
      queryPurchaseOrderGet({ variables: { id } });
    },
    [queryPurchaseOrderGet],
  );

  const purchaseOrderReceivedMarkSet = useCallback(
    (params) => {
      setPurchaseOrderReceived({ data: null, errors: [] });
      mutationPurchaseOrderSetReceivedMark({ variables: { params } });
    },
    [mutationPurchaseOrderSetReceivedMark],
  );

  const purchaseOrderUpdate = useCallback(
    (id, params) => {
      //setPurchaseOrder({ data: [], errors: [] });
      mutationPurchaseOrderUpdate({ variables: { id, params } });
    },
    [mutationPurchaseOrderUpdate],
  );

  return {
    purchaseOrder,
    purchaseOrders,
    purchaseOrderGetState,
    purchaseOrderReceived,

    purchaseOrderCreate,
    purchaseOrderList,
    purchaseOrderGet,
    purchaseOrderReceivedMarkSet,
    purchaseOrderUpdate,

    purchaseOrderGetLoading,
    porchaseOrderCreateLoading,
    purchaseOrderListLoading,
    porchaseOrderReceivedMarkSetLoading,
    porchaseOrderUpdateLoading,
  };
};
