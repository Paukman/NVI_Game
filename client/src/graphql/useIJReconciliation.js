import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const IJ_RECONCILIATION_REPORT = gql`
query($params:IncomeJournalReconciliationInput) {
  incomeJournalReconciliationGet(params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      hotelId
      date
      period
      startDate
      endDate
      latestComment{
        note
      }
      sections{
        header
        footer
        totalAmount
        totalDeposit
        totalShortage
        glCode
        total
        items {
          id
          description
          amount
          hmgGlCode
          deposit
          shortage
          ijReconciliationNote{
            note
          }
        }
      }
    }
  }
}

`;

export const IJ_RECONCILIATION_SET = gql`
  mutation($params: IncomeJournalReconciliationInput) {
    incomeJournalReconciliationSet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
      }
    }
  }
`;

export const useIJReconciliation = () => {
  const [reportIJReconciliationGet, setReportIJReconciliationGet] = useState({ data: {}, code: null, errors: [] });
  const [incomeJournalReconciliationSet, setincomeJournalReconciliationSet] = useState({
    data: {},
    code: null,
    errors: [],
  });
  const [queryReportIJReconciliationGet, { loading: reportIJReconciliationGetLoading }] = useLazyQuery(
    IJ_RECONCILIATION_REPORT,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setReportIJReconciliationGet({
          data: {},
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying IJ Reconciliation Report. Please try later`],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalReconciliationGet || {};
          setReportIJReconciliationGet({
            data: Array.isArray(result.data) ? result.data[0] : {},
            errors: Array.isArray(result.errors) ? result.errors : [],
            code: result.code ? result.code : null,
          });
        } catch (ex) {
          setReportIJReconciliationGet({
            data: {},

            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for IJ Reconciliation Report. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationincomeJournalReconciliationSet, { loading: incomeJournalReconciliationSetLoading }] = useMutation(
    IJ_RECONCILIATION_SET,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalReconciliationSet || {};

          setincomeJournalReconciliationSet({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setincomeJournalReconciliationSet({
            data: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Income Journal Summary Lock. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const getReportIJReconciliation = useCallback(
    (params) => {
      queryReportIJReconciliationGet({ variables: params });
    },
    [queryReportIJReconciliationGet],
  );

  const incomeJournalReconciliationSetValue = useCallback(
    (params) => {
      mutationincomeJournalReconciliationSet({
        variables: { params },
      });
    },
    [mutationincomeJournalReconciliationSet],
  );

  return {
    reportIJReconciliationGetLoading,
    getReportIJReconciliation,
    reportIJReconciliationGet,
    incomeJournalReconciliationSetValue,
    incomeJournalReconciliationSet
  };
};
