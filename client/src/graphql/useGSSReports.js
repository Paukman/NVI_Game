import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import { buildErrors } from '../utils/apiHelpers';
import logger from '../utils/logger';

export const QUERY_GSS_HOTEL_PRIORITY_LIST = gql`
  query ($params: GSSHotelPriorityFilter, $pagination: PaginationAndSortingInput) {
    gssHotelPriorityList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        priority
        priorityName
      }
    }
  }
`;

export const QUERY_GSS_DESCRIPTION_LIST = gql`
  query ($params: GssDescriptionFilter, $pagination: PaginationAndSortingInput) {
    gssDescriptionList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        description
        category {
          name
        }
      }
    }
  }
`;

export const QUERY_LIST_GSS_MEDALLIA_REPORT = gql`
  query ($params: MedalliaReportInput) {
    gssMedalliaReportGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        columnsCfg {
          name
        }
        sections {
          categoryId
          category {
            name
          }
          items {
            id
            description
            priority
            permissions
            columnsData
          }
        }
      }
    }
  }
`;

export const QUERY_GSS_MEDALLIA_PRIORITY_SET = gql`
  mutation ($params: MedalliaPrioritySetInput) {
    gssMedalliaPrioritySet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        priority
      }
    }
  }
`;

export const QUERY_LIST_GSS_MEDALLIA_PRIORITY = gql`
  query ($params: MedalliaPriorityListInput) {
    gssMedalliaPriorityList(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        priorities
      }
    }
  }
`;

export const GSS_BY_PRIORITY_REPORT_GET_QUERY = gql`
  query ($params: GssPriorityReportInput) {
    gssByPriorityReportGet(params: $params) {
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
        columnsCfg {
          name
          priority
          compareToFieldName
          varianceFieldName
          variancePercentageFieldName
        }
        items {
          hotel {
            id
            hotelName
          }
          permissions
          sampleSize
          columnsData {
            priorityName
            priorityValue
            valueCompareTo
            valueVariance
            valueVariancePercentage
          }
        }
      }
    }
  }
`;

export const GSS_PRIORITY_LIST_QUERY = gql`
  query ($params: GSSPriorityFilter, $pagination: PaginationAndSortingInput) {
    gssPriortyList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        priority
        priorityName
      }
    }
  }
`;

// TODO: Update the query as soon as API is ready
export const GSS_BY_MONTH_REPORT_GET_QUERY = gql`
  query ($params: GssByMonthReportInput) {
    gssByMonthReportGet(params: $params) {
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
        columnsCfg {
          title
          date
          compareToFieldName
          varianceFieldName
          variancePercentageFieldName
        }
        items {
          hotel {
            id
            hotelName
          }
          hasNoData
          priority1Description
          permissions
          sampleSize
          total
          benchmark
          variance
          columnsData {
            value
            valueCompareTo
            valueVariance
            valueVariancePercentage
          }
        }
      }
    }
  }
`;

export const GSS_PRIORITY_NAME_SET_QUERY = gql`
  mutation ($params: [GSSPriorityInput]) {
    gssPriorityNameSet(params: $params) {
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

export const GSS_BRAND_LIST_QUERY = gql`
  query ($params: BrandFilter, $pagination: PaginationAndSortingInput) {
    brandList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        brandName
      }
    }
  }
`;

export const useGSSReports = () => {
  const [gssMedalliaReportGet, setGssMedalliaReportGet] = useState({ type: '', data: [], errors: [] });
  const [gssMedalliaPriorityList, setgssMedalliaPriorityList] = useState({ type: '', data: [], errors: [] });
  const [gssMedalliaPrioritySet, setgssMedalliaPrioritySet] = useState('');
  const [gssPriorityReport, setGssPriorityReport] = useState({ data: [], ...buildErrors() });
  const [gssByMonthReport, setGssByMonthReport] = useState({ data: [], ...buildErrors() });
  const [gssPriortyList, setgssPriortyList] = useState({ type: '', data: [], errors: [] });
  const [gssPriorityNameSet, setgssPriorityNameSet] = useState('');
  const [gssHotelPriorities, setGssHotelPriorities] = useState({ data: [], ...buildErrors() });
  const [gssDescriptionList, setgssDescriptionList] = useState({ data: [], errors: [] });
  const [gssBrandList, setgssBrandList] = useState({ data: [], ...buildErrors() });

  const [querygssMedalliaReportGet, { loading: loadingGssList }] = useLazyQuery(QUERY_LIST_GSS_MEDALLIA_REPORT, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.gssMedalliaReportGet.data || [];
      if (newData.gssMedalliaReportGet.errors?.length) {
        setGssMedalliaReportGet({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for GSS Medallia Report. Please try later`,
              ],
            },
          ],
        });
      } else {
        setGssMedalliaReportGet({ data: data, errors: [] });
      }
    },
    onError: (err) => {
      setGssMedalliaReportGet({
        data: [],
        errors: [
          {
            name: '',
            messages: [
              `Something went wrong as there is no response from the server for GSS Medallia Report. Please try later`,
            ],
          },
        ],
      });
    },
  });

  const [querygssDescriptionList, { loading: loadinggssDescriptionList }] = useLazyQuery(QUERY_GSS_DESCRIPTION_LIST, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.gssDescriptionList.data || [];

      setgssDescriptionList({ data: data, errors: [] });
    },
    onError: (err) => {
      setgssDescriptionList({
        data: [],
        errors: [
          {
            name: '',
            messages: [
              `Something went wrong as there is no response from the server for GSS Description List. Please try later`,
            ],
          },
        ],
      });
    },
  });

  const [querygssPriortyList, { loading }] = useLazyQuery(GSS_PRIORITY_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.gssPriortyList.data || [];

      setgssPriortyList({ data: data, errors: [] });
    },
    onError: (err) => {
      setgssPriortyList({
        data: [],
        errors: [
          {
            name: '',
            messages: [
              `Something went wrong as there is no response from the server for GSS Medallia Report. Please try later`,
            ],
          },
        ],
      });
    },
  });

  const [querygssBrandList, { loading: loadingBrandList }] = useLazyQuery(GSS_BRAND_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const data = newData.brandList.data || [];

      setgssBrandList({ data: data, errors: [] });
    },
    onError: (err) => {
      setgssBrandList({
        data: [],
        errors: [
          {
            name: '',
            messages: [
              `Something went wrong as there is no response from the server for GSS Brand Hotels. Please try later`,
            ],
          },
        ],
      });
    },
  });

  const [querygssMedalliaPriorityList, { loading: loadinggssMedalliaPriorityList }] = useLazyQuery(
    QUERY_LIST_GSS_MEDALLIA_PRIORITY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (newData) => {
        const data = newData.gssMedalliaPriorityList.data || [];

        setgssMedalliaPriorityList({ data: data, errors: [] });
      },
      onError: (err) => {
        setgssMedalliaPriorityList({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for GSS Medallia Report. Please try later`,
              ],
            },
          ],
        });
      },
    },
  );

  const [mutationgssMedalliaPrioritySet, { loading: loadingCreate }] = useMutation(QUERY_GSS_MEDALLIA_PRIORITY_SET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setgssMedalliaPrioritySet('error');
    },
    onCompleted: (response) => {
      try {
        const result = response.gssMedalliaPrioritySet || {};

        setgssMedalliaPrioritySet(result.code == -1000 ? result?.errors[0]?.messages[0] : 'done');
      } catch (ex) {
        setgssMedalliaPrioritySet('error');
      }
    },
  });

  const [queryGssPriorityReport, { loading: gssPriorityReportLoading }] = useLazyQuery(
    GSS_BY_PRIORITY_REPORT_GET_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.gssByPriorityReportGet || {};

        const data = Array.isArray(result.data) ? result.data : [];

        setGssPriorityReport({
          data,
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying GSS By Priority Report:', response);

        setGssPriorityReport({
          data: [],
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying GSS By Priority Report. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [queryGssByMonthReport, { loading: gssByMonthReportLoading }] = useLazyQuery(GSS_BY_MONTH_REPORT_GET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      // TODO: Update the code as soon as API is ready
      const result = response?.gssByMonthReportGet || {};

      const data = Array.isArray(result.data) ? result.data : [];

      setGssByMonthReport({
        data,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying GSS By Month Report:', response);

      setGssByMonthReport({
        data: [],
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying GSS By Month Report. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationgssPriortyCreateUpdate, { loading3 }] = useMutation(GSS_PRIORITY_NAME_SET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      setgssPriorityNameSet('done');
    },

    onError: (response) => {
      setgssPriorityNameSet('error');
    },
  });

  const [queryGssHotelPriorityList, { loading: loadingGssHotelPriorityList }] = useLazyQuery(
    QUERY_GSS_HOTEL_PRIORITY_LIST,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response.gssHotelPriorityList || {};

        setGssHotelPriorities({
          data: result.data,
          ...buildErrors(result),
        });
      },
      onError: (err) => {
        setGssHotelPriorities({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong when requesting a list of assigned priorities in GSS Medallia report for hotel and year. Please try later`,
              ],
            },
          ],
        });
      },
    },
  );

  const listGssMedalliaReportGet = useCallback(
    (params) => {
      querygssMedalliaReportGet({ variables: params });
    },
    [querygssMedalliaReportGet],
  );
  const listquerygssPriortyList = useCallback(
    (params) => {
      querygssPriortyList({ variables: params });
    },
    [querygssPriortyList],
  );

  const listQueryGssDescriptionList = useCallback(
    (params) => {
      querygssDescriptionList({ variables: { params } });
    },
    [querygssDescriptionList],
  );
  const listquerygssBrandList = useCallback(
    (params) => {
      querygssBrandList({ variables: params });
    },
    [querygssBrandList],
  );

  const listgssMedalliaPriorityList = useCallback(
    (params) => {
      querygssMedalliaPriorityList({ variables: params });
    },
    [querygssMedalliaPriorityList],
  );

  const listgssMedalliaPrioritySet = useCallback(
    (params) => {
      setgssMedalliaPrioritySet('');
      mutationgssMedalliaPrioritySet({ variables: params });
    },
    [mutationgssMedalliaPrioritySet],
  );

  const listgssPriortyCreateUpdate = useCallback(
    (params) => {
      setgssPriorityNameSet('');
      mutationgssPriortyCreateUpdate({ variables: params });
    },
    [mutationgssPriortyCreateUpdate],
  );

  const gssHotelPriorityList = useCallback(
    (params) => {
      queryGssHotelPriorityList({ variables: params });
    },
    [queryGssHotelPriorityList],
  );

  const gssByPriorityReportGet = useCallback(
    (params) => {
      queryGssPriorityReport({ variables: { params } });
    },
    [queryGssPriorityReport],
  );

  const gssByMonthReportGet = useCallback(
    (params) => {
      queryGssByMonthReport({ variables: { params } });
    },
    [queryGssByMonthReport],
  );

  return {
    listGssMedalliaReportGet,
    gssMedalliaReportGet,
    loadingGssList,
    listgssMedalliaPriorityList,
    gssMedalliaPriorityList,
    listgssMedalliaPrioritySet,
    gssMedalliaPrioritySet,
    gssByPriorityReportGet,
    gssPriorityReport,
    gssPriorityReportLoading,
    gssByMonthReportGet,
    gssByMonthReport,
    gssByMonthReportLoading,
    listquerygssPriortyList,
    gssPriortyList,
    gssPriorityNameSet,
    listgssPriortyCreateUpdate,
    gssHotelPriorityList,
    gssHotelPriorities,
    loadingGssHotelPriorityList,
    listQueryGssDescriptionList,
    gssDescriptionList,
    listquerygssBrandList,
    gssBrandList,
  };
};
