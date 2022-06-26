import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { reportQueries } from './queries';
import { mapArrayBy } from 'mdo-react-components';

export const useReport = () => {
  const [reports, setReports] = useState({ data: [], ...buildErrors() });
  const [report, setReport] = useState({ data: null, ...buildErrors() });

  const [queryReportList, { loading: reportsLoading, called: reportListCalled }] = useLazyQuery(reportQueries.list, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.reportList || {};

      const data = Array.isArray(result.data) ? result.data : [];
      const reportByName = mapArrayBy(data, 'id');
      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying reports list:', errors.errors);
      }

      setReports({
        data,
        reportByName,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying reports list:', response);

      setReports({
        data: [],
        reportByName: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying reports list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryReportGet, { loading: reportGetLoading, called: reportGetCalled }] = useLazyQuery(reportQueries.get, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.reportGet || {};

      const data = Array.isArray(result.data) ? result.data[0] : {};

      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying report details:', errors.errors);
      }

      setReport({
        data,
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying report details:', response);

      setReport({
        data: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying report details. Please try later.`],
            },
          ],
        }),
      });
    },
  });

  const [queryReportGetMany, { loading: reportGetManyLoading, called: reportGetManyCalled }] = useLazyQuery(
    reportQueries.getMany,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.reportGet || {};

        const data = Array.isArray(result.data) ? result.data[0] : {};

        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying multiple reports:', errors.errors);
        }

        setReport({
          data,
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying multiple reports:', response);

        setReport({
          data: {},
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying multiple reports. Please try later.`],
              },
            ],
          }),
        });
      },
    },
  );

  const reportList = useCallback(
    (variables) => {
      queryReportList({ variables });
    },
    [queryReportList],
  );

  const reportGet = useCallback(
    (id) => {
      queryReportGet({ variables: { id } });
    },
    [queryReportGet],
  );

  const reportGetMany = useCallback(
    (id) => {
      queryReportGetMany({ variables: { id } });
    },
    [queryReportGetMany],
  );

  return {
    reportList,
    reportGet,
    reportGetMany,
    reports,
    report,
    reportsLoading,
    reportGetLoading,
    reportGetManyLoading,
    reportListCalled,
    reportGetCalled,
    reportGetManyCalled,
  };
};
