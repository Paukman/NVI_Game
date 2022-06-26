import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { hotelUserQueries } from './queries/hotelUserQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useHotelUser = () => {
  const [hotelUserListState, setHotelUserListState] = useState({ data: null, errors: [] });

  const [queryHotelUserList, { loading: hotelUserListLoading }] = useLazyQuery(hotelUserQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.hotelUserList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setHotelUserListState({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching Hotel User List: ', ex);

        setHotelUserListState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching Hotel User List. Please try later`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching Hotel User List:', response);

      setHotelUserListState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching Hotel User List. Please try later`],
          },
        ],
      });
    },
  });

  const hotelUserList = useCallback(
    (params) => {
      setHotelUserListState({ data: null, errors: [] });
      queryHotelUserList({ variables: { params } });
    },
    [queryHotelUserList],
  );

  return {
    hotelUserList,
    hotelUserListState,
    hotelUserListLoading,
  };
};
