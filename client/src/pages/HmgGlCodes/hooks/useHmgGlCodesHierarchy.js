import { useState, useContext, useEffect } from 'react';
import { isEqual } from 'lodash';
import { useHistory } from 'react-router-dom';

import { AppContext, GlobalFilterContext, MdoGlCodeContext, HotelContext } from 'contexts';
import { useGLCodes } from '../../../graphql/useGLCodes';
import { globals, usePageState, useTableData } from 'hooks';
import { pageState, GL_MODES, DEFAULT_FILTERS, GL_CODE_STATUS, GL_ACTIONS } from '../constants';
import {
  prepareDataForHmgGlCodesHierarchy,
  downloadExcelFileForHierarchy,
  mapHmgGlCodesHierarchyColumns,
  getMdoGLCodesFromChildren,
  filterOutHmgGLCodes,
  getPageState,
} from '../utils';
import logger from 'utils/logger';
import { APP_KEYS } from 'config/appSettings';
import { strReplace, isKeyPresent, getText, formatQueryErrors } from 'utils';
import { ToastContext, DialogContext, useIfPermitted } from 'components';

export const useHmgGlCodesHierarchy = () => {
  // TODO graphQL use proper state once graphQL is available
  const {
    hmgGlCodeList,
    hmgGlCodeListState: glCodes,
    hmgGlCodeSetStatus,
    hmgGlCodeSetStatusState,
    hmgGlCodeSetStatusAll,
    hmgGlCodeSetStatusAllState,
    hmgGlCodeListMdoStatus,
    hmgGlCodeListMdoStatusState: mdoStatuses,
  } = useGLCodes();

  const { departmentCodes, loading: mdoIsLoading, listMdoGlCodes, mdoGlCodes } = useContext(MdoGlCodeContext);
  const { appPages } = useContext(AppContext);
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { updatePageState } = usePageState(pageState);
  const { showToast } = useContext(ToastContext);
  const { showDialog, hideDialog } = useContext(DialogContext);
  const { onRequestTableData, tableData: resultData } = useTableData();
  const { hotelsMap } = useContext(HotelContext);
  const history = useHistory();
  const { isPermitted } = useIfPermitted({ page: 'gl-hierarchy' });

  const myGlobals = [globals.hotelId];

  const [hierarchyState, updateState] = useState({
    hotelId: portfolio.hotelId,
    mode: GL_MODES.HIERARCHY.value,
    data: null,
    errors: [], // errors for the elements
    queryErrors: [], // generic errors for the page (original errors from query)
    listData: [],
    listDataSorting: [], // keep a copy for sorting...
    subHeaders: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    drawerState: null,
    openFilters: false,
    mdoGlCodeStatuses: hmgGlCodeSetStatusAllState || [],
    mdoStatuses: [],
  });

  const [filters, updateFilters] = useState(DEFAULT_FILTERS);

  const fetchGLCodes = () => {
    // don't call for zero hotel, it will update automatically from HotelSelector when calls onChange
    if (hierarchyState.hotelId !== 0) {
      hmgGlCodeList({ hotelId: hierarchyState.hotelId });
      hmgGlCodeListMdoStatus({ hotelId: hierarchyState.hotelId });
    }
    updateState((state) => ({
      ...state,
      listData: [],
      listDataSorting: [],
      pageState: updatePageState(pageState.LOADING),
    }));
  };

  useEffect(() => {
    if (mdoGlCodes.length === 0 && !mdoIsLoading) {
      logger.debug('Listing MDO GL codes...');
      listMdoGlCodes({});
    }
    fetchGLCodes();
  }, []);

  // main report
  useEffect(() => {
    if ((glCodes?.data || glCodes?.errors?.length) && mdoGlCodes && mdoStatuses?.data) {
      logger.debug('Received hmgGlCodes: ', { glCodes, mdoGlCodes, mdoStatuses });
      const disabledItems =
        glCodes.data?.map((code) => {
          return code.mdoGlCode;
        }) || [];

      const { listData } = prepareDataForHmgGlCodesHierarchy(
        glCodes.data,
        mdoGlCodes,
        mdoStatuses.data,
        hierarchyState.hotelId,
      );
      const { subHeaders } = mapHmgGlCodesHierarchyColumns(handleActions, isPermitted);

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(glCodes?.errors),
        queryErrors: glCodes?.errors,
        pageState: getPageState(glCodes?.data, glCodes?.errors, updatePageState, getText('pnl.noGLHierarchyFound')),
        subHeaders,
        listData,
        listDataSorting: [...glCodes.data], // keep a copy for filtering and sorting...
        mdoStatuses: mdoStatuses.data, // keep for filtering...
        data: glCodes.data,
        disabledItems, // can be used for add/edit
      }));
      if (glCodes?.errors?.[0]?.messages) {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [glCodes, mdoGlCodes, mdoStatuses]);

  // update status
  useEffect(() => {
    if (hmgGlCodeSetStatusState?.data || hmgGlCodeSetStatusState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeSetStatusState?.data) &&
        hmgGlCodeSetStatusState?.data?.length &&
        !hmgGlCodeSetStatusState?.errors?.length
      ) {
        logger.debug('Received changed status: ', hmgGlCodeSetStatusState);
        showToast({ message: getText('hmgGlCodes.hmgGlCodeStatusUpdated') });
        // if all good re-fetch data
        fetchGLCodes();
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hmgGlCodeSetStatusState]);

  // update all statuses
  useEffect(() => {
    if (hmgGlCodeSetStatusAllState?.data || hmgGlCodeSetStatusAllState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeSetStatusAllState?.data) &&
        hmgGlCodeSetStatusAllState?.data?.length &&
        !hmgGlCodeSetStatusAllState?.errors?.length
      ) {
        logger.debug('Received changed status: ', hmgGlCodeSetStatusAllState);
        showToast({ message: getText('hmgGlCodes.hmgGlCodeAllStatusesUpdated') });
        // if all good re-fetch data
        fetchGLCodes();
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hmgGlCodeSetStatusAllState]);

  const onHandleStatusIdSwitch = (data, value) => {
    if (!data) {
      return;
    }
    const params = {
      hotelId: data.hotelId,
      mdoGlCode: !data?.children?.length ? [data.id] : [data.id, ...getMdoGLCodesFromChildren(data.children)],
      statusId: value ? GL_CODE_STATUS.ACTIVE : GL_CODE_STATUS.DISABLED,
    };
    logger.debug('onHandleStatusIdSwitch: ', params);
    hmgGlCodeSetStatus(params);
  };

  const handleActions = ({ action, value, data }) => {
    switch (action) {
      case GL_ACTIONS.CHANGE_STATUS: {
        if (data?.children?.length && !value) {
          showDialog({
            title: `Turn Off Parent GL Code?`,
            description: 'This group contains mapped, active GL items.',
            buttons: [
              { text: 'Cancel', variant: 'default', onClick: hideDialog },
              {
                text: 'Ok',
                variant: 'alert',
                onClick: () => {
                  hideDialog();
                  onHandleStatusIdSwitch(data, value);
                },
              },
            ],
          });
        } else {
          onHandleStatusIdSwitch(data, value);
        }

        break;
      }

      case GL_ACTIONS.ALL_STATUSES_ON: {
        hmgGlCodeSetStatusAll({
          hotelId: hierarchyState.hotelId,
          mappedOnly: false,
          statusId: 100,
        });
        break;
      }
      case GL_ACTIONS.ADD: {
        if (isKeyPresent(appPages, APP_KEYS.GL_MAPPING_ADD)) {
          history.push({
            pathname: history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING_ADD]?.url}`)),
            state: { key: APP_KEYS.GL_HIERARCHY },
          });
        }
        break;
      }
      case GL_ACTIONS.DOWNLOAD: {
        const hotelName = hotelsMap?.[hierarchyState.hotelId]?.hotelName ?? 'uknown-hotel-name';
        downloadExcelFileForHierarchy(value, resultData, mdoGlCodes, hotelName);
        break;
      }
      case GL_ACTIONS.COPY: {
        if (isKeyPresent(appPages, APP_KEYS.GL_MAPPING_COPY)) {
          history.push({
            pathname: history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING_COPY]?.url}`)),
            state: { key: APP_KEYS.GL_HIERARCHY },
          });
        }
        break;
      }
      case GL_ACTIONS.UPLOAD: {
        // hanlde upload here
        break;
      }
      default:
        break;
    }
  };

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value); // keep globals up to date
    }

    hmgGlCodeList({ hotelId: value });
    hmgGlCodeListMdoStatus({ hotelId: value });

    updateState((state) => ({
      ...state,
      [name]: value,
      listData: [],
      listDataSorting: [],
      pageState: updatePageState(pageState.LOADING),
    }));
  };

  const onModeChange = (value) => {
    if (value === GL_MODES.MAPPING.value && isKeyPresent(appPages, APP_KEYS.GL_MAPPING)) {
      history.push(appPages.keys[APP_KEYS.GL_MAPPING].url);
    } else if (value === GL_MODES.HIERARCHY.value && isKeyPresent(appPages, APP_KEYS.GL_HIERARCHY)) {
      history.push(appPages.keys[APP_KEYS.GL_HIERARCHY].url);
    }
  };

  const filterOutResults = (name, keyWord) => {
    let matchingList = hierarchyState.listDataSorting;

    if (keyWord) {
      matchingList = hierarchyState.listDataSorting.filter((item) => {
        return findInObject({
          predicate: (val) => {
            return val.toLowerCase().includes(keyWord.toLowerCase());
          },
          object: item,
          exclude: ['id'], // don't look here...
        });
      });
    }

    updateState((state) => ({
      ...state,
      [name]: keyWord,
      listData: [...matchingList],
    }));
  };

  const onHandleFilters = () => {
    logger.debug('onHandleExtraButton1');
    updateState((state) => ({
      ...state,
      openFilters: true,
    }));
  };

  const onCloseFilters = () => {
    updateState((state) => ({
      ...state,
      openFilters: false,
    }));
  };

  const onHandleApplyFilters = (value) => {
    if (!isEqual(value, filters)) {
      const { listData: filteredData } = filterOutHmgGLCodes(hierarchyState.listDataSorting, value, departmentCodes);

      const { listData } = prepareDataForHmgGlCodesHierarchy(
        filteredData,
        mdoGlCodes,
        hierarchyState.mdoStatuses,
        hierarchyState.hotelId,
      );

      updateFilters((state) => ({
        ...state,
        filterMdoGlCode: value?.filterMdoGlCode,
        filterMdoDepartment: value?.filterMdoDepartment,
        filterStatus: value?.filterStatus,
      }));
      updateState((state) => ({
        ...state,
        listData: listData,
      }));
    }
    onCloseFilters();
  };

  const onHandleResetFilters = () => {
    onHandleApplyFilters(DEFAULT_FILTERS);
  };

  return {
    state: hierarchyState,
    filters,
    onChange,
    filterOutResults,
    onCloseFilters,
    onHandleFilters,
    onHandleResetFilters,
    onHandleApplyFilters,
    onModeChange,
    handleActions,
    onRequestTableData,
    isPermitted,
  };
};
