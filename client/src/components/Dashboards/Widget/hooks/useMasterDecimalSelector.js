import { useState, useEffect, useContext } from 'react';

import { useCustomTable } from '../../../../graphql';
import { AppContext, ToastContext } from 'contexts';
import { getText } from 'utils';
import logger from 'utils/logger';

export const useMasterDecimalSelector = (widget, onDashboardGet, slug) => {
  const { customTableUpdate, customTableUpdateState } = useCustomTable();
  const { dashboards } = useContext(AppContext);
  const { showToast } = useContext(ToastContext);

  const [state, updateState] = useState({
    valueDecimals: widget?.widgetValues?.[0]?.customTable?.valueDecimals,
    customTableId: widget?.widgetValues?.[0]?.customTable?.id,
    customTableTypeId: widget?.widgetValues?.[0]?.customTable?.customTableTypeId,
    tableName: widget?.widgetValues?.[0]?.customTable?.tableName,
  });

  // when decimal point is updated
  useEffect(() => {
    if (customTableUpdateState?.data || customTableUpdateState?.errors?.length) {
      logger.debug('Update custom table data received: ', { customTableUpdateState });

      if (
        Array.isArray(customTableUpdateState?.data) &&
        customTableUpdateState?.data?.length &&
        !customTableUpdateState?.errors?.length
      ) {
        updateState((prevState) => ({
          ...prevState,
          valueDecimals: customTableUpdateState.data[0].valueDecimals,
        }));
        onDashboardGet(dashboards?.slugs?.[slug]?.id);
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [customTableUpdateState]);

  const onHanldeDecimalValueChange = (_, value) => {
    const params = {
      valueDecimals: value,
      customTableTypeId: state.customTableTypeId,
      tableName: state.tableName,
    };

    customTableUpdate(state.customTableId, params);
  };

  return { state, onHanldeDecimalValueChange };
};
