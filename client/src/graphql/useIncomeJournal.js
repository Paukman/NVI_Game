import { useCallback, useState } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const QUERY_IJ_MAPPING_REPORT = gql`
  query ($params: IncomeJournalMappingInput) {
    incomeJournalMappingGet(params: $params) {
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
        items {
          id
          description
          amount
          hmgGlCode
          pmsCode
          pmsType {
            id
            pmsTypeName
          }
          reportSource {
            id
            reportSourceName
          }
        }
      }
    }
  }
`;

export const QUERY_IJ_MAPPING_GET_LOCK = gql`
  query ($params: IncomeJournalGetLockInput) {
    incomeJournalMappingGetLock(params: $params) {
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

export const MUTATION_IJ_MAPPING_SET_LOCK = gql`
  mutation ($params: IncomeJournalSetLockInput) {
    incomeJournalMappingSetLock(params: $params) {
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

export const MUTATION_IJ_SET_PMS_TYPE = gql`
  mutation ($params: IncomeJournalMappingSetPmsTypeInput) {
    incomeJournalMappingSetPmsType(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        description
        amount
        amountAdjustment
        total
        hmgGlCode
        pmsCode
        pmsType {
          id
          pmsTypeName
        }
        reportSource {
          id
          reportSourceName
        }
      }
    }
  }
`;

export const MUTATION_IJ_SET_GL_CODE = gql`
  mutation ($params: IncomeJournalMappingSetGlCodeInput) {
    incomeJournalMappingSetGlCode(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        description
        amount
        hmgGlCode
        pmsCode
        pmsType {
          id
          pmsTypeName
        }
        reportSource {
          id
          reportSourceName
        }
      }
    }
  }
`;

export const useIncomeJournal = () => {
  const [incomeJournalMappingReport, setIncomeJournalMappingReport] = useState({ data: {}, items: [], errors: [] });
  const [incomeJournalMappingLock, setIncomeJournalMappingLock] = useState({ data: [], errors: [] });

  const [incomeJournalMappingPmsType, setIncomeJournalMappingPmsType] = useState({ data: [], errors: [] });
  const [incomeJournalMappingGlCode, setIncomeJournalMappingGlCode] = useState({ data: [], errors: [] });

  const [queryIncomeJournalMappingGet, { loading: incomeJournalMappingLoading }] = useLazyQuery(
    QUERY_IJ_MAPPING_REPORT,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setIncomeJournalMappingReport({
          data: {},
          items: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying Income Journal Mapping report. Please try later`],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalMappingGet || {};

          const data = Array.isArray(result.data) ? result.data[0] : {};

          const items = Array.isArray(data.items) ? data.items : [];

          setIncomeJournalMappingReport({
            data,
            items: items.map((item) => {
              return {
                ...item,
                reportSourceId: item.reportSource?.id || null,
                reportSourceName: item.reportSource?.reportSourceName || '',
                pmsTypeId: item.pmsType?.id || null,
                pmsTypeName: item.pmsType?.pmsTypeName || '',
              };
            }),
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalMappingReport({
            data: {},
            items: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for Income Journal Mapping Report. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [queryIncomeJournalMappingGetLock, { loading: incomeJournalMappingGetLockLoading }] = useLazyQuery(
    QUERY_IJ_MAPPING_GET_LOCK,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setIncomeJournalMappingLock({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong when querying Income Journal Mapping Lock information. Please try later`,
              ],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalMappingGetLock || {};

          setIncomeJournalMappingLock({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalMappingLock({
            data: {},
            items: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for Income Journal Mapping Lock information. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationIncomeJournalMappingSetLock, { loading: incomeJournalMappingSetLockLoading }] = useMutation(
    MUTATION_IJ_MAPPING_SET_LOCK,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalMappingSetLock || {};

          setIncomeJournalMappingLock({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalMappingLock({
            data: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Income Journal Mapping Lock. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationIncomeJournalMappingSetPmsType, { loading: incomeJournalMappingPmsTypeLoading }] = useMutation(
    MUTATION_IJ_SET_PMS_TYPE,
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
                item.amount = updatedItem.amount;
                item.pmsType = updatedItem.pmsType;
                item.pmsTypeId = updatedItem.pmsType?.id ?? 0;
                item.pmsTypeName = updatedItem.pmsType?.pmsTypeName ?? '';
                break;
              }
            }
          }

          setIncomeJournalMappingPmsType({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalMappingPmsType({
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

  const [mutationIncomeJournalMappingSetGLCode, { loading: incomeJournalMappingGLCodeLoading }] = useMutation(
    MUTATION_IJ_SET_GL_CODE,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.incomeJournalMappingSetGlCode || {};

          const data = Array.isArray(result.data) ? result.data : [];

          const updatedItem = data[0] || null;

          if (updatedItem) {
            for (let idx = 0, len = incomeJournalMappingReport.items.length; idx < len; idx++) {
              const item = incomeJournalMappingReport.items[idx];

              if (item.id === updatedItem.id) {
                item.hmgGlCode = updatedItem.hmgGlCode;
                break;
              }
            }
          }

          setIncomeJournalMappingGlCode({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setIncomeJournalMappingGlCode({
            data: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Income Journal Mapping GL Code. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const incomeJournalMappingGet = useCallback(
    (params) => {
      setIncomeJournalMappingReport({
        data: {},
        items: [],
        errors: [],
      });

      queryIncomeJournalMappingGet({
        variables: { params },
      });
    },
    [queryIncomeJournalMappingGet],
  );

  const incomeJournalMappingGetLock = useCallback(
    (params) => {
      queryIncomeJournalMappingGetLock({
        variables: { params },
      });
    },
    [queryIncomeJournalMappingGetLock],
  );

  const incomeJournalMappingSetLock = useCallback(
    (params) => {
      mutationIncomeJournalMappingSetLock({
        variables: { params },
      });
    },
    [mutationIncomeJournalMappingSetLock],
  );

  const incomeJournalMappingSetPmsType = useCallback(
    (variables) => {
      setIncomeJournalMappingPmsType({ data: [], errors: [] });
      mutationIncomeJournalMappingSetPmsType({ variables });
    },
    [mutationIncomeJournalMappingSetPmsType],
  );

  const incomeJournalMappingSetGlCode = useCallback(
    (variables) => {
      setIncomeJournalMappingGlCode({ data: [], errors: [] });
      mutationIncomeJournalMappingSetGLCode({ variables });
    },
    [mutationIncomeJournalMappingSetGLCode],
  );

  return {
    incomeJournalMappingGet,
    incomeJournalMappingGetLock,
    incomeJournalMappingSetLock,
    incomeJournalMappingSetPmsType,
    incomeJournalMappingSetGlCode,
    incomeJournalMappingReport,
    incomeJournalMappingLoading,
    incomeJournalMappingLock,
    incomeJournalMappingLockLoading: incomeJournalMappingGetLockLoading || incomeJournalMappingSetLockLoading,
    isIncomeJournalMappingLockSet: incomeJournalMappingLock.data.length > 0,
    incomeJournalMappingGlCode,
    incomeJournalMappingGLCodeLoading,
    incomeJournalMappingPmsType,
    incomeJournalMappingPmsTypeLoading,
  };
};
