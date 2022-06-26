import { useState, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { customTableRowColumnCfgQueries } from './queries';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const useCustomTableRowColumnCfg = () => {
  const [customTableRowColumnCfg, setCustomTableRowColumnCfg] = useState({ data: null, errors: [] });

  const [queryCustomTableRowColumnCfgList, { loading: customTableRowColumnCfgListLoading }] = useLazyQuery(
    customTableRowColumnCfgQueries.list,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        try {
          const result = response.customTableRowColumnCfgList || {};
          const data = Array.isArray(result.data) ? result.data : [];

          setCustomTableRowColumnCfg({
            data,
            errors: Array.isArray(result.errors) ? result.errors : [],
          });
        } catch (ex) {
          logger.error('Something went wrong when fetching Custom Table Row Column Cfg :', ex);

          setCustomTableRowColumnCfg({
            data: [],
            errors: [
              {
                name: '',
                message: [`Something went wrong when fetching Custom Table Row Column Cfg. Please try later`],
              },
            ],
          });
        }
      },
      onError: (response) => {
        logger.error('Something went wrong when fetching Custom Table Row Column Cfg:', response);

        setCustomTableRowColumnCfg({
          data: [],
          errors: [
            {
              name: '',
              messages: [`Something went wrong when fetching Custom Table Row Column Cfg. Please try later`],
            },
          ],
        });
      },
    },
  );

  const customTableRowColumnCfgList = useCallback(
    (params) => {
      setCustomTableRowColumnCfg({ data: null, errors: [] });
      queryCustomTableRowColumnCfgList({ variables: { params } });
    },
    [queryCustomTableRowColumnCfgList],
  );

  return {
    customTableRowColumnCfgList,
    customTableRowColumnCfg,
    customTableRowColumnCfgListLoading,
  };
};
