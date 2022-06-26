import { useCallback, useState } from 'react';
import { uniqBy } from 'lodash';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

import { parseJsonSafe } from '../utils/dataManipulation';

import { mapArrayBy } from 'mdo-react-components';

// TODO: Remove next line when BE is ready
import { siteMap as localItems } from '../config/siteMap';

/**
 * TODO: Use real query as soon as it is ready
 */
export const LIST_HOTEL_CLIENT_ACCOUNT_QUERY = gql`
  query($params: HotelClientAccountFilter, $pagination: PaginationAndSortingInput) {
    hotelClientAccountList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        accountName
        hotelSalesManagerId
        managementStatusId
        salesManager {
          displayName
          organization {
            companyName
          }
          hotel {
            hotelName
          }
        }
        permissions
      }
    }
  }
`;

export const GET_HOTEL_CLIENT_ACCOUNT_QUERY = gql`
  query ($id: ID) {
    hotelClientAccountGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        accountName
        hotelSalesManagerId
        managementStatusId
      }
    }
  }
`;

export const GET_MANY_HOTEL_CLIENT_ACCOUNT_QUERY = gql`
  query ($id: [ID]) {
    hotelClientAccountGetMany(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        orgId
        accountName
        hotelSalesManagerId
        managementStatusId
      }
    }
  }
`;

export const CREATE_HOTEL_CLIENT_ACCOUNT_MUTATION = gql`
  mutation ($params: HotelClientAccountInput) {
    hotelClientAccountCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        accountName
        hotelSalesManagerId
        managementStatusId
      }
    }
  }
`;

export const UPDATE_HOTEL_CLIENT_ACCOUNT_MUTATION = gql`
  mutation ($id: ID, $params: HotelClientAccountInput) {
    hotelClientAccountUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        accountName
        hotelSalesManagerId
        managementStatusId
      }
    }
  }
`;

export const REMOVE_HOTEL_CLIENT_ACCOUNT_MUTATION = gql`
  mutation ($id: ID) {
    hotelClientRemove(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        accountName
        hotelSalesManagerId
        managementStatusId
      }
    }
  }
`;

export const REMOVE_MANY_HOTEL_CLIENT_ACCOUNT_MUTATION = gql`
  mutation ($id: [ID]) {
    hotelClientRemoveMany(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        accountName
        hotelSalesManagerId
        managementStatusId
      }
    }
  }
`;

export const useAccountMapping = () => {
  const [listOfAccounts, setListOfAccounts] = useState({ data: [], errors: [] });
  const [accountRemove, setaccountRemove] = useState('');

  const [queryListOfAccounts, { loading: loadingListAccount }] = useLazyQuery(LIST_HOTEL_CLIENT_ACCOUNT_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setListOfAccounts({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountList || {};

        setListOfAccounts({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setListOfAccounts({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong as there is no response from the server for accounts. Please try later`],
            },
          ],
        });
      }
    },
  });

  const [queryGetOfAccount, { loading: loadingGet }] = useLazyQuery(GET_HOTEL_CLIENT_ACCOUNT_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setListOfAccounts({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountGet || {};

        setListOfAccounts({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setListOfAccounts({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong as there is no response from the server for account. Please try later`],
            },
          ],
        });
      }
    },
  });

  const [queryGetManyOfAccounts, { loading: loadingGetMany }] = useLazyQuery(GET_MANY_HOTEL_CLIENT_ACCOUNT_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setListOfAccounts({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountGetMany || {};

        setListOfAccounts({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setListOfAccounts({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong as there is no response from the server for accounts. Please try later`],
            },
          ],
        });
      }
    },
  });

  const [mutationCreateOfAccount, { loading: loadingCreate }] = useMutation(CREATE_HOTEL_CLIENT_ACCOUNT_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setListOfAccounts({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountCreate || {};

        setListOfAccounts({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setListOfAccounts({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong as there is no response from the server for account. Please try later`],
            },
          ],
        });
      }
    },
  });

  const [mutationUpdateOfAccount, { loading: loadingUpdate }] = useMutation(UPDATE_HOTEL_CLIENT_ACCOUNT_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setListOfAccounts({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountUpdate || {};

        setListOfAccounts({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setListOfAccounts({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong as there is no response from the server for account. Please try later`],
            },
          ],
        });
      }
    },
  });

  const [mutationRemoveOfAccount, { loading: loadingRemove }] = useMutation(REMOVE_HOTEL_CLIENT_ACCOUNT_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setaccountRemove('error');
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelClientRemove || {};

        setaccountRemove('done');
      } catch (ex) {
        setaccountRemove('error');
      }
    },
  });

  const [mutationRemoveManyOfAccounts, { loading: loadingRemoveMany }] = useMutation(
    REMOVE_MANY_HOTEL_CLIENT_ACCOUNT_MUTATION,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onError: (response) => {
        setListOfAccounts({
          data: [],
          errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.hotelClientRemoveMany || {};

          setListOfAccounts({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
            code: Array.isArray(result.code) ? result.code : [],
          });
        } catch (ex) {
          setListOfAccounts({
            data: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for accounts. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const listAccounts = useCallback(
    (params) => {
      queryListOfAccounts({ variables: params });
    },
    [queryListOfAccounts],
  );

  const getAccount = useCallback(
    (params) => {
      queryGetOfAccount({ variables: params });
    },
    [queryGetOfAccount],
  );

  const getManyAccounts = useCallback(
    (params) => {
      queryGetManyOfAccounts({ variables: params });
    },
    [queryGetManyOfAccounts],
  );

  const createAccount = useCallback(
    (params) => {
      mutationCreateOfAccount({ variables: params });
    },
    [mutationCreateOfAccount],
  );

  const updateAccount = useCallback(
    (params) => {
      mutationUpdateOfAccount({ variables: params });
    },
    [mutationUpdateOfAccount],
  );

  const removeAccount = useCallback(
    (params) => {
      setaccountRemove('');
      mutationRemoveOfAccount({ variables: params });
    },
    [mutationRemoveOfAccount],
  );

  const removeManyAccounts = useCallback(
    (params) => {
      mutationRemoveManyOfAccounts({ variables: params });
    },
    [mutationRemoveManyOfAccounts],
  );

  return {
    listAccounts,
    getAccount,
    getManyAccounts,
    createAccount,
    updateAccount,
    removeAccount,
    removeManyAccounts,
    loadingListAccount,
    loadingGet,
    loadingGetMany,
    loadingCreate,
    loadingUpdate,
    loadingRemove,
    loadingRemoveMany,
    listOfAccounts,
    accountRemove,
  };
};
