import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const IJ_REPORT_QUERY = gql`
  query($params: IncomeJournalSummaryInput) {
    incomeJournalSummaryGet(params: $params) {
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
        sections {
          title
          subtitle
          totalAmount
          totalAdjustment
          total
          items {
            id
            hmgGlCode
            description
            amount
            amountAdjustment
            total
            adjustmentNote {
              note
            }
            pmsType {
              id
              pmsTypeName
            }
            reportSource {
              id
              reportSourceName
            }
            canRemove
          }
        }
      }
    }
  }
`;
export const QUERY_IJ_SUMMARY_GET_LOCK = gql`
  query($params: IncomeJournalGetLockInput) {
    incomeJournalSummaryGetLock(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
      }
    }
  }
`;

export const MUTATION_IJ_SUMMARY_SET_LOCK = gql`
  mutation($params: IncomeJournalSetLockInput) {
    incomeJournalSummarySetLock(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
      }
    }
  }
`;

export const MUTATION_IJ_SET_ADJUSTMENT = gql`
  mutation($id: ID!, $params: IncomeJournalSummaryAdjustInput) {
    incomeJournalSummaryAdjust(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hmgGlCode
        description
        amount
        amountAdjustment
        total
        pmsCode
        adjustmentNote {
          note
        }
        pmsType {
          pmsTypeName
        }
      }
    }
  }
`;

export const ADD_IJ_ROW = gql`
  mutation($params: IncomeJournalSummaryAddInput) {
    incomeJournalSummaryAdd(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hmgGlCode
        description
        amount
        amountAdjustment
        total
        pmsCode
        adjustmentNote {
          note
        }
        pmsType {
          pmsTypeName
        }
      }
    }
  }
`;

export const DELETE_IJ_ROW = gql`
  mutation($id: ID!) {
    incomeJournalSummaryRemove(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
      }
    }
  }
`;

export const useIJeports = () => {
  const [incomeJournalSummaryReport, setIncomeJournalSummaryReport] = useState({ data: null, errors: [] });
  const [incomeJournalSummaryLock, setIncomeJournalSummaryLock] = useState({ data: [], errors: [] });

  const [incomeJournalSummaryAdjustment, setIncomeJournalSummaryAdjustment] = useState({
    data: [],
    errors: [],
  });
  const [incomeJournalAdd, setIncomeJournalAdd] = useState({
    data: null,
    errors: [],
  });

  const [incomeJournalDelete, setIncomeJournalDelete] = useState({
    data: null,
    errors: [],
  });

  const [queryIJReports, { loading: incomeJournalSummaryLoading }] = useLazyQuery(IJ_REPORT_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setIncomeJournalSummaryReport({
        data: {},
        errors: [{ name: '', messages: [`Something went wrong when querying P&L Monthly report. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.incomeJournalSummaryGet || {};
        setIncomeJournalSummaryReport({
          data: Array.isArray(result.data) ? result.data[0] : {},
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setIncomeJournalSummaryReport({
          data: {},
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for P&L Monthly Report. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [queryIncomeJournalSummaryGetLock, { loading: incomeJournalSummaryGetLockLoading }] = useLazyQuery(
    QUERY_IJ_SUMMARY_GET_LOCK,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setIncomeJournalSummaryLock({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong when querying Income Journal Summary Lock information. Please try later`,
              ],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalSummaryGetLock || {};

          setIncomeJournalSummaryLock({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalSummaryLock({
            data: {},
            items: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for Income Journal Summary Lock information. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationIncomeJournalSummarySetLock, { loading: incomeJournalSummarySetLockLoading }] = useMutation(
    MUTATION_IJ_SUMMARY_SET_LOCK,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalSummarySetLock || {};

          setIncomeJournalSummaryLock({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalSummaryLock({
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
  const [mutationIncomeJournalSummarySetAdjustment, { loading: incomeJournalSummaryAdjustmentLoading }] = useMutation(
    MUTATION_IJ_SET_ADJUSTMENT,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalMappingSetPmsType || {};

          const data = Array.isArray(result.data) ? result.data : [];

          const updatedItem = data[0] || null;

          if (updatedItem) {
            for (let idx = 0, len = incomeJournalMappingReport.items.length; idx < len; idx++) {
              const item = incomeJournalMappingReport.items[idx];

              if (item.id === updatedItem.id) {
                item.pmsType = updatedItem.pmsType;
                item.pmsTypeId = updatedItem.pmsType?.id ?? 0;
                item.pmsTypeName = updatedItem.pmsType?.pmsTypeName ?? '';
                break;
              }
            }
          }

          setIncomeJournalSummaryAdjustment({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalSummaryAdjustment({
            data: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Income Journal Mapping PMS Type. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationIncomeJournalSummaryAdd, { loading: incomeJournalSummaryAddLoading }] = useMutation(ADD_IJ_ROW, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.incomeJournalSummaryAdd || {};

        const data = Array.isArray(result.data) ? result.data : [];

        const updatedItem = data[0] || null;
        setIncomeJournalAdd({
          data: updatedItem,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setIncomeJournalAdd({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when setting Income Journal Mapping PMS Type. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [mutationIncomeJournalSummaryDelete, { loading: incomeJournalSummaryDeleteLoading }] = useMutation(
    DELETE_IJ_ROW,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalSummaryRemove || {};

          const data = Array.isArray(result.data) ? result.data : [];

          const updatedItem = data[0] || null;
          setIncomeJournalDelete({
            data: updatedItem,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalDelete({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Income Journal Mapping PMS Type. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const incomeJournalSummaryGet = useCallback(
    (params) => {
      queryIJReports({
        variables: { params },
      });
    },
    [queryIJReports],
  );
  const incomeJournalSummaryGetLock = useCallback(
    (params) => {
      queryIncomeJournalSummaryGetLock({
        variables: { params },
      });
    },
    [queryIncomeJournalSummaryGetLock],
  );

  const incomeJournalSummarySetLock = useCallback(
    (params) => {
      mutationIncomeJournalSummarySetLock({
        variables: { params },
      });
    },
    [mutationIncomeJournalSummarySetLock],
  );

  const incomeJournalSummarySetAdjustment = useCallback(
    (variables) => {
      setIncomeJournalSummaryAdjustment({ data: [], errors: [] });
      mutationIncomeJournalSummarySetAdjustment({ variables });
    },
    [mutationIncomeJournalSummarySetAdjustment],
  );

  const incomeJournalSummaryAdd = useCallback(
    (params) => {
      mutationIncomeJournalSummaryAdd({
        variables: { params },
      });
    },
    [mutationIncomeJournalSummaryAdd],
  );

  const incomeJournalSummaryDelete = useCallback(
    (params) => {
      mutationIncomeJournalSummaryDelete({
        variables: { id: params },
      });
    },
    [mutationIncomeJournalSummaryDelete],
  );

  return {
    incomeJournalSummaryGet,
    incomeJournalSummaryGetLock,
    incomeJournalSummarySetLock,
    incomeJournalSummarySetAdjustment,
    incomeJournalSummaryAdd,
    incomeJournalSummaryDelete,
    incomeJournalSummaryReport,
    incomeJournalSummaryLoading,
    incomeJournalSummaryLock,
    incomeJournalSummaryLockLoading: incomeJournalSummaryGetLockLoading || incomeJournalSummarySetLockLoading,
    isIncomeJournalSummaryLockSet: incomeJournalSummaryLock.data.length > 0,
    incomeJournalSummaryAdjustment,
    incomeJournalSummaryAdjustmentLoading,
    incomeJournalAdd,
    incomeJournalSummaryAddLoading,
    incomeJournalDelete,
    incomeJournalSummaryDeleteLoading,
  };
};
