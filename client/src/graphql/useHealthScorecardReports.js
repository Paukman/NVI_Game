import { useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import apolloClient from './apolloClient';
import logger from '../utils/logger';
import {
  GET_HEALTH_SCORECARD_MANUAL_ENTRY_LIST,
  GET_SVP_EVP_VALUES,
  SET_HEALTH_SCORECARD_MANUAL_ENTRY,
  SET_SVP_EVP_HEALTH_SCORECARD_MANUAL_ENTRY,
} from './queries/HealthScorecardQueries';

export const useHealthScorecardReports = () => {
  const [listData, setListData] = useState({ data: null, errors: [] });
  const [svpEvpValues, setsvpEvpValues] = useState({ data: null, errors: [] });
  const [hsSet, setHSSet] = useState({ data: null, errors: [] });
  const [hsSvpEvpSet, setHSSVpEvpSet] = useState({ data: null, errors: [] });

  const [listDataGet, { loading: listDataGetLoading }] = useLazyQuery(GET_HEALTH_SCORECARD_MANUAL_ENTRY_LIST, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.healthScoreCardManualEntryList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setListData({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when querying default Health Scorecard Report list:', ex);

        setListData({
          data: [],
          errors: [
            {
              name: '',
              message: [`Something went wrong when querying default Health Scorecard Report list. Please try later`],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when querying default Health Scorecard Report list:', response);

      setListData({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying default Health Scorecard Report list. Please try later`],
          },
        ],
      });
    },
  });

  const [getSvpEvpValues, { loading: getSvpEvpValuesLoading }] = useLazyQuery(GET_SVP_EVP_VALUES, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.healthScoreCardSvpEvpList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setsvpEvpValues({
          data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when querying default Health Scorecard Report list:', ex);

        setsvpEvpValues({
          data: [],
          errors: [
            {
              name: '',
              message: [`Something went wrong when querying default Health Scorecard Report list. Please try later`],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when querying default Health Scorecard Report list:', response);

      setsvpEvpValues({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying default Health Scorecard Report list. Please try later`],
          },
        ],
      });
    },
  });

  const [mutationHSManualEntryValues, { loading: mutationHSManualEntryValuesLoading }] = useMutation(
    SET_HEALTH_SCORECARD_MANUAL_ENTRY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.healthScoreCardManualEntrySet || {};

          const data = Array.isArray(result.data) ? result.data : [];

          const updatedItem = data[0] || null;
          setHSSet({
            data: updatedItem,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setHSSet({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Health Scorecard. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationHSManualEntrySVPEVPValues, { loading: mutationHSManualEntryEVPSVPValuesLoading }] = useMutation(
    SET_SVP_EVP_HEALTH_SCORECARD_MANUAL_ENTRY,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onCompleted: (response) => {
        try {
          const result = response.healthScoreCardSvpEvpSet || {};

          const data = Array.isArray(result.data) ? result.data : [];

          const updatedItem = data[0] || null;
          setHSSVpEvpSet({
            data: updatedItem,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          setHSSVpEvpSet({
            data: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server when setting Health Scorecard. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const listDataQueryGet = useCallback(
    (params) => {
      setListData({ data: null, errors: [] });
      listDataGet({ variables: { params } });
    },
    [listDataGet],
  );
  const getEvpSvpQuery = useCallback(
    (params) => {
      setsvpEvpValues({ data: null, errors: [] });
      getSvpEvpValues({ variables: { params } });
    },
    [getSvpEvpValues],
  );

  const hSManulEntrySet = useCallback(
    (params) => {
      mutationHSManualEntryValues({
        variables: { params },
      });
    },
    [mutationHSManualEntryValues],
  );

  const hSManulEntrySvpEvpSet = useCallback(
    (params) => {
      mutationHSManualEntrySVPEVPValues({
        variables: { params },
      });
    },
    [mutationHSManualEntrySVPEVPValues],
  );

  return {
    listData,
    listDataQueryGet,
    listDataGetLoading,
    getEvpSvpQuery,
    svpEvpValues,
    getSvpEvpValuesLoading,
    hSManulEntrySet,
    hSManulEntrySvpEvpSet,
    hsSet,
    hsSvpEvpSet,
    mutationHSManualEntryEVPSVPValuesLoading,
    mutationHSManualEntryValuesLoading,
  };
};
