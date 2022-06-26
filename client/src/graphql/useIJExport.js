import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import { incomeJournalExportQuery } from './queries';
import { buildErrors } from '../utils/apiHelpers';
import logger from '../utils/logger';

export const useIJExport = () => {
  const [incomeJournalExportGet, setIncomeJournalGet] = useState({ data: {}, code: null, errors: [] });
  const [incomeJournalSyncAvailabilityResult, setIncomeJournalSyncAvailabilityResult] = useState({
    data: null,
    ...buildErrors(),
  });
  const [incomeJournalSyncResult, setIncomeJournalSyncResult] = useState({ data: null, ...buildErrors() });

  const [queryIJExportGet, { loading: IJExportGetLoading }] = useLazyQuery(incomeJournalExportQuery.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setIncomeJournalGet({
        data: {},
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying IJ Export Data. Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.incomeJournalExportGet || {};
        setIncomeJournalGet({
          data: Array.isArray(result.data) ? result.data[0] : {},
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: result.code ? result.code : null,
        });
      } catch (ex) {
        setIncomeJournalGet({
          data: {},

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for IJ Export Data. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [
    queryIncomeJournalSyncAvailability,
    { loading: incomeJournalSyncAvailabilityLoading, called: incomeJournalSyncAvailabilityCalled },
  ] = useLazyQuery(incomeJournalExportQuery.syncAvailability, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.incomeJournalSyncAvailability || {};

      const data = Array.isArray(result.data) ? result.data : [];
      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying income journal sync availability:', errors.errors);
      }

      setIncomeJournalSyncAvailabilityResult({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying income journal sync availability:', response);

      setIncomeJournalSyncAvailabilityResult({
        data: [],
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying income journal sync availability. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryIncomeJournalSync, { loading: incomeJournalSyncLoading, called: incomeJournalSyncCalled }] = useLazyQuery(
    incomeJournalExportQuery.sync,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.incomeJournalSync || {};

        const data = Array.isArray(result.data) ? result.data : [];
        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying income journal sync:', errors.errors);
        }

        setIncomeJournalSyncResult({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying income journal sync:', response);

        setIncomeJournalSyncResult({
          data: [],
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying income journal sync. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const getReportIJExport = useCallback(
    (params) => {
      queryIJExportGet({ variables: params });
    },
    [queryIJExportGet],
  );

  const incomeJournalSyncAvailability = useCallback(
    (params) => {
      queryIncomeJournalSyncAvailability({ variables: { params } });
    },
    [queryIncomeJournalSyncAvailability],
  );

  const incomeJournalSync = useCallback(
    (params) => {
      queryIncomeJournalSync({ variables: { params } });
    },
    [queryIncomeJournalSync],
  );

  return {
    IJExportGetLoading,
    incomeJournalExportGet,
    getReportIJExport,
    incomeJournalSyncAvailability,
    incomeJournalSyncAvailabilityLoading,
    incomeJournalSyncAvailabilityCalled,
    incomeJournalSyncAvailabilityResult,
    incomeJournalSync,
    incomeJournalSyncLoading,
    incomeJournalSyncCalled,
    incomeJournalSyncResult,
  };
};
