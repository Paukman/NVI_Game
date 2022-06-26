import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { healthScoreBoardQueries } from './queries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useHealthScoreBoard = () => {
  const [healthScoreBoard, setHealthScoreBoard] = useState({ data: null, errors: [] });

  const [queryHealthScoreBoardGet, { loading: healthScoreBoardGetLoading }] = useLazyQuery(
    healthScoreBoardQueries.get,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.healthScoreboardGet || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setHealthScoreBoard({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (err) {
          logger.error('Something went wrong when fetching Health Score Board :', err);

          setHealthScoreBoard({
            data: [],
            errors: [
              {
                name: '',
                message: [`Something went wrong when fetching Health Score Board. Please try later`],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Health Score Board:', response);

        setHealthScoreBoard({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Health Score Board. Please try later`],
            },
          ],
        });
      },
    },
  );

  const healthScoreBoardGet = useCallback(
    (params) => {
      setHealthScoreBoard({ data: null, errors: [] });
      queryHealthScoreBoardGet({ variables: { params } });
    },
    [queryHealthScoreBoardGet],
  );

  return {
    healthScoreBoardGet,
    healthScoreBoard,
    healthScoreBoardGetLoading,
  };
};
