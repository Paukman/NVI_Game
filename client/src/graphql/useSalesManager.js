import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const QUERY_LIST_SALES_MANAGER_LIST = gql`
  query($params: SalesManagerFilter, $pagination: PaginationAndSortingInput) {
    salesManagerList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        firstName
        lastName
        displayName
        phone
        cellPhone
        email
        country
        state
        city
        postalCode
        address1
        address2
        userCreated {
          displayName
        }
        userUpdated {
          displayName
        }
        hotel {
          hotelName
        }
        organization {
          companyName
        }
        permissions
      }
    }
  }
`;

export const QUERY_SALES_MANAGER_CREATE = gql`
  mutation($params: SalesManagerInput) {
    salesManagerCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        firstName
        lastName
        displayName
        phone
        cellPhone
        email
        country
        state
        city
        postalCode
        address1
        address2
      }
    }
  }
`;

export const QUERY_SALES_MANAGER_UPDATE = gql`
  mutation($id: ID, $params: SalesManagerInput) {
    salesManagerUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        firstName
        lastName
        displayName
        phone
        cellPhone
        email
        country
        state
        city
        postalCode
        address1
        address2
      }
    }
  }
`;

export const QUERY_SALES_MANAGER_GET = gql`
  query($id: ID) {
    salesManagerGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        firstName
        lastName
        displayName
        phone
        cellPhone
        email
        country
        state
        city
        postalCode
        address1
        address2
      }
    }
  }
`;

export const QUERY_REMOVE_SALES_MANAGER = gql`
  mutation($id: ID) {
    salesManagerRemove(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
      }
    }
  }
`;

export const useSalesManager = () => {
  const [salesManagers, setSalesManager] = useState({ type: '', data: [], errors: [] });
  const [createSalesManager, setCreateSalesManager] = useState({ data: [], errors: [] });
  const [getSalesManager, setgetSalesManager] = useState({ data: [], errors: [] });
  const [editSalesManager, seteditSalesManager] = useState({ data: [], errors: [] });

  const [queryListSalesManager, { loading: loadingList }] = useLazyQuery(QUERY_LIST_SALES_MANAGER_LIST, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.salesManagerList.data || [];

      setSalesManager({ data: data, errors: [] });
    },
    onError: (err) => {
      setSalesManager({
        data: [],
        errors: [
          {
            name: '',
            messages: [
              `Something went wrong as there is no response from the server for AR Mapping Report. Please try later`,
            ],
          },
        ],
      });
    },
  });

  const [queryGetSalesManager, { loading }] = useLazyQuery(QUERY_SALES_MANAGER_GET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.salesManagerGet.data || [];

      setgetSalesManager({ data: data, errors: [] });
    },
    onError: (err) => {
      setgetSalesManager({
        data: [],
        errors: [
          {
            name: '',
            messages: [
              `Something went wrong as there is no response from the server for AR Mapping Report. Please try later`,
            ],
          },
        ],
      });
    },
  });

  const [mutationCreateOfAccount, { loading: loadingCreate }] = useMutation(QUERY_SALES_MANAGER_CREATE, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setSalesManager({
        type: 'create',
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.salesManagerCreate || {};
      
        setCreateSalesManager({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setSalesManager({
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

  const [mutationUpdateOfAccount, { loading: loadingUpdate }] = useMutation(QUERY_SALES_MANAGER_UPDATE, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      salesManagers({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.salesManagerUpdate || {};

        seteditSalesManager({
          type: 'create',
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        salesManagers({
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

  const [mutationRemoveOfAccount, { loading: loadingRemove }] = useMutation(QUERY_REMOVE_SALES_MANAGER, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setSalesManager({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.salesManagerRemove || {};

        setSalesManager({
          type: 'remove',
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: Array.isArray(result.code) ? result.code : [],
        });
      } catch (ex) {
        setSalesManager({
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

  const listSalesManagers = useCallback(
    (params) => {
      queryListSalesManager({ variables: params });
    },
    [queryListSalesManager],
  );

  const getSalesManagers = useCallback(
    (params) => {
      queryGetSalesManager({ variables: params });
    },
    [queryGetSalesManager],
  );

  const createManager = useCallback(
    (params) => { 
      mutationCreateOfAccount({ variables: params });
    },
    [mutationCreateOfAccount],
  );

  const removeAccount = useCallback(
    (params) => {
      mutationRemoveOfAccount({ variables: params });
    },
    [mutationRemoveOfAccount],
  );

  const updateManager = useCallback(
    (params) => {
      mutationUpdateOfAccount({ variables: params });
    },
    [mutationUpdateOfAccount],
  );

  return {
    listSalesManagers,
    loadingList,
    salesManagers,
    createManager,
    updateManager,
    removeAccount,
    createSalesManager,
    getSalesManagers,
    getSalesManager,
    editSalesManager,
  };
};
