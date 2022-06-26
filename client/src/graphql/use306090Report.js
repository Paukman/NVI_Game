import { useCallback, useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const QUERY_306090_CALENDAR_MONTH_GET = gql`
  query($params: Report306090CalendarMonthInput) {
    report306090CalendarMonthGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
        columnsCfg {
          title
          date
        }
        subColumnsCfg {
          roomsSoldQty
          revenueTotal
          adr
        }
        items {
          hotel {
            id
            hotelName
          }
          columnsData {
            roomsSoldQty
            revenueTotal
            adr
          }
        }
      }
    }
  }
`;

export const QUERY_306090_ROLLING_MONTH_GET = gql`
  query($params: Report306090RollingMonthInput) {
    report306090RollingMonthGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
        columnsCfg {
          title
          date
        }
        subColumnsCfg {
          roomsSoldQty
          revenueTotal
          adr
        }
        items {
          hotel {
            id
            hotelName
          }
          columnsData {
            roomsSoldQty
            revenueTotal
            adr
          }
        }
      }
    }
  }
`;

export const use306090Report = () => {
  const [report3060690Get, setReport3060690Get] = useState({ data: [], code: null, errors: [] });
  const [rollingReport3060690Get, setRollingReport3060690Get] = useState({ data: [], code: null, errors: [] });

  const [queryReport3060690Get, { loading: report3060690GetLoading }] = useLazyQuery(QUERY_306090_CALENDAR_MONTH_GET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setReport3060690Get({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying 306090MonthReport. Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.report306090CalendarMonthGet || {};
        setReport3060690Get({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: result.code ? result.code : null,
        });
      } catch (ex) {
        setReport3060690Get({
          data: [],

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for 306090MonthReport. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [queryRollingReport3060690Get, { loading: rollingReport3060690GetLoading }] = useLazyQuery(
    QUERY_306090_ROLLING_MONTH_GET,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setRollingReport3060690Get({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying 306090RollingReport. Please try later`],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.report306090RollingMonthGet || {};
          setRollingReport3060690Get({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
            code: result.code ? result.code : null,
          });
        } catch (ex) {
          setRollingReport3060690Get({
            data: [],

            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for 306090RollingReport. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const getReport306090 = useCallback(
    (params) => {
      queryReport3060690Get({ variables: params });
    },
    [queryReport3060690Get],
  );

  const getRollingReport306090 = useCallback(
    (params) => {
      queryRollingReport3060690Get({ variables: params });
    },
    [queryRollingReport3060690Get],
  );

  return {
    report3060690GetLoading,
    rollingReport3060690GetLoading,
    getReport306090,
    getRollingReport306090,
    report3060690Get,
    rollingReport3060690Get,
  };
};
