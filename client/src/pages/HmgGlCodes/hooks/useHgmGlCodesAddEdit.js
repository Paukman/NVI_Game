import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import { useGLCodes } from '../../../graphql/useGLCodes';
import { usePageState } from 'hooks';
import { pageState, GL_MODES } from '../constants';
import { formatQueryErrors, isKeyPresent, strReplace, getText } from 'utils';
import logger from 'utils/logger';
import { APP_KEYS } from 'config/appSettings';
import { ToastContext } from 'components';

export const useHgmGlCodesAddEdit = (hmgGlCodeId, pageKey, disabledItems) => {
  // TODO graphQL use proper state once graphQL is available
  const {
    hmgGlCodeList,
    hmgGlCodeListState: glCodes,
    hmgGlCodeGet,
    hmgGlCodeGetState,

    hmgGlCodeCreate,
    hmgGlCodeCreateState,

    hmgGlCodeUpdate,
    hmgGlCodeUpdateState,
  } = useGLCodes();

  const { appPages } = useContext(AppContext);
  const { portfolio } = useContext(GlobalFilterContext);
  const { updatePageState } = usePageState(pageState);
  const history = useHistory();
  const { showToast } = useContext(ToastContext);
  const { hotelsMap } = useContext(HotelContext);

  const [addEditState, updateState] = useState({
    //hotelId: portfolio.hotelId === 0 ? 0 : portfolio.hotelId,
    hotelId: portfolio.hotelId,
    hotelName: hotelsMap[portfolio.hotelId]?.hotelName,
    mode: GL_MODES.MAPPING.value,
    listDataSorting: [], // keep a copy for sorting...
    data: null,
    errors: [], // errors for the elements
    queryErrors: [], // generic errors for the page (original errors from query)
    editData: {},
    subHeaders: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    drawerState: null,
    openFilters: false,
    hmgGlCode: '',
    displayName: '',
    mdoGlCode: '',
    statusId: 'Disabled',
    disabledItems: disabledItems || [],
    hmgGlCodeId: hmgGlCodeId ?? null,
  });

  useEffect(() => {
    // if in edit get gl code immediattely
    if (hmgGlCodeId) {
      hmgGlCodeGet(hmgGlCodeId);
    }

    // don't call for zero hotel, it will update automatically from HotelSelector
    // only call list if we didn't pass disabled items
    if (addEditState.hotelId !== 0 && !disabledItems?.length) {
      hmgGlCodeList({ hotelId: addEditState.hotelId });
      updateState((state) => ({
        ...state,
        disabledItems: [],
        listDataSorting: [],
        pageState: updatePageState(pageState.LOADING),
      }));
    }
  }, []);

  // when record is received
  useEffect(() => {
    if (hmgGlCodeGetState?.data || hmgGlCodeGetState?.errors?.length) {
      logger.debug('GL code received: ', { hmgGlCodeGetState });
      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(hmgGlCodeGetState?.errors),
        queryErrors: hmgGlCodeGetState?.errors,
        pageState: updatePageState(getPageState(hmgGlCodeGetState?.data, hmgGlCodeGetState?.errors)),
        editData: hmgGlCodeGetState?.data?.[0],
        // this is important: we get hotelid from glCode => update state
        hotelId: hmgGlCodeGetState?.data?.[0]?.hotelId,
      }));
    }
  }, [hmgGlCodeGetState]);

  // if we're getting gl codes...
  useEffect(() => {
    if (glCodes?.data || glCodes?.errors?.length) {
      logger.debug('hmgGlCodes received: ', { glCodes });

      // we're only interested in disabled items
      const disabledItems =
        glCodes.data?.map((code) => {
          return code.mdoGlCode;
        }) || [];

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(glCodes?.errors),
        queryErrors: glCodes?.errors,
        data: glCodes.data,
        disabledItems,
      }));
    }
  }, [glCodes]);

  // create gl code
  useEffect(() => {
    if (hmgGlCodeCreateState?.data || hmgGlCodeCreateState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeCreateState?.data) &&
        hmgGlCodeCreateState?.data?.length &&
        !hmgGlCodeCreateState?.errors?.length
      ) {
        showToast({ message: getText('hmgGlCodes.hmgGlCodeCreated') });
        // will take care of the return...
        onHandleCancel();
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hmgGlCodeCreateState]);

  // update gl code
  useEffect(() => {
    if (hmgGlCodeUpdateState?.data || hmgGlCodeUpdateState?.errors?.length) {
      if (
        Array.isArray(hmgGlCodeUpdateState?.data) &&
        hmgGlCodeUpdateState?.data?.length &&
        !hmgGlCodeUpdateState?.errors?.length
      ) {
        showToast({ message: getText('hmgGlCodes.hmgGlCodeUpdated') });
        // will take care of the return...
        onHandleCancel();
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hmgGlCodeUpdateState]);

  // this function might need some adjustments depending on the specific page
  // but in 9 out 10 cases no need to change
  const getPageState = (data, errors) => {
    if (data?.length === 0 && !errors?.length) {
      return pageState.NO_DATA;
    } else if (errors?.length) {
      return pageState.ERROR;
    }
    return pageState.DEFAULT;
  };

  const onHandleSave = (value) => {
    logger.debug('onHandleSave', value);

    const params = {
      hotelId: addEditState?.hotelId,
      hmgGlCode: value?.hmgGlCode || '',
      displayName: value?.displayName || '',
      mdoGlCode: value?.mdoGlCode || '',
      statusId: value?.statusId,
    };
    if (hmgGlCodeId) {
      hmgGlCodeUpdate(hmgGlCodeId, params);
    } else {
      hmgGlCodeCreate(params);
    }
  };

  const onHandleCancel = (value) => {
    if (!pageKey && isKeyPresent(appPages, APP_KEYS.GL_MAPPING)) {
      // just return to mapping if this page is reloaded...
      history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING].url}`));
    } else if (pageKey && isKeyPresent(appPages, pageKey)) {
      history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
    }
  };

  return {
    state: addEditState,
    onHandleSave,
    onHandleCancel,
  };
};
