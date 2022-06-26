import { useCallback, useState } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const QUERY_HOTEL_CLIENT_ACCOUNT_MAPPING_LIST = gql`
  query ($params: HotelClientAccountMappingFilter, $pagination: PaginationAndSortingInput) {
    hotelClientAccountMappingList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        sourceAccountName
        hotelClientAccountId
        hotelSalesManagerId
        managementStatusId
        permissions
        hotel {
          hotelName
        }
        hotelClientAccount {
          accountName
          hotelSalesManagerId
          managementStatusId
          salesManager {
            displayName
          }
        }
        hotelSalesManager {
          displayName
        }
      }
    }
  }
`;

export const MUTATION_HOTEL_CLIENT_ACCOUNT_MAPPING_UPDATE = gql`
  mutation ($id: ID, $params: HotelClientAccountMappingInput) {
    hotelClientAccountMappingUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        sourceAccountName
        hotelClientAccountId
        hotelSalesManagerId
        managementStatusId
        hotelSalesManager {
          displayName
        }
      }
    }
  }
`;

export const MUTATION_HOTEL_CLIENT_ACCOUNT_MAPPING_SET = gql`
  mutation ($params: HotelClientAccountMappingSetInput) {
    hotelClientAccountMappingSet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        sourceAccountName
        hotelClientAccountId
        hotelSalesManagerId
        managementStatusId
        hotelSalesManager {
          displayName
        }
      }
    }
  }
`;

export const useARMapping = () => {
  const [hotelClientAccountMappings, setARMappingReport] = useState({ data: [], code: [], errors: [] });
  const [hotelClientAccountMapping, setARAccount] = useState('');
  const [hotelClientAccountMappingsSet, sethotelClientAccountMappingsSet] = useState('');

  const [queryHotelClientAccountMappingGet, { loading: ARMappingLoading }] = useLazyQuery(
    QUERY_HOTEL_CLIENT_ACCOUNT_MAPPING_LIST,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setARMappingReport({
          data: [],
          items: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying AR Mapping report. Please try later`],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.hotelClientAccountMappingList || {};

          setARMappingReport({
            data: result.data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setARMappingReport({
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
        }
      },
    },
  );

  const [mutationARAccount, { loading }] = useMutation(MUTATION_HOTEL_CLIENT_ACCOUNT_MAPPING_UPDATE, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountMappingUpdate || {};

        setARAccount('done');
      } catch (ex) {
        setARAccount('error');
      }
    },
  });

  const [mutationARAccountSet, { loading1 }] = useMutation(MUTATION_HOTEL_CLIENT_ACCOUNT_MAPPING_SET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.hotelClientAccountMappingSet || {};

        sethotelClientAccountMappingsSet('done');
      } catch (ex) {
        sethotelClientAccountMappingsSet('error');
      }
    },
  });

  const hotelClientAccountMappingGet = useCallback(
    (params) => {
      queryHotelClientAccountMappingGet({ variables: params });
    },
    [queryHotelClientAccountMappingGet],
  );

  const ARMappingAccount = useCallback(
    (params) => {
      setARAccount('');

      mutationARAccount({
        variables: {
          ...params,
        },
      });
    },
    [queryHotelClientAccountMappingGet],
  );

  const sethotelClientAccountMappings = useCallback((params) => {
    sethotelClientAccountMappingsSet('');

    mutationARAccountSet({
      variables: {
        ...params,
      },
    });
  });

  return {
    hotelClientAccountMappingGet,
    hotelClientAccountMappings,
    ARMappingLoading,
    ARMappingAccount,
    hotelClientAccountMapping,
    hotelClientAccountMappingsSet,
    sethotelClientAccountMappings,
  };
};
