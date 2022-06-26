import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import { buildErrors } from '../utils/apiHelpers';
import logger from 'utils/logger';

import cache from '../cache';

const forecastNumbersCacheKey = 'pnlReportGetForecastNumbers';
const monthlyCacheKey = 'pnlReportGetMonthly';
const yearlyCacheKey = 'pnlReportGetAnnual';
const comparisonCacheKey = 'pnlReportGetPropertyComparison';

export const PNL_MONTHLY_REPORT_QUERY = gql`
  query ($params: PnLReportMonthlyInput!) {
    pnlReportGetMonthly(params: $params) {
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
        kpi
        columnsCfg {
          title
          dataType
          year
          forecastNumber
          items {
            title
            field
          }
        }
        sections {
          header
          footer
          columnsData {
            value
            kpiValue
          }
          items {
            id
            parentId
            valueType
            name
            glCode
            columnsData {
              value
              kpiValue
            }
          }
        }
      }
    }
  }
`;

export const PNL_ANNUAL_REPORT_QUERY = gql`
  query ($params: PnLReportAnnualInput!) {
    pnlReportGetAnnual(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        year
        startDate
        endDate
        dataType {
          dataType
          year
          forecastNumber
        }
        compareTo {
          dataType
          year
          forecastNumber
        }
        columnsCfg {
          title
          dataType
          date
          forecastNumber
          items {
            title
            field
          }
        }
        sections {
          header
          footer
          columnsData {
            value
            kpiValue
          }
          items {
            id
            parentId
            valueType
            name
            glCode
            columnsData {
              year
              month
              value
            }
          }
        }
      }
    }
  }
`;

export const PNL_PROPERTY_COMPARISON_REPORT_QUERY = gql`
  query ($params: PnLReportPropertyComparisonInput!) {
    pnlReportGetPropertyComparison(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        startDate
        endDate
        dataType {
          dataType
          year
          forecastNumber
        }
        compareTo {
          dataType
          year
          forecastNumber
        }
        columnsCfg {
          title
          hotelId
          hotel {
            hotelName
          }
          dataType
          forecastNumber
          items {
            title
            field
          }
        }
        sections {
          header
          footer
          columnsData {
            value
          }
          items {
            id
            parentId
            valueType
            name
            glCode
            columnsData {
              year
              month
              value
            }
          }
        }
      }
    }
  }
`;

export const PNL_REPORT_GET_MIN_MAX_DATES_QUERY = gql`
  query ($hotelId: ID!) {
    pnlReportGetMinMaxDates(hotelId: $hotelId) {
      code
      errors {
        name
        messages
      }
      data {
        minDate
        maxDate
      }
    }
  }
`;

export const PNL_REPORT_GET_FORECAST_NUMBERS_QUERY = gql`
  query ($params: PnLReportBudgetForecastNumbersInput!) {
    pnlReportGetForecastNumbers(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        year
        numbers
      }
    }
  }
`;

export const PNL_REPORT_GET_BUDGET_NUMBERS_QUERY = gql`
  query ($params: PnLReportBudgetForecastNumbersInput!) {
    pnlReportGetBudgetNumbers(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        year
        numbers
      }
    }
  }
`;

export const PNL_GET_UNMAPPED_REPORT = gql`
  query ($params: PnLReportUnmappedInput) {
    pnlReportGetUnmapped(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        year
        startDate
        endDate
        hmgGlCodeStatus
        items {
          hmgGlCode
          description
          hmgGlCodeStatus
          months {
            date
            value
          }
        }
      }
    }
  }
`;

export const usePnlReports = () => {
  const [pnlMonthlyReport, setPnlMonthlyReport] = useState({ data: null, errors: [] });
  const [pnlAnnualReport, setPnlAnnualReport] = useState({ data: null, errors: [] });
  const [pnlReportPropertyComparison, setPnlReportPropertyComparison] = useState({ data: null, ...buildErrors() });
  const [pnlDatesRange, setPnLDatesRange] = useState({ data: { minDate: '', maxDate: '' }, errors: [] });
  const [pnlForecastNumbers, setForecastNumbers] = useState({ years: {}, ...buildErrors() });
  const [pnlBudgetNumbers, setBudgetNumbers] = useState({ years: {}, ...buildErrors() });
  const [forecastNumberParameters, setForecastNumberParameters] = useState(null);
  const [monthlyParameters, setMonthlyParameters] = useState(null);
  const [yearlyParameters, setYearlyParameters] = useState(null);
  const [comparisonParameters, setComparisonParameters] = useState(null);
  const [pnlUnmappedReport, setPnlUnmappedReport] = useState({ data: null, errors: [] });

  const [queryPnlMonthlyReports, { loading: loadingMonthlyReport }] = useLazyQuery(PNL_MONTHLY_REPORT_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setPnlMonthlyReport({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying P&L Monthly report. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.pnlReportGetMonthly || {};

        const preparedData = {
          data: Array.isArray(result.data) ? result.data[0] : {},
          errors: Array.isArray(result.errors) ? result.errors : [],
        };
        cache.set(monthlyCacheKey + JSON.stringify(monthlyParameters), preparedData);
        setPnlMonthlyReport(preparedData);
      } catch (ex) {
        setPnlMonthlyReport({
          data: [],
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

  const [queryPnlAnnualReports, { loading: loadingAnnualReport }] = useLazyQuery(PNL_ANNUAL_REPORT_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setPnlAnnualReport({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying P&L Annual report. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.pnlReportGetAnnual || {};
        const preparedData = {
          data: Array.isArray(result.data) ? result.data[0] : {},
          errors: Array.isArray(result.errors) ? result.errors : [],
        };
        cache.set(yearlyCacheKey + JSON.stringify(yearlyParameters), preparedData);
        setPnlAnnualReport(preparedData);
      } catch (ex) {
        setPnlAnnualReport({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for P&L Annual Report. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [queryPnlReportPropertyComparison, { loading: loadingPnLReportPropertyComparison }] = useLazyQuery(
    PNL_PROPERTY_COMPARISON_REPORT_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setPnlReportPropertyComparison({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying P&L Property Comparison Repoert. Please try later`],
              },
            ],
          }),
        });
      },
      onCompleted: (response) => {
        const result = response?.pnlReportGetPropertyComparison || {};

        const preparedData = {
          data: Array.isArray(result.data) ? result.data[0] : {},
          ...buildErrors(result),
        };
        cache.set(comparisonCacheKey + JSON.stringify(comparisonParameters), preparedData);
        setPnlReportPropertyComparison(preparedData);
      },
    },
  );

  const [queryPnlReportGetMinMaxDates, { loading: loadingDatesRange }] = useLazyQuery(
    PNL_REPORT_GET_MIN_MAX_DATES_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setPnLDatesRange({
          data: [],
          errors: [
            { name: '', messages: [`Something went wrong when querying dates range for P&L Report. Please try later`] },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.pnlReportGetMinMaxDates || {};

          setPnLDatesRange({
            data: Array.isArray(result.data) ? result.data[0] : { minDate: null, maxDate: null },
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setPnLDatesRange({
            data: { minDate: null, maxDate: null },
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for dates range for P&L Report. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [queryPnlReportGetForecastNumbers, { loading: pnlReportGetForecastNumbersLoading }] = useLazyQuery(
    PNL_REPORT_GET_FORECAST_NUMBERS_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.pnlReportGetForecastNumbers || {};

        const data = Array.isArray(result.data) ? result.data : [];

        const preparedData = {
          years: data.reduce((acc, item) => {
            acc[item.year] = item.numbers;
            return acc;
          }, {}),
          ...buildErrors(result),
        };
        cache.set(forecastNumbersCacheKey + JSON.stringify(forecastNumberParameters), preparedData);
        setForecastNumbers(preparedData);
      },
      onError: (response) => {
        logger.error('Something went wrong when querying P&L forecast numbers:', response);

        setForecastNumbers({
          data: {},
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying P&L forecast numbers. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [queryPnlReportGetBudgetNumbers, { loading: pnlReportGetBudgetNumbersLoading }] = useLazyQuery(
    PNL_REPORT_GET_BUDGET_NUMBERS_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.pnlReportGetBudgetNumbers || {};

        const data = Array.isArray(result.data) ? result.data : [];

        setBudgetNumbers({
          years: data.reduce((acc, item) => {
            acc[item.year] = item.numbers;
            return acc;
          }, {}),
          ...buildErrors(result),
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying P&L budget numbers:', response);

        setBudgetNumbers({
          data: {},
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying P&L budget numbers. Please try later`],
              },
            ],
          }),
        });
      },
    },
  );

  const [queryPnlUnmappedReport, { loading: pnlUnmappedReportLoading }] = useLazyQuery(PNL_GET_UNMAPPED_REPORT, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.pnlReportGetUnmapped || {};
        const data = Array.isArray(result.data) ? result.data[0] : {};

        setPnlUnmappedReport({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching P&L Unmapped Report list:', ex);

        setPnlUnmappedReport({
          data: [],
          errors: [
            { name: '', message: [`Something went wrong when fetching P&L Unmapped Report list. Please try later`] },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching P&L Unmapped Report list:', response);

      setPnlUnmappedReport({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching P&L Unmapped Report list. Please try later`],
          },
        ],
      });
    },
  });

  const fetchPnlReportMinMaxDates = useCallback(
    (params) => {
      queryPnlReportGetMinMaxDates({
        variables: params,
      });
    },
    [queryPnlReportGetMinMaxDates],
  );

  const fetchPnlMonthlyReports = useCallback(
    (params) => {
      setMonthlyParameters(params);
      if (false && cache.has(monthlyCacheKey + JSON.stringify(params))) {
        const cachedData = cache.get(monthlyCacheKey + JSON.stringify(params));
        setPnlMonthlyReport(cachedData);
      } else {
        queryPnlMonthlyReports({
          variables: { params },
        });
      }
    },
    [queryPnlMonthlyReports],
  );

  const fetchPnlAnnualReports = useCallback(
    (params) => {
      setYearlyParameters(params);
      if (false && cache.has(yearlyCacheKey + JSON.stringify(params))) {
        const cachedData = cache.get(yearlyCacheKey + JSON.stringify(params));
        setPnlAnnualReport(cachedData);
      } else {
        queryPnlAnnualReports({
          variables: { params },
        });
      }
    },
    [queryPnlAnnualReports],
  );

  const pnlReportGetPropertyComparison = useCallback(
    (params) => {
      setComparisonParameters(params);
      if (false && cache.has(comparisonCacheKey + JSON.stringify(params))) {
        const cacheData = cache.get(comparisonCacheKey + JSON.stringify(params));
        setPnlReportPropertyComparison(cacheData);
      } else {
        queryPnlReportPropertyComparison({
          variables: { params },
        });
      }
    },
    [queryPnlReportPropertyComparison],
  );

  const pnlReportGetForecastNumbers = useCallback(
    (params) => {
      setForecastNumberParameters(params);
      if (cache.has(forecastNumbersCacheKey + JSON.stringify(params))) {
        const cachedData = cache.get(forecastNumbersCacheKey + JSON.stringify(params));
        setForecastNumbers(cachedData);
      } else {
        queryPnlReportGetForecastNumbers({
          variables: { params },
        });
      }
    },
    [queryPnlReportGetForecastNumbers],
  );

  const pnlReportGetBudgetNumbers = useCallback(
    (params) => {
      queryPnlReportGetBudgetNumbers({
        variables: { params },
      });
    },
    [queryPnlReportGetBudgetNumbers],
  );

  const pnLUnmappedGet = useCallback(
    (params) => {
      queryPnlUnmappedReport({
        variables: { params },
      });
    },
    [queryPnlUnmappedReport],
  );

  return {
    fetchPnlReportMinMaxDates,
    fetchPnlMonthlyReports,
    fetchPnlAnnualReports,
    pnlReportGetPropertyComparison,
    pnlReportGetForecastNumbers,
    pnlReportGetBudgetNumbers,
    pnLUnmappedGet,

    pnlMonthlyReport,
    pnlAnnualReport,
    pnlReportPropertyComparison,
    pnlDatesRange,
    pnlForecastNumbers,
    pnlBudgetNumbers,
    loadingMonthlyReport,
    loadingAnnualReport,
    loadingPnLReportPropertyComparison,
    loadingDatesRange,
    pnlReportGetForecastNumbersLoading,
    pnlReportGetBudgetNumbersLoading,
    pnlUnmappedReport,
    pnlUnmappedReportLoading,
  };
};
