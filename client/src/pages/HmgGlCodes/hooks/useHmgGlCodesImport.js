import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext, GlobalFilterContext, HotelContext, ToastContext } from 'contexts';
import { strReplace, isKeyPresent, getText } from 'utils';
import { getMappedGlCodeForImport } from './../utils';
import { APP_KEYS } from 'config/appSettings';
import { useGLCodes } from '../../../graphql/useGLCodes';
import { isEqual, some, isEmpty } from 'lodash';
import { STATUSES } from '../constants';

export const useHmgGlCodesImport = () => {
  const { appPages } = useContext(AppContext);
  const { hotelId, selectHotelId } = useContext(GlobalFilterContext);
  const { hmgGlCodeImport, hmgGlCodeImportingState, hmgGlCodeImportLoading, } = useGLCodes();
  const { hotels } = useContext(HotelContext);
  const { showToast } = useContext(ToastContext);
  const history = useHistory();
  const [state, setState] = useState({
    data: [],
    selectedData: [],
    csvData: [],
    coaValue: 1,
    csvError: false,
    status: STATUSES.IDLE,
  });

  useEffect(() => {
    const mappedData = hotels?.map(({ id, hotelName }) => ({ label: hotelName, value: id }));
    const selectedData = mappedData?.filter(({ value }) => value === hotelId);

    setState((preState) => ({ ...preState, data: mappedData, selectedData }));
  }, [hotels, hotelId]);

  useEffect(() => {

    if (state.status === STATUSES.SAVING && !hmgGlCodeImportLoading) {
      setState((preState) => ({ ...preState, status: STATUSES.SAVED }));

      if (hmgGlCodeImportingState.errors.length > 0) {
        const errorName = hmgGlCodeImportingState.errors[0].name;
        let message = getText('hmgGlCodes.importEmptyDisplayName');

        if (errorName === 'mdoGlCode') {
          message = getText('hmgGlCodes.importDuplicate');
        }

        showToast({
          severity: 'error',
          message,
        });
      } else {
        showToast({
          severity: 'success',
          message: getText('hmgGlCodes.importCompleted'),
        });

        const pageKey = location?.state?.key ?? null; // just in case its undefined

        if (!pageKey && isKeyPresent(appPages, APP_KEYS.GL_MAPPING)) {
          // just return to mapping if this page is reloaded...
          history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING].url}`));
        } else if (pageKey && isKeyPresent(appPages, pageKey)) {
          history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
        }
      }
    }
  }, [hmgGlCodeImportingState]);

  const handleCoaSelect = (name, value) => {
    const mappedList = state.data;
    let hmgList = [];
    // if Specific Hotels
    if (value === 1) {
      hmgList = mappedList?.filter(({ value }) => value === hotelId);
    } else {
      hmgList = mappedList;
    }

    setState((preState) => ({ ...preState, coaValue: value, selectedData: hmgList }));
  };

  const goBack = () => {
    showToast({
      severity: 'warning',
      message: getText('hmgGlCodes.importCancelled'),
    });

    const pageKey = location?.state?.key ?? null; // just in case its undefined

    if (!pageKey && isKeyPresent(appPages, APP_KEYS.GL_MAPPING)) {
      // just return to mapping if this page is reloaded...
      history.push(strReplace(`${appPages.keys[APP_KEYS.GL_MAPPING].url}`));
    } else if (pageKey && isKeyPresent(appPages, pageKey)) {
      history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
    }
  };

  const handleSubmit = (data) => {
    const hotelIds = data?.map(({ value }) => value);
    const glCodes = getMappedGlCodeForImport(hotelIds, state.csvData);

    setState((preState) => ({ ...preState, status: STATUSES.SAVING }));
    hmgGlCodeImport(glCodes);
  };

  const onRemoveFile = (data) => {
    setState((preState) => ({ ...preState, csvData: [] }));
  };

  const onUploadAccepted = ({ data }) => {
    const tmp = [...data];
    tmp.pop();
    const columns = tmp.shift();

    let error = false;

    if (!isEqual(columns, ['HMG GL Code', 'Display Name', 'MDO GL Code'])) {
      error = true;
      showToast({
        severity: 'error',
        message: getText('hmgGlCodes.importInvalidFormat'),
      });
    } else if (some(tmp, val => isEmpty(val[0]))) {
      error = true;
      showToast({
        severity: 'error',
        message: getText('hmgGlCodes.importNull'),
      });
    } else {
      error = false;
    }
    setState((preState) => ({ ...preState, csvData: data, csvError: error }));
  };

  return {
    state,
    handleCoaSelect,
    goBack,
    handleSubmit,
    onUploadAccepted,
    onRemoveFile,
  };
};
