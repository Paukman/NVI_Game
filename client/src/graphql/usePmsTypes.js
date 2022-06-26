import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const LIST_PMS_TYPES_QUERY = gql`
  query($params: PmsTypeFilter, $pagination: PaginationAndSortingInput) {
    pmsTypeList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        pmsTypeName
        pmsTypeStatusId
      }
    }
  }
`;

export const usePmsTypes = () => {
  const [pmsTypes, setPmsTypes] = useState([]);

  const [queryListPmsTypes, { loading: loadingList }] = useLazyQuery(LIST_PMS_TYPES_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = (newData.pmsTypeList.data || []).map((item) => {
        return {
          ...item,
          id: Number(item.id),
        };
      });

      setPmsTypes(data);
    },
  });

  const listPmsTypes = useCallback(
    (params) => {
      queryListPmsTypes({ variables: params });
    },
    [queryListPmsTypes],
  );

  return {
    listPmsTypes,
    loadingList,
    pmsTypes,
  };
};
