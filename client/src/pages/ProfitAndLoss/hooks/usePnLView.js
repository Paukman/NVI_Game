import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { usePnlReportCustomView, useUserSettings } from '../../../graphql';
import { AppContext } from 'contexts';
import { usePageState } from 'hooks';
import { pageState, OWNERS_VIEW_ID, ADD_CUSTOM_VIEW } from '../constants';
import { prepareDataForPnlViewListState } from '../utils';
import { getText } from 'utils/localesHelpers';
import logger from 'utils/logger';
import { formatQueryErrors } from 'utils/dataManipulation';
import { ToastContext, DialogContext } from 'components';
import { strReplace } from 'utils/formatHelpers';

export const usePnLView = (pageKey) => {
  const {
    pnlReportCustomViewList: viewList,
    pnlReportCustomViewListState: viewState,
    pnlReportCustomViewRemove: removeView,
    pnlReportCustomViewRemoveState: removeState,
  } = usePnlReportCustomView();
  const { userSettingsState, userSettingsGetList, userSettingsSet, userSettingSetState } = useUserSettings();

  const { appPages } = useContext(AppContext);
  const { updatePageState } = usePageState(pageState);
  const { showToast } = useContext(ToastContext);
  const { showDialog, hideDialog } = useContext(DialogContext);
  const history = useHistory();

  const [pnLViewState, updateState] = useState({
    errors: [],
    listData: [],
    subHeaders: [],
    pnlViewsData: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    requestReport: true,
    pageKey: pageKey ?? null,
    defaultViewId: '',
  });

  const getViewsAndUserSettings = () => {
    updateState((state) => ({
      ...state,
      pageState: updatePageState(pageState.LOADING),
      listData: [],
      pnlViewsData: [],
      defaultViewId: '',
      requestReport: false,
    }));
    viewList({
      keyword: '',
    });
    userSettingsGetList({ settingTypeId: 5000 });
  };

  // get list immediatally
  useEffect(() => {
    getViewsAndUserSettings();
  }, []);

  const onHandleSetDefaultUser = (id) => {
    logger.debug('onHandleSetDefaultUser');
  };

  const onHandleDelete = (dataRow) => {
    logger.debug('onHandleDelete', dataRow);

    hideDialog();
    updateState((state) => ({
      ...state,
      requestReport: true,
    }));
    if (dataRow?.id) {
      removeView(dataRow.id);
    }
    if (dataRow?.defaultViewId) {
      // if this is currently default view, set default to owner's view
      userSettingsSet({
        params: [
          {
            settingCode: 'reports:pnl:settings:defaultViewId',
            userSettingValue: OWNERS_VIEW_ID,
          },
        ],
      });
    }
  };

  const onHandleEdit = (id) => {
    logger.debug('onHandleDelete');
  };

  const onHandleActions = (dataRow, action) => {
    logger.debug('onHandleActions: ', dataRow, action);
    switch (dataRow?.clickId) {
      case 'setDefault': {
        if (action?.id) {
          userSettingsSet({
            params: [
              {
                settingCode: 'reports:pnl:settings:defaultViewId',
                userSettingValue: action.id,
              },
            ],
          });
        }
        break;
      }
      case 'edit': {
        // implement edit functionality here
        break;
      }
      case 'remove': {
        showDialog({
          title: `${getText('pnl.deleteView')} "${action?.name}"?`,
          buttons: [
            { text: 'Cancel', variant: 'default', onClick: hideDialog },
            { text: 'Delete', variant: 'alert', onClick: () => onHandleDelete(action) },
          ],
        });
        break;
      }
      default:
        break;
    }
  };

  // set default view
  useEffect(() => {
    if (userSettingSetState?.data || userSettingSetState?.errors?.length) {
      if (
        Array.isArray(userSettingSetState?.data) &&
        userSettingSetState?.data?.length &&
        !userSettingSetState?.errors?.length
      ) {
        showToast({
          message: getText('pnl.successfullySetDefault'),
        });
        getViewsAndUserSettings();
      } else {
        showToast({
          severity: 'error',
          message: getText('pnl.failedSetDefault'),
        });
      }
    }
  }, [userSettingSetState]);

  // remove view
  useEffect(() => {
    if (removeState?.data || removeState?.errors?.length) {
      if (Array.isArray(removeState?.data) && removeState?.data?.length && !removeState?.errors?.length) {
        showToast({
          message: getText('pnl.successfullyDeleteView'),
        });
        getViewsAndUserSettings();
      } else {
        showToast({
          severity: 'error',
          message: getText('pnl.failedDeleteDefault'),
        });
      }
    }
  }, [removeState]);

  const getPageState = (data, errors) => {
    if (data?.length === 0 && !errors?.length) {
      return pageState.NO_DATA_VIEW;
    } else if (errors?.length) {
      return pageState.ERROR;
    }
    return pageState.DEFAULT;
  };

  useEffect(() => {
    if ((viewState?.data || viewState?.errors?.length) && userSettingsState?.data) {
      logger.debug('Received data: ', { viewState, userSettingsState });
      const { listData, pnlViewsData, defaultViewId } = prepareDataForPnlViewListState(
        viewState.data,
        userSettingsState.data,
        appPages,
      );

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(viewState?.errors),
        queryErrors: viewState?.errors,
        pageState: updatePageState(getPageState(viewState?.data, viewState?.errors)),
        listData,
        pnlViewsData,
        defaultViewId,
      }));
    }
  }, [viewState, userSettingsState]);

  const onHandleAddNew = () => {
    logger.debug('onHandleAddNew');
  };

  const onHandleCloseView = () => {
    if (pageKey && strReplace(`${appPages.keys[pageKey]?.url}`) !== undefined) {
      history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
    }
  };

  return {
    state: pnLViewState,
    onHandleAddNew,
    onHandleActions,
    onHandleCloseView,
  };
};
