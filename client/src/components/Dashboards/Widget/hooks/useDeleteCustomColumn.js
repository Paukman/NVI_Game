import { useState, useEffect, useContext } from 'react';
import { useCustomTableRowColumn } from '../../../../graphql';
import { getText } from 'utils/localesHelpers';
import logger from 'utils/logger';
import { DashboardContext, AppContext, ToastContext, DialogContext } from 'contexts';
import { useParams } from 'react-router-dom';

export const useDeleteCustomColumn = () => {
  const { customTableRowColumnRemove, customTableRowColumn } = useCustomTableRowColumn();
  const { dashboards } = useContext(AppContext);
  const { showToast } = useContext(ToastContext);
  const { showDialog, hideDialog } = useContext(DialogContext);
  const { dashboardGet } = useContext(DashboardContext);
  const params = useParams();
  const [columnState, updateState] = useState({
    columnId: null,
    columnName: null,
  });

  const fetchData = () => {
    const id = dashboards?.slugs?.[params?.slug]?.id;
    if (id) {
      dashboardGet(id);
    }
  };

  useEffect(() => {
    if (customTableRowColumn?.data || customTableRowColumn?.errors?.length) {
      // no errors
      if (customTableRowColumn?.data && !customTableRowColumn?.errors?.length) {
        if (!customTableRowColumn.data?.length) {
          // condition if no data is available
          // should not happen!!!
          hideDialog();
          logger.debug('Error when deleting a column, no data');
          showToast({
            severity: 'error',
            message: getText('generic.genericToastError'),
          });
          fetchData();
        } else {
          showToast({
            message: columnState.columnName
              ? `${getText('widgets.successfullyDeletedColumn')}, ${columnState.columnName}`
              : `${getText('widgets.successfullyDeletedColumn')}!`,
          });
          hideDialog();

          fetchData();
        }
      } // errors...
      else if (customTableRowColumn?.errors?.length) {
        hideDialog();
        logger.debug('Error when deleting a column: ', customTableRowColumn?.errors);
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
        fetchData();
      }
    }
  }, [customTableRowColumn]);

  const onConfirmDelete = (columnId, columnName) => {
    // should start spining the button
    logger.debug(`Removing custom column with id: ${columnId} and name: ${columnName}`);
    updateState((state) => ({
      ...state,
      columnId,
      columnName,
    }));
    customTableRowColumnRemove(columnId);
  };

  const onCancel = () => {
    hideDialog();
  };

  const deleteColumn = ({ id, name }) => {
    if (!id || !name) {
      return null;
    }
    showDialog({
      title: `${getText('widgets.deleteColumnTitle')} "${name}"?`,
      description: `${getText('widgets.deleteColumnDesc')} "${name}"?`,
      buttons: [
        { text: 'Cancel', variant: 'default', onClick: onCancel },
        { text: 'Ok', variant: 'success', onClick: () => onConfirmDelete(id, name) },
      ],
    });
  };

  return { columnState, onCancel, deleteColumn };
};
