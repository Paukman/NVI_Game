import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';
import { mapArrayBy } from 'mdo-react-components';
import { checkStringTypeAndConvert } from 'utils/dataManipulation';

export const DASHBOARD_LIST_QUERY = gql`
  query ($params: DashboardFilter, $pagination: PaginationAndSortingInput) {
    dashboardList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        userId
        orderNo
        slug
        dashboardName
        dashboardShortName
        dashboardDescription
        dashboardIcon
        columnsQty
        createdBy
        createdAt
        updatedAt
        permissions
      }
    }
  }
`;

export const DASHBOARD_GET_QUERY = gql`
  query ($id: ID) {
    dashboardGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        userId
        orderNo
        slug
        dashboardName
        dashboardShortName
        dashboardDescription
        dashboardIcon
        columnsQty
        createdAt
        updatedAt
        permissions
        dashboardSettings {
          settingName
          settingCode
          settingValue
        }
        dashboardWidgets {
          id
          width
          height
          widgetTypeId
          widgetName
          widgetShortName
          widgetGroupKey
          defaultPeriod
          defaultPriority
          alwaysFirst
          movable
          hasWrapper
          canChangePriority
          canChangePeriod
          statusId
          widget {
            id
            widgetCategoryId
            widgetDataTypeId
            widgetTypeId
            widgetStatusId
            widgetName
            widgetDescription
            periods
            widgetVariant
            supportsMultipleProperties
            hasPriorities
            canDuplicate
            permissions
            widgetValues {
              id
              widgetId
              orderNo
              sourceDataTypeId
              sourceTypeId
              dataPointsQty
              valueDataType
              kpiId
              mdoGlCode
              customTableKey
              dynamicName
              priority
              forecastBudgetNumber
              valueName
              widgetValueTypeId
              groupDataBy
              valueTypeId
              valueFormat
              valueDecimals
              displaySize
              valuePeriod
              valueDateOffsetTypeId
              customDate
              color
              bgColor
              otherSettings
              customTable {
                id
                tableName
                tableDescription
                customTableTypeId
                valueDecimals
                enableCompareTo
                valueDateOffsetType
                customDate
                rowsAndColumns {
                  id
                  thisIsRow
                  name
                  dataSourceId
                  hotelId
                  hotelGroupId
                  mdoGlCode
                  kpiId
                  period
                  valueTypeId
                  valueDataType
                  valueFormat
                  valueDecimals
                  valueDateOffsetType
                  budgetForecastNumber
                  aggregator
                  formula
                  rowColumnKey
                  orderNo
                  kpi {
                    aggregator
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const DASHBOARD_GET_BY_SLUG_QUERY = gql`
  query ($slug: String) {
    dashboardGetBySlug(slug: $slug) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        userId
        orderNo
        slug
        dashboardName
        dashboardShortName
        dashboardDescription
        dashboardIcon
        columnsQty
        createdAt
        updatedAt
        permissions
        dashboardSettings {
          settingName
          settingCode
          settingValue
        }
        dashboardWidgets {
          id
          width
          height
          widgetTypeId
          widgetName
          widgetShortName
          widgetGroupKey
          defaultPeriod
          defaultPriority
          alwaysFirst
          movable
          hasWrapper
          canChangePriority
          canChangePeriod
          statusId
          widget {
            id
            widgetCategoryId
            widgetDataTypeId
            widgetTypeId
            widgetStatusId
            widgetName
            widgetDescription
            periods
            widgetVariant
            supportsMultipleProperties
            hasPriorities
            canDuplicate
            permissions
            widgetValues {
              id
              widgetId
              orderNo
              sourceDataTypeId
              sourceTypeId
              dataPointsQty
              valueDataType
              kpiId
              mdoGlCode
              customTableKey
              dynamicName
              priority
              forecastBudgetNumber
              valueName
              widgetValueTypeId
              groupDataBy
              valueTypeId
              valueFormat
              valueDecimals
              displaySize
              valuePeriod
              valueDateOffsetTypeId
              customDate
              color
              bgColor
              otherSettings
              customTable {
                id
                tableName
                tableDescription
                customTableTypeId
                valueDecimals
                enableCompareTo
                valueDateOffsetType
                customDate
                rowsAndColumns {
                  id
                  thisIsRow
                  name
                  dataSourceId
                  hotelId
                  hotelGroupId
                  mdoGlCode
                  kpiId
                  period
                  valueTypeId
                  valueDataType
                  valueFormat
                  valueDecimals
                  valueDateOffsetType
                  budgetForecastNumber
                  aggregator
                  formula
                  rowColumnKey
                  orderNo
                  kpi {
                    aggregator
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const useDashboard = () => {
  const [dashboards, setDashboards] = useState({ data: [], ...buildErrors() });
  const [dashboard, setDashboard] = useState({ data: null, ...buildErrors() });

  const [queryDashboardList, { loading: dashboardsLoading }] = useLazyQuery(DASHBOARD_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.dashboardList || {};

      const data = Array.isArray(result.data) ? result.data : [];
      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying dashboards list:', errors.errors);
      }

      setDashboards({
        data,
        slugs: mapArrayBy(data, 'slug'),
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying dashboards list:', response);

      setDashboards({
        data: [],
        slugs: {},
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying dashboards list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryDashboardGet, { loading: dashboardLoading }] = useLazyQuery(DASHBOARD_GET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.dashboardGet || {};

      const data = Array.isArray(result.data) ? result.data[0] : null;

      const errors = buildErrors(result);

      if (errors.errors.length > 0) {
        logger.error('Something went wrong when querying dashboard details:', errors.errors);
      }

      const groupIndexes = {};
      const dashboardWidgets = [];

      (data?.dashboardWidgets || []).forEach((dw) => {
        if (!dw.widgetGroupKey) {
          dashboardWidgets.push([dw]);
          return;
        }

        const dwIdx = groupIndexes[dw.widgetGroupKey];
        if (dwIdx === undefined) {
          dashboardWidgets.push([dw]);
          groupIndexes[dw.widgetGroupKey] = dashboardWidgets.length - 1;
        } else {
          dashboardWidgets[groupIndexes[dw.widgetGroupKey]].push(dw);
        }
      });

      const dashboardSettings = (data?.dashboardSettings || []).reduce((acc, item) => {
        acc[item.settingCode] = {
          ...item,
          settingValue: checkStringTypeAndConvert(item.settingValue),
        };

        return acc;
      }, {});

      setDashboard({
        data: {
          ...data,
          dashboardWidgets,
          dashboardSettings,
        },
        dashboardSettings,
        dashboardWidgets: (data?.dashboardWidgets || []).reduce((acc, item) => {
          if (item.widget?.id && !acc[item.widget?.id]) {
            acc[item.widget.id] = {
              ...item.widget,
            };
          }
          return acc;
        }, {}),
        ...errors,
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying dashboard details:', response);

      setDashboard({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying dashboard details. Please try later.`],
            },
          ],
        }),
      });
    },
  });

  const [queryDashboardGetBySlug, { called: dashboardBySlugCalled, loading: dashboardBySlugLoading }] = useLazyQuery(
    DASHBOARD_GET_BY_SLUG_QUERY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const result = response?.dashboardGetBySlug || {};

        const data = Array.isArray(result.data) ? result.data[0] : null;

        const errors = buildErrors(result);

        if (errors.errors.length > 0) {
          logger.error('Something went wrong when querying dashboard details:', errors.errors);
        }

        const groupIndexes = {};
        const dashboardWidgets = [];

        (data?.dashboardWidgets || []).forEach((dw) => {
          if (!dw.widgetGroupKey) {
            dashboardWidgets.push([dw]);
            return;
          }

          const dwIdx = groupIndexes[dw.widgetGroupKey];
          if (dwIdx === undefined) {
            dashboardWidgets.push([dw]);
            groupIndexes[dw.widgetGroupKey] = dashboardWidgets.length - 1;
          } else {
            dashboardWidgets[groupIndexes[dw.widgetGroupKey]].push(dw);
          }
        });

        const dashboardSettings = (data?.dashboardSettings || []).reduce((acc, item) => {
          acc[item.settingCode] = {
            ...item,
            settingValue: checkStringTypeAndConvert(item.settingValue),
          };

          return acc;
        }, {});

        setDashboard({
          data: {
            ...data,
            dashboardWidgets,
            dashboardSettings,
          },
          dashboardSettings,
          dashboardWidgets: (data?.dashboardWidgets || []).reduce((acc, item) => {
            if (item.widget?.id && !acc[item.widget?.id]) {
              acc[item.widget.id] = {
                ...item.widget,
              };
            }
            return acc;
          }, {}),
          ...errors,
        });
      },
      onError: (response) => {
        logger.error('Something went wrong when querying dashboard details by slug:', response);

        setDashboard({
          data: null,
          ...buildErrors({
            errors: [
              {
                name: '',
                messages: [`Something went wrong when querying dashboard details by slug. Please try later.`],
              },
            ],
          }),
        });
      },
    },
  );

  const dashboardList = useCallback(
    (params) => {
      queryDashboardList({ variables: params });
    },
    [queryDashboardList],
  );

  const dashboardGet = useCallback(
    (id) => {
      queryDashboardGet({ variables: { id } });
    },
    [queryDashboardGet],
  );

  const dashboardGetBySlug = useCallback(
    (slug) => {
      queryDashboardGetBySlug({ variables: { slug } });
    },
    [queryDashboardGetBySlug],
  );

  return {
    dashboardList,
    dashboardGet,
    dashboardGetBySlug,
    dashboards,
    dashboard,
    dashboardsLoading,
    dashboardLoading,
    dashboardBySlugCalled,
    dashboardBySlugLoading,
  };
};
