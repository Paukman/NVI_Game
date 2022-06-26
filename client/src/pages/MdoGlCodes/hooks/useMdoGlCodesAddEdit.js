import { useState, useContext, useEffect, useCallback } from 'react';
import { formatQueryErrors, isKeyPresent, strReplace, getText } from 'utils';
import { APP_KEYS } from 'config/appSettings';

import { buildHierarchy } from 'mdo-react-components';
import { ToastContext } from 'components';
import { useHistory } from 'react-router-dom';

import { useMdoGlCodes } from '../../../graphql';
import { MdoGlCodeContext, AppContext } from 'contexts';
import { ACCOUNT_TYPES } from 'config/constants';
import {
  generateParentList,
  generateGlCode,
  getLargestAccountNo,
  getPath,
  getEditCode,
  isGraphQLError,
} from '../utils';

export const useMdoGlCodesAddEdit = (mdoGlCodeId, pageKey) => {
  const [state, setState] = useState({
    displayName: '',
    departmentId: null,
    accountType: '',
    parentId: '',
    valueType: '',
    parentList: [
      {
        label: getText('generic.loading'),
        value: '',
      },
    ],
    path: '',
    glCode: '',
    isValid: false,
    editData: null,
    errors: [],
    response: false,
    mdoGlCodeId: mdoGlCodeId ?? null,
  });
  const [parentObject, setParentObject] = useState({});

  const {
    createMdoGlCode,
    mdoGlCode,
    getMdoGlCode,
    listMdoGlCodeParents,
    mdoGlCodeParentLoading,
    mdoGlCodeParents,
    mdoGlCodeCreateState,
    mdoGlCodeUpdateState,
    updateMdoGlCode,
  } = useMdoGlCodes();
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { listMdoGlCodes: listMdoGlCodeContext, loading: mdoIsLoading, mdoGlCodes } = useContext(MdoGlCodeContext);

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (mdoGlCodes.length === 0 && !mdoIsLoading) {
      listMdoGlCodeContext({});
    }
    if (mdoGlCodeId) {
      getMdoGlCode({
        id: mdoGlCodeId,
      });
    }
  }, []);

  useEffect(() => {
    if (mdoGlCodeCreateState?.data || mdoGlCodeCreateState?.errors?.length) {
      if (
        Array.isArray(mdoGlCodeCreateState?.data) &&
        mdoGlCodeCreateState?.data?.length &&
        !mdoGlCodeCreateState?.errors?.length
      ) {
        showToast({ message: getText('mdoGlCodes.createSuccessMessage') });
        onHandleCancel();
      } else {
        let err = formatQueryErrors(mdoGlCodeCreateState?.errors);
        if (!isGraphQLError(err)) {
          showToast({
            severity: 'error',
            message: getText('generic.genericToastError'),
          });
        }
        err = err.mdoGlCodeDepartmentId ? { ...err, departmentId: err.mdoGlCodeDepartmentId } : err;
        setState((prevState) => ({ ...prevState, errors: err }));
      }
    }
  }, [mdoGlCodeCreateState]);

  useEffect(() => {
    if (mdoGlCodeUpdateState?.data || mdoGlCodeUpdateState?.errors?.length) {
      if (
        Array.isArray(mdoGlCodeUpdateState?.data) &&
        mdoGlCodeUpdateState?.data?.length &&
        !mdoGlCodeUpdateState?.errors?.length
      ) {
        showToast({ message: getText('mdoGlCodes.updateSuccessMessage') });
        onHandleCancel();
      } else {
        let err = formatQueryErrors(mdoGlCodeUpdateState.errors);
        if (!isGraphQLError(err)) {
          showToast({
            severity: 'error',
            message: getText('generic.genericToastError'),
          });
        }
        err = err.mdoGlCodeDepartmentId ? { ...err, departmentId: err.mdoGlCodeDepartmentId } : err;
        setState((prevState) => ({ ...prevState, errors: err }));
      }
    }
  }, [mdoGlCodeUpdateState]);

  useEffect(() => {
    if (mdoGlCodes?.length > 0) {
      const [tree] = buildHierarchy(mdoGlCodes, 'id', 'parentId', 'children');
      const { parentTree } = generateParentList(tree);
      setParentObject(parentTree);
    }
  }, [mdoGlCodes]);

  useEffect(() => {
    listMdoGlCodeContext({});
    if (state?.departmentId !== null) {
      setState((prevState) => ({ ...prevState, response: false }));
    }
  }, [state.departmentId, state.parentId, state.accountType]);

  useEffect(() => {
    if (mdoGlCode?.data?.length > 0 && mdoGlCode?.data[0] !== null && state.departmentId === null) {
      const newMdoGlCode = mdoGlCode?.data[0];
      const { id: glCode, mdoGlCodeDepartmentId, accountType, valueTypeId, path } = newMdoGlCode;

      const newState = {
        ...newMdoGlCode,
        valueType: valueTypeId,
        departmentId: getEditCode(mdoGlCodeDepartmentId, glCode, 0, 3),
        accountType: getEditCode(accountType, glCode, 3, 4),
      };
      setState((prevState) => ({ ...prevState, ...newState, path: getPath(path), glCode, editData: newMdoGlCode }));

      listMdoGlCodeParents({
        mdoGlCodeDepartmentId: newState.departmentId,
        accountType: ACCOUNT_TYPES[newState.accountType],
      });
    } else if (mdoGlCode?.data?.length > 0 && mdoGlCode?.data[0] !== null) {
      setState((prevState) => ({ ...prevState, path: mdoGlCode?.data[0].path }));
    }
  }, [mdoGlCode]);

  useEffect(() => {
    if (mdoGlCodeParents?.data?.length > 0 && !mdoGlCodeParentLoading) {
      const parentList = mdoGlCodeParents.data.map((parent) => {
        return { label: parent.displayName, value: parent.id };
      });
      setState((prevState) => ({ ...prevState, parentList }));
    } else if (mdoGlCodeParents?.data?.length === 0 && !mdoGlCodeParentLoading) {
      setState((prevState) => ({
        ...prevState,
        parentList: [
          {
            label: getText('mdoGlCodes.noRecord'),
            value: '',
          },
        ],
      }));
    }
  }, [mdoGlCodeParents, mdoGlCodeParentLoading]);

  useEffect(() => {
    if (state.accountType !== '' && state.departmentId !== null && state.editData === null) {
      setState((prevState) => ({
        ...prevState,
        parentId: '',
        parentList: [
          {
            label: getText('generic.loading'),
            value: '',
          },
        ],
      }));
      listMdoGlCodeParents({
        mdoGlCodeDepartmentId: state.departmentId,
        accountType: ACCOUNT_TYPES[state.accountType],
      });
    } else if (state.editData && Object.keys(state.editData).length > 0) {
      listMdoGlCodeParents({
        mdoGlCodeDepartmentId: state.departmentId ? state.departmentId : state.editData.mdoGlCodeDepartmentId,
        accountType: state.accountType ? ACCOUNT_TYPES[state.accountType] : ACCOUNT_TYPES[state.editData.accountType],
      });
    }
  }, [state.accountType, state.departmentId, state.editData]);

  useEffect(() => {
    if (state?.parentId !== '' && parentObject && Object.keys(parentObject).length > 0) {
      const { accountTypeCode, newParentAccountNo } = getLargestAccountNo(
        state.parentId,
        state.departmentId,
        parentObject,
        state.editData,
      );
      const glCode = generateGlCode(state.departmentId, accountTypeCode, newParentAccountNo);
      setState((prevState) => ({ ...prevState, glCode }));
    }
  }, [state.parentId, parentObject]);

  const validate = useCallback(
    (glCode) => {
      const isValidChange = glCode ? true : false;

      if (state.isValid !== isValidChange) {
        setState({ ...state, isValid: isValidChange });
      }
    },
    [state.isValid, state.glCode],
  );

  const onChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value || '',
    };
    switch (name) {
      case 'departmentId':
        newState.parentId = '';
        newState.accountType = '';
        break;
      case 'accountType':
        newState.parentId = '';
      case 'parentId':
        getMdoGlCode({ id: value });
        break;
    }
    validate(newState);
    const keys = ['displayName', 'departmentId', 'accountType', 'parentId', 'valueType'];
    newState.isValid = keys.every((inp) => !!newState[inp]);
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const onHandleSubmit = (value, state) => {
    const data = {
      id: state.glCode,
      mdoGlCodeDepartmentId: state.departmentId || null,
      displayName: state.displayName || '',
      accountType: state.accountType || null,
      valueTypeId: Number(state.valueType) || 2,
      parentId: state.parentId || null,
      path: `${state.path}/${state.glCode}`,
      orderNo: 'zzzzzzzzzz',
    };
    if (mdoGlCodeId) {
      updateMdoGlCode(state.editData.id, data);
    } else {
      createMdoGlCode(data);
    }
  };

  const onHandleCancel = (value) => {
    if (!pageKey && isKeyPresent(appPages, APP_KEYS.MDO_GL_CODES)) {
      // just return to mapping if this page is reloaded...
      history.push(strReplace(`${appPages.keys[APP_KEYS.MDO_GL_CODES].url}`));
    } else if (pageKey && isKeyPresent(appPages, pageKey)) {
      history.push(strReplace(`${appPages.keys[pageKey]?.url}`));
    }
  };

  return {
    state,
    onHandleSubmit,
    onHandleCancel,
    onChange,
  };
};
