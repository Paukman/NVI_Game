import { useEffect, useContext } from 'react';
import { useCustomTableRowColumn } from '../../../graphql';
import { DashboardContext, AppContext } from 'contexts';
import { useParams } from 'react-router-dom';

export const useOrderCustomColumn = () => {
  const { customTableRowColumnSetOrder, customTableRowColumnUpdateSetOrder } = useCustomTableRowColumn();
  const { dashboards } = useContext(AppContext);
  const { dashboardGet } = useContext(DashboardContext);
  const params = useParams();

  const orderColumnsId = (params) => {
    customTableRowColumnSetOrder(params);
  };

  useEffect(() => {
    const id = dashboards?.slugs?.[params.slug]?.id;
    if (id && !customTableRowColumnUpdateSetOrder) {
      dashboardGet(id);
    }
  }, [customTableRowColumnUpdateSetOrder]);

  return { orderColumnsId, customTableRowColumnUpdateSetOrder };
};
