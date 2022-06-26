import { useState, useContext, useEffect } from 'react';
import { isEqual } from 'lodash';
import { useHistory } from 'react-router-dom';

import { AppContext, GlobalFilterContext, MdoGlCodeContext, HotelContext } from 'contexts';
import { useGLCodes } from '../../../graphql/useGLCodes';
import { globals, usePageState, useTableData } from 'hooks';
import { pageState, GL_MODES, DEFAULT_FILTERS, GL_CODE_STATUS, GL_ACTIONS } from '../constants';
import { filterOutHmgGLCodes, downloadExcelFileForMapping, mapHmgGlCodesMappingColumns, getPageState } from '../utils';
import logger from 'utils/logger';
import { formatQueryErrors } from 'utils/dataManipulation';
import { APP_KEYS } from 'config/appSettings';
import { strReplace, getText, isKeyPresent } from 'utils';
import { ToastContext, DialogContext, useIfPermitted } from 'components';

export const useHmgGlCodesMapping = () => {
  // TODO graphQL use proper state once graphQL is available
  const {
    hmgGlCodeList,
    hmgGlCodeListState: glCodes,
    hmgGlCodeMap,
    hmgGlCodeMapState,
    hmgGlCodeSetStatus,
    hmgGlCodeSetStatusState,
    hmgGlCodeRemove,
    hmgGlCodeRemoveState,
  } = useGLCodes();

  const {
    departmentCodes,
    departmentNames,
    mdoGlCodeNames,
    loading: mdoIsLoading,
    listMdoGlCodes,
    mdoGlCodes,
  } = useContext(MdoGlCodeContext);

  const { appPages } = useContext(AppContext);
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { updatePageState } = usePageState(pageState);
  const { showToast } = useContext(ToastContext);
  const { showDialog, hideDialog } = useContext(DialogContext);
  const { hotelsMap } = useContext(HotelContext);
  const { onRequestTableData, tableData: resultData } = useTableData();
  const history = useHistory();
  const { isPermitted } = useIfPermitted({ page: 'gl-mapping' });

  const myGlobals = [globals.hotelId];

  const [mappingState, updateState] = useState({
    hotelId: portfolio.hotelId,
    mode: GL_MODES.MAPPING.value,
    errors: [], // errors for the elements
    queryErrors: [], // generic errors for the page (original errors from query)
    listData: [],
    listDataSorting: [], // keep a copy for sorting...
    subHeaders: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    openFilters: false,
  });

  const [filters, updateFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    if (mdoGlCodes.length === 0 && !mdoIsLoading) {
      logger.debug('Listing MDO GL codes...');
      listMdoGlCodes({});
    }
    // don't call for zero hotel, it will update automatically from HotelSelector
    if (mappingState.hotelId !== 0) {
      hmgGlCodeList({ hotelId: mappingState.hotelId });
    }
    updateState((state) => ({
      ...state,
      listData: [],
      listDataSorting: [],
      pageState: updatePageState(pageState.LOADING),
    }));
  }, []);

  // main report
  useEffect(() => {
    if (
      (glCodes?.data || glCodes?.errors?.length) &&
      Object.keys(departmentCodes).length &&
      Object.keys(departmentNames).length
    ) {
      logger.debug('Received hmgGlCodes: ', { glCodes, departmentCodes, departmentNames });
      const disabledItems =
        glCodes.data?.map((code) => {
          return code.mdoGlCode;
        }) || [];

      const { listData } = filterOutHmgGLCodes(glCodes.data, filters, departmentCodes, departmentNames, mdoGlCodeNames);
      const { subHeaders } = mapHmgGlCodesMappingColumns(handleActions, disabledItems, isPermitted);

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(glCodes?.errors),
        queryErrors: glCodes?.errors,
        pageState: getPageState(glCodes?.data, glCodes?.errors, updatePageState, getText('pnl.noGLMappingFound')),
        subHeaders,
        listData,
        listDataSorting: [...listData], // keep a copy for sorting adn filter withouth fetching
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
  }, [glCodes, departmentCodes, departmentNames, mdoGlCodeNames]);

  // GL code is mapped...
  useEffect(() => {
    if (hmgGlCodeMapState?.data || hmgGlCodeMapState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeMapState?.data) &&
        hmgGlCodeMapState?.data?.length &&
        !hmgGlCodeMapState?.errors?.length
      ) {
        showToast({ message: getText('hmgGlCodes.hmgGlCodeMapped') });
        const mapResult = hmgGlCodeMapState?.data[0];
        // no need to pull if successfull, just update listing data
        const listDataSorting = mappingState.listDataSorting?.map((item) => {
          if (item.id === mapResult.id) {
            return { ...item, mdoGlCode: mapResult.mdoGlCode };
          }
          return item;
        });
        const { listData } = filterOutHmgGLCodes(
          listDataSorting,
          filters,
          departmentCodes,
          departmentNames,
          mdoGlCodeNames,
          mappingState.keyword,
        );

        updateState((state) => ({
          ...state,
          listData: listData,
          listDataSorting: listDataSorting,
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hmgGlCodeMapState]);

  // status is updated...
  useEffect(() => {
    if (hmgGlCodeSetStatusState?.data || hmgGlCodeSetStatusState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeSetStatusState?.data) &&
        hmgGlCodeSetStatusState?.data?.length &&
        !hmgGlCodeSetStatusState?.errors?.length
      ) {
        logger.debug('Received changed status: ', hmgGlCodeSetStatusState);
        showToast({ message: getText('hmgGlCodes.hmgGlCodeStatusUpdated') });
        // will take care of the return...
        const statusId = hmgGlCodeSetStatusState?.data[0]?.statusId;
        const lastStatusUpdateMdoGlCode = mappingState.lastStatusUpdateMdoGlCode;
        // no need to pull if successfull, just update listing data
        const listDataSorting = mappingState.listDataSorting?.map((item) => {
          if (item.mdoGlCode === lastStatusUpdateMdoGlCode) {
            return { ...item, statusId: statusId };
          }
          return item;
        });

        const { listData } = filterOutHmgGLCodes(
          listDataSorting,
          filters,
          departmentCodes,
          departmentNames,
          mdoGlCodeNames,
          mappingState.keyword,
        );

        updateState((state) => ({
          ...state,
          listData,
          listDataSorting: listDataSorting,
          lastStatusUpdateMdoGlCode: null,
          keepCurrentPage: true,
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
        updateState((state) => ({
          ...state,
          lastStatusUpdateMdoGlCode: null,
        }));
      }
    }
  }, [hmgGlCodeSetStatusState]);

  // GL code is removed...
  useEffect(() => {
    if (hmgGlCodeRemoveState?.data || hmgGlCodeRemoveState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeRemoveState?.data) &&
        hmgGlCodeRemoveState?.data?.length &&
        !hmgGlCodeRemoveState?.errors?.length
      ) {
        logger.debug('Received removed status: ', hmgGlCodeRemoveState);
        showToast({ message: getText('hmgGlCodes.hmgGlCodeDeleted') });
        // will take care of the return...
        const listDataSorting = mappingState.listDataSorting?.filter(
          (item) => item.id !== hmgGlCodeRemoveState?.data?.[0]?.id,
        );

        let { listData } = filterOutHmgGLCodes(
          listDataSorting,
          filters,
          departmentCodes,
          departmentNames,
          mdoGlCodeNames,
          mappingState.keyword,
        );

        updateState((state) => ({
          ...state,
          listData: listData,
          listDataSorting: listDataSorting,
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hmgGlCodeRemoveState]);

  // will handle almost all actions, but not onChange eg. for hotel
  const handleActions = ({ action, value, data }) => {
    switch (action) {
      case GL_ACTIONS.CHANGE_STATUS: {
        const params = {
          hotelId: mappingState.hotelId,
          mdoGlCode: [data?.mdoGlCode],
          statusId: value ? GL_CODE_STATUS.ACTIVE : GL_CODE_STATUS.DISABLED,
        };

        updateState((state) => ({
          ...state,
          lastStatusUpdateMdoGlCode: data?.mdoGlCode,
        }));

        hmgGlCodeSetStatus(params);
        break;
      }
      case GL_ACTIONS.REMOVE: {
        showDialog({
          title: `${getText('hmgGlCodes.deleteGL')} "${data?.hmgGlCode}"?`,
          buttons: [
            { text: 'Cancel', variant: 'default', onClick: hideDialog },
            {
              text: 'Ok',
              variant: 'alert',
              onClick: () => {
                hideDialog();
                hmgGlCodeRemove(data?.id);
              },
            },
          ],
        });

        break;
      }
      case GL_ACTIONS.EDIT: {
        if (isKeyPresent(appPages, APP_KEYS.GL_MAPPING_EDIT) && data?.id) {
          history.push({
            pathname: history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING_EDIT]?.url}`, { id: data?.id })),
            state: { key: APP_KEYS.GL_MAPPING, disabledItems: mappingState.disabledItems },
          });
        }
        break;
      }
      case GL_ACTIONS.MAP_MDO: {
        const params = {
          hmgGlCodeId: data?.id,
          mdoGlCode: value,
          statusId: GL_CODE_STATUS.ACTIVE,
        };
        hmgGlCodeMap(params);
        break;
      }
      case GL_ACTIONS.DOWNLOAD: {
        const hotelName = hotelsMap?.[mappingState.hotelId]?.hotelName ?? 'uknown-hotel-name';
        downloadExcelFileForMapping(value, resultData, departmentNames, hotelName);
        break;
      }
      case GL_ACTIONS.ADD: {
        if (isKeyPresent(appPages, APP_KEYS.GL_MAPPING_ADD)) {
          history.push({
            pathname: history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING_ADD]?.url}`)),
            state: { key: APP_KEYS.GL_MAPPING },
          });
        }
        break;
      }
      case GL_ACTIONS.COPY: {
        if (isKeyPresent(appPages, APP_KEYS.GL_MAPPING_COPY)) {
          history.push({
            pathname: history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING_COPY]?.url}`)),
            state: { key: APP_KEYS.GL_MAPPING },
          });
        }
        break;
      }
      case GL_ACTIONS.UPLOAD: {
        if (isKeyPresent(appPages, APP_KEYS.GL_MAPPING_IMPORT)) {
          history.push({
            pathname: history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING_IMPORT]?.url}`)),
            state: { key: APP_KEYS.GL_MAPPING_IMPORT },
          });
        }
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

  const filterOutResults = (_, keyword) => {
    const { listData } = filterOutHmgGLCodes(
      mappingState.listDataSorting,
      filters,
      departmentCodes,
      departmentNames,
      mdoGlCodeNames,
      keyword,
    );

    updateState((state) => ({
      ...state,
      keyword,
      listData: listData,
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
      const { listData: filteredData } = filterOutHmgGLCodes(
        mappingState.listDataSorting,
        value,
        departmentCodes,
        departmentNames,
        mdoGlCodeNames,
        mappingState.keyword,
      );

      updateFilters(value);
      updateState((state) => ({
        ...state,
        listData: filteredData,
      }));
    }
    onCloseFilters();
  };

  const onHandleResetFilters = () => {
    onHandleApplyFilters(DEFAULT_FILTERS);
  };

  return {
    state: mappingState,
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
