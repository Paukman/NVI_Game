import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import apolloClient from './apolloClient';
import { ADDRESS_UPDATE_QUERY, ADDRESS_CREATE_MUTATION, ADDRESS_REMOVE_MUTATION } from './adressQueries';
import logger from '../utils/logger';

export const useAddress = () => {
  const [address, setAddress] = useState({ data: null, errors: [] });
  const [addressRemoved, setAddressRemoved] = useState({ data: null, errors: [] });

  const [mutationAddressCreate, { loading: addressCreateLoading }] = useMutation(ADDRESS_CREATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.addressCreate || {};
        const data = Array.isArray(result.data) ? result.data : [];
        const updatedItem = data[0];

        setAddress({
          data: updatedItem,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setAddress({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when creating Address. Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when creating Address:', response);

      setAddress({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when creating Address. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationAddressUpdate, { loading: addressUpdateLoading }] = useMutation(ADDRESS_UPDATE_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.addressUpdate || {};
        const data = Array.isArray(result.data) ? result.data : [];
        const updatedItem = data[0];

        setAddress({
          data: updatedItem,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setAddress({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when updating Address. Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when updating Address:', response);

      setAddress({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when updating Address. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationAddressRemove, { loading: addressRemoveLoading }] = useMutation(ADDRESS_REMOVE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.addressRemove || {};
        const data = Array.isArray(result.data) ? result.data : [];
        const updatedItem = data[0];

        setAddressRemoved({
          data: updatedItem,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setAddressRemoved({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when removing Address. Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when removing Address:', response);

      setAddressRemoved({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when removing Address. Please try later`],
          },
        ],
      });
    },
  });

  const addressCreate = useCallback(
    (params) => {
      setAddress({ data: null, errors: [] });
      mutationAddressCreate({ variables: { params } });
    },
    [mutationAddressCreate],
  );

  const addressUpdate = useCallback(
    (id, params) => {
      setAddress({ data: null, errors: [] });
      mutationAddressUpdate({ variables: { id, params } });
    },
    [mutationAddressUpdate],
  );

  const addressRemove = useCallback(
    (id) => {
      setAddressRemoved({ data: null, errors: [] });
      mutationAddressRemove({ variables: { id } });
    },
    [mutationAddressRemove],
  );

  return {
    addressCreate,
    addressUpdate,
    addressRemove,

    addressCreateLoading,
    addressUpdateLoading,
    addressRemoveLoading,

    address,
    addressRemoved,
  };
};
