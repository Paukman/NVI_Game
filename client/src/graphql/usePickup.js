import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';

export const PICKUP_DEFAULT_REPORT_GET_QUERY = gql`
  query($params: PickupDefaultReportInput) {
    pickupDefaultReportGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        businessDate
        startDate
        endDate
        columnsCfg {
          title
          subColumns
        }
        sections {
          title
          startDate
          endDate
          missingDates
          items {
            date
            columnsData
          }
        }
      }
    }
  }
`;

export const usePickup = () => {
  const [pickupDefaultReport, setPickupDefaultReport] = useState({ data: [], ...buildErrors() });

  const [queryPickupDefaultReportGet, { loading: pickupDefaultReportLoading }] = useLazyQuery(
    PICKUP_DEFAULT_REPORT_GET_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.pickupDefaultReportGet || {};

        const data = Array.isArray(result.data) ? result.data : [];

        setPickupDefaultReport({
          data,
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying Pickup Default Report:', response);

        setPickupDefaultReport({
          data: [],
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying Pickup Default Report. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const pickupDefaultReportGet = useCallback(
    (params) => {
      queryPickupDefaultReportGet({ variables: { params } });
    },
    [queryPickupDefaultReportGet],
  );

  return {
    pickupDefaultReportGet,
    pickupDefaultReport,
    pickupDefaultReportLoading,
  };
};
