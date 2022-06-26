import { useState, useContext, useEffect } from 'react';

import { useUserSettings } from '../../../graphql';
import { usePageState } from 'hooks';
import { pageState } from '../constants';
import { prepareDataForEditDrawer } from '../utils';
import logger from 'utils/logger';
import { formatQueryErrors } from 'utils/dataManipulation';
import { ToastContext } from 'components/Toast';
import { getText } from 'utils/localesHelpers';

export const useHealthScorecardEdit = (displayReport) => {
  const { updatePageState } = usePageState(pageState);

  const {
    settingsListGet: userSettingsListGet,
    userSettingsList: userSettings,
    userSettingsSet,
    userSettingSetState,
  } = useUserSettings();

  const { showToast } = useContext(ToastContext);

  const [columnViewState, updateState] = useState({
    errors: [],
    editData: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    openEditDrawer: false,
    originalData: [],
  });

  const getPageState = (data, errors) => {
    if (!errors?.length && !data?.length) {
      return updatePageState(pageState.NO_DATA);
    } else if (errors?.length) {
      return updatePageState(pageState.ERROR);
    } else {
      return updatePageState(pageState.DEFAULT);
    }
  };

  // different way of using useEffect, will not bother with condition, prep should all this for us...
  useEffect(() => {
    if (userSettings?.data || userSettings?.errors?.length) {
      const { editData } = prepareDataForEditDrawer(
        userSettings.data?.filter((setting) => setting.settingTypeId === 1100),
      );
      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(userSettings?.errors),
        editData: editData,
        originalData: editData,
        pageState: getPageState(userSettings?.data, userSettings?.errors),
      }));
    }
  }, [userSettings]);

  // for saving new state
  useEffect(() => {
    if (userSettingSetState?.data || userSettingSetState?.errors?.length) {
      logger.debug('Settings updated : ', userSettingSetState);
      if (userSettingSetState?.errors?.length) {
        updateState((state) => ({
          ...state,
          errors: formatQueryErrors(userSettingSetState?.errors),
          editData: [],
          pageState: getPageState(userSettingSetState?.data, userSettingSetState?.errors),
        }));
      } else {
        // all is good
        logger.debug('Updated column responce: ', userSettingSetState?.data);
        // close the drawer
        updateState((state) => ({
          ...state,
          openEditDrawer: false,
        }));
        // show toast
        showToast({
          message: getText('healthScroreCard.successfullyUpdateColumnView'),
        });
        // trigger reload
        displayReport();
      }
    }
  }, [userSettingSetState]);

  const onUpdateColumn = (name, value) => {
    const updatedEditData = columnViewState.editData.map((obj) =>
      obj.settingCode == name ? { ...obj, userSettingValue: value } : obj,
    );

    updateState((state) => ({
      ...state,
      editData: updatedEditData,
    }));
  };

  const onHandleEdit = () => {
    updateState((state) => ({
      ...state,
      openEditDrawer: true,
      pageState: updatePageState(pageState.LOADING),
      editData: [],
    }));
    logger.debug('Calling settingsListGet with params : { settingTypeId: 1100 }');
    userSettingsListGet({ settingTypeId: 1100 });
  };

  const onCloseEditDrawer = () => {
    logger.debug('onCloseEditDrawer');
    updateState((state) => ({
      ...state,
      openEditDrawer: false,
    }));
  };

  const saveColumnView = () => {
    let params = [];
    columnViewState.originalData.forEach((obj, index) => {
      // add only changed objects to the params
      if (obj.userSettingValue !== columnViewState.editData[index].userSettingValue) {
        params.push({
          settingCode: columnViewState.editData[index].settingCode,
          userSettingValue: columnViewState.editData[index].userSettingValue.toString(),
        });
      }
    });

    if (params.length) {
      logger.debug('Calling userSettingsSet with params :', { params });
      userSettingsSet({ params });
    } // just close the drawer
    else {
      onCloseEditDrawer();
    }
  };

  return {
    state: columnViewState,
    onHandleEdit,
    onCloseEditDrawer,
    saveColumnView,
    onUpdateColumn,
  };
};
