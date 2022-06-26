import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';

export const WIDGET_LIST_QUERY = gql`
  query ($params: WidgetFilter, $pagination: PaginationAndSortingInput) {
    widgetList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        widgetCategoryId
        widgetDataTypeId
        widgetTypeId
        widgetStatusId
        widgetName
        widgetDescription
        periods
        widgetVariant
        userCreated {
          username
          displayName
        }
        permissions
      }
    }
  }
`;

export const WIDGET_GET_QUERY = gql`
  query ($id: ID) {
    widgetGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        widgetCategoryId
        widgetDataTypeId
        widgetTypeId
        widgetStatusId
        widgetName
        widgetDescription
        periods
        widgetVariant
        userCreated {
          username
          displayName
        }
        permissions
      }
    }
  }
`;

export const WIDGET_CALCULATE_QUERY = gql`
  query ($params: WidgetCalculateInput) {
    widgetCalculate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        widgetId
        date
        period
        values {
          widgetValueId
          startDate
          endDate
          budgetNumber
          forecastNumber
          errorMsg
          data {
            isTotal
            title
            date
            hotelId
            priority
            value
            valueTypeId
            values
            compareValues
            compareChangeValues
            compareChangePercentages
            valueTypeIds
            errorMsg
            hotel {
              hotelName
            }
          }
        }
      }
    }
  }
`;

export const useWidget = () => {
  const [widgets, setWidgets] = useState({ data: [], ...buildErrors() });
  const [widget, setWidget] = useState({ data: null, ...buildErrors() });
  const [widgetCalculation, setWidgetCalculation] = useState({ data: {}, ...buildErrors() });

  const [queryWidgetList, { loading: widgetsLoading }] = useLazyQuery(WIDGET_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.widgetList || {};

      setWidgets({
        data: Array.isArray(result.data) ? result.data : [],
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying widgets list:', response);

      setWidgets({
        data: [],
        slugs: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying widgets list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryWidgetGet, { loading: widgetLoading }] = useLazyQuery(WIDGET_GET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.widgetGet || {};

      setWidget({
        data: Array.isArray(result.data) ? result.data[0] : null,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying widget:', response);

      setWidget({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying widget. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryWidgetCalculation, { loading: widgetCalculationLoading }] = useLazyQuery(WIDGET_CALCULATE_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.widgetCalculate || {};

      const data = Array.isArray(result.data) ? result.data : [];

      setWidgetCalculation({
        data: data,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when calculating widget:', response);

      setWidgetCalculation({
        data: widgetCalculation.data,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when calculating widget. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const widgetList = useCallback(
    (params) => {
      queryWidgetList({ variables: params });
    },
    [queryWidgetList],
  );

  const widgetGet = useCallback(
    (id) => {
      queryWidgetGet({ variables: { id } });
    },
    [queryWidgetGet],
  );

  const widgetCalculate = useCallback(
    (params) => {
      setWidgetCalculation({ data: {}, ...buildErrors() });
      queryWidgetCalculation({ variables: { params } });
    },
    [queryWidgetCalculation],
  );

  return {
    widgetList,
    widgetGet,
    widgetCalculate,
    widgets,
    widget,
    widgetCalculation,
    widgetsLoading,
    widgetLoading,
    widgetCalculationLoading,
  };
};
