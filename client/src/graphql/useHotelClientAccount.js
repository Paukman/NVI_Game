import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const QUERY_HOTEL_CLIENT_ACCOUNT_LIST = gql`
  query ($params: HotelClientAccountFilter, $pagination: PaginationAndSortingInput) {
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

export const useHotelClientAccount = () => {
  const [MappedTo, setMappedTo] = useState({ data: [], code: null, errors: [] });

  const [queryHotelClientAccountList, { loading: loadingList }] = useLazyQuery(QUERY_HOTEL_CLIENT_ACCOUNT_LIST, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.hotelClientAccountList || [];

      setMappedTo(data);
    },
  });

  const hotelClientAccountList = useCallback(
    (params) => {
      const { pagination } = params;
      if (pagination) {
        queryHotelClientAccountList({
          variables: params,
        });
      }
    },
    [queryHotelClientAccountList],
  );

  return {
    hotelClientAccountList,
    loadingList,
    MappedTo,
  };
};
