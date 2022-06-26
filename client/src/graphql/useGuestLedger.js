import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { guestLedgerQueries } from './queries/guestLedgerQueries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useGuestLedger = () => {
  const [guestLedgerListGetByHotelCodeState, setGuestLedgerListGetByHotelCodeState] = useState({
    data: null,
    errors: [],
  });
  const [guestLedgerListGetFiltersByHotelCodeState, setGuestLedgerListGetFiltersByHotelCodeState] = useState({
    data: null,
    errors: [],
  });

  const [queryGuestLedgerListGetByHotelCode, { loading: guestLedgerListGetByHotelCodeLoading }] = useLazyQuery(
    guestLedgerQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.guestLedgerListGetByHotelCode || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setGuestLedgerListGetByHotelCodeState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when fetching Guest Ledger List: ', ex);

          setGuestLedgerListGetByHotelCodeState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when fetching Guest Ledger List. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Guest Ledger List:', response);

        setGuestLedgerListGetByHotelCodeState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Guest Ledger List. Please try later`],
            },
          ],
        });
      },
    },
  );

  const [queryGuestLedgerListGetFiltersByHotelCode, { loading: guestLedgerListGetFiltersByHotelCodeLoading }] =
    useLazyQuery(guestLedgerQueries.getFilters, {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.guestLedgerListGetFiltersByHotelCode || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setGuestLedgerListGetFiltersByHotelCodeState({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when fetching Guest Ledger List: ', ex);

          setGuestLedgerListGetFiltersByHotelCodeState({
            data: [],
            errors: [{ name: '', message: [`Something went wrong when fetching Guest Ledger List. Please try later`] }],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Guest Ledger List:', response);

        setGuestLedgerListGetFiltersByHotelCodeState({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Guest Ledger List. Please try later`],
            },
          ],
        });
      },
    });

  const guestLedgerListGetByHotelCode = useCallback(
    (params, pagination) => {
      setGuestLedgerListGetByHotelCodeState({ data: null, errors: [] });
      queryGuestLedgerListGetByHotelCode({ variables: { params, pagination } });
    },
    [queryGuestLedgerListGetByHotelCode],
  );

  const guestLedgerListGetFiltersByHotelCode = useCallback(
    (params, pagination) => {
      setGuestLedgerListGetFiltersByHotelCodeState({ data: null, errors: [] });
      queryGuestLedgerListGetFiltersByHotelCode({ variables: { params, pagination } });
    },
    [queryGuestLedgerListGetFiltersByHotelCode],
  );

  return {
    guestLedgerListGetByHotelCode,
    guestLedgerListGetByHotelCodeState,
    guestLedgerListGetByHotelCodeLoading,

    guestLedgerListGetFiltersByHotelCode,
    guestLedgerListGetFiltersByHotelCodeState,
    guestLedgerListGetFiltersByHotelCodeLoading,
  };
};
