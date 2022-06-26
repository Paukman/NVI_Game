import { useState, useEffect, useMemo } from 'react';
import logger from 'utils/logger';
import { useUserSettings } from '../graphql';

const CUSTOM_TABLE_ADD_EDIT_DRAWER = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};
const USER_SETTING_TYPE_ID_BY_PROPERTY = 40000;

const useDashboardCustomTable = () => {
  const { userSettingsList, settingsListGet, userSettingsSet } = useUserSettings();
  const [customTableState, updateState] = useState({
    isAddEditDrawerOpen: false,
    slug: null,
    mode: null,
    customTable: null,
    columnId: null,
    customTableEnabled: false,
    isRevenueSelected: false,
    userSettings: [],
    userSettingsSetValue: '',
  });

  const onUserSettingsSetValue = (value) => { 
    updateState({...customTableState, userSettingsSetValue: value});
  }

  useEffect(() => {
    settingsListGet({ params: { settingTypeId: USER_SETTING_TYPE_ID_BY_PROPERTY } });
    userSettingsSet({
      params: [{ settingCode: 'customTable:byProperty:enablePerformanceIcon', userSettingValue: customTableState.userSettingsSetValue }],
    });
  }, [customTableState.customTableEnabled]);

  useMemo(() => {
    updateState({ ...customTableState, userSettings: userSettingsList?.data });
  }, [userSettingsList]);

  const onHandleActions = ({ action, value, data }) => {
    logger.debug('onHandleActions: ', { action, value, data });
    switch (action) {
      case CUSTOM_TABLE_ADD_EDIT_DRAWER.OPEN:
        const { slug, mode, customTable, columnId } = data || {};
        updateState((state) => ({
          ...state,
          isAddEditDrawerOpen: true,
          slug,
          mode,
          customTable,
          columnId,
        }));
        break;
      case CUSTOM_TABLE_ADD_EDIT_DRAWER.CLOSE:
        updateState((state) => ({
          ...state,
          isAddEditDrawerOpen: false,
          slug: null,
          mode: null,
          customTable: null,
          columnId: null,
        }));
        break;
      default:
        break;
    }
  };

  const onChangeCustomTableData = (name, value) => {
    updateState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return {
    customTableState,
    onHandleActions,
    onChangeCustomTableData,
    onUserSettingsSetValue,
  };
};

export { useDashboardCustomTable, CUSTOM_TABLE_ADD_EDIT_DRAWER };
