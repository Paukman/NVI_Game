import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';

export const SALES_PRODUCTION_REPORT_GET_QUERY = gql`
query($params: SalesProductionReportInput) {
    salesProductionReportGet(params: $params) {
       code
       errors {
         name
         messages
       }
       data {
               hotelId
         period
         date
         startDate
         endDate
         compareTo
         total
         columnCfg{
           year
         }
         sections{
           total
           salesManager{
             id
             firstName
             lastName
           }
           columnsData
           items{
               hotelClientAccount{
               id
               accountName
             }
               total
               columnsData
             items{
              hotel{
                hotelName
              }
                   total
               columnsData
             }
           }
         }
       }
     }
   } 
`;

export const useSalesProduction = () => {
  const [salesProductionReport, setSalesProductionReport] = useState({ data: [], ...buildErrors() });

  const [querySalesProductionReportGet, { loading: salesProductionReportLoading }] = useLazyQuery(
    SALES_PRODUCTION_REPORT_GET_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.salesProductionReportGet || {};

        const data = Array.isArray(result.data) ? result.data : [];

        setSalesProductionReport({
          data,
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying Sales Production Report:', response);

        setSalesProductionReport({
          data: [],
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying Sales Production Report. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const salesProductionReportGet = useCallback(
    (params) => {
      querySalesProductionReportGet({ variables: { params } });
    },
    [querySalesProductionReportGet],
  );

  return {
    salesProductionReportGet,
    salesProductionReport,
    salesProductionReportLoading,
  };
};
