import React, { Fragment, memo, useEffect, useState, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { Button, InputField, ToolBar, ToolBarItem, PageLoading } from 'mdo-react-components';
import { HotelContext, AppContext } from '../../contexts';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ARManagementStatusDropdown } from '../../components';
import { getText } from '../../utils/localesHelpers';
import { Form, ButtonGroup, FormContainer, InputGroup } from './styled';
import { useAccountMapping } from '../../graphql/useAccountMapping';
import { SalesManagerDropdown } from '../../components/SalesManagerDropdown';
import { SalesManagerProvider } from '../../providers';

let issave;

const AccountManagementAddEdit = memo((props) => {
  const { hotels, loadingList } = useContext(HotelContext);
  const { appPages, setPageProps } = useContext(AppContext);
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  const params = useParams();
  const {
    listAccounts,
    getAccount,
    getManyAccounts,
    createAccount,
    updateAccount,
    removeAccount,
    removeManyAccounts,
    loadingListAccount,
    loadingGet,
    loadingGetMany,
    loadingCreate,
    loadingUpdate,
    loadingRemove,
    loadingRemoveMany,
    listOfAccounts,
  } = useAccountMapping();
  const accountId = params.id;

  const goBack = useCallback(() => {
    history.push(appPages.keys['account-management-edit'].url);
  }, [history, appPages]);

  useEffect(() => {
    if (accountId) {
      getAccount({
        id: accountId,
      });
    }
  }, [accountId, getAccount]);

  const validate = useCallback(
    (state) => {
      const isValidChange = state.accountName;

      if (isValid !== isValidChange) {
        setValid(isValidChange);
      }
    },
    [isValid, accountId],
  );

  useEffect(() => {
    if (!accountId) {
      return;
    }

    if (listOfAccounts.data.length === 0 || !listOfAccounts.data) {
      setErrors({
        '': getText('account.errors.accountListNotFound'),
      });
    } else {
      const newState = { id: accountId, ...listOfAccounts?.data[0] };
      setErrors({});
      setState(newState);
      validate(newState);

      setPageProps({
        title: `Edit ${newState.accountName}`,
      });
    }
  }, [listOfAccounts.data, accountId]);

  useEffect(() => {
    const { code, errors } = listOfAccounts || {};

    if (code === undefined) {
      return;
    }

    if (code === 0) {
      if (saving) {
        goBack();
      }
    } else {
      const tmpError = {};
      (errors || []).forEach((error) => {
        tmpError[error.name] = `${error.messages.join('. ')}`;
      });
      setErrors(tmpError);
      setSaving(false);
    }
  }, [saving, listOfAccounts, goBack]);

  const handleChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value || '',
    };

    setState(newState);
    validate(newState);
  };

  useEffect(() => {
    if (listOfAccounts.data.length) {
      if (issave) {
        history.push(appPages.keys['account-management'].url);
        issave = false;
      }
    }
  }, [listOfAccounts.data]);

  const handleSubmit = () => {
    setSaving(true);

    if (state.id) {
      updateAccount({
        id: state.id,
        params: {
          accountName: state.accountName,
          hotelSalesManagerId: state.hotelSalesManagerId || null,
          managementStatusId: Number(state.managementStatusId) || 0,
        },
      });
    } else {
      createAccount({
        params: {
          accountName: state.accountName || '',
          hotelSalesManagerId: state.hotelSalesManagerId || null,
          managementStatusId: Number(state.managementStatusId) || 0,
        },
      });
    }
    issave = true;
  };

  if (loadingListAccount) {
    return <PageLoading open />;
  }

  return (
    <SalesManagerProvider>
      <Fragment>
        <ToolBar>
          <ToolBarItem toTheRight>
            <Button
              iconName='Close'
              variant='tertiary'
              onClick={() => {
                history.goBack();
              }}
              dataEl='buttonClose'
            />
          </ToolBarItem>
        </ToolBar>
        <FormContainer>
          <Form>
            <InputField
              name='accountName'
              value={state.accountName || ''}
              onChange={handleChange}
              label={getText('generic.accountName')}
              error={!!errors['accountName']}
              helperText={errors['accountName']}
              required
            />
            <SalesManagerDropdown
              name='hotelSalesManagerId'
              value={state.hotelSalesManagerId || ''}
              onChange={handleChange}
              label={'Sales Manager'}
            />
            <ARManagementStatusDropdown
              name='managementStatusId'
              label={getText('generic.managementStatusId')}
              value={state.managementStatusId || ''}
              onChange={handleChange}
            />
          </Form>
          {errors[''] && <ErrorMessage>{errors['']}</ErrorMessage>}
          <ButtonGroup>
            <Button
              variant='default'
              iconName='Block'
              text={getText('generic.cancel')}
              onClick={() => {
                history.goBack();
              }}
            />
            <Button
              variant='primary'
              iconName='Check'
              text={getText('generic.save')}
              onClick={handleSubmit}
              disabled={!isValid}
              inProgress={loadingCreate || loadingUpdate}
            />
          </ButtonGroup>
        </FormContainer>
      </Fragment>
    </SalesManagerProvider>
  );
});

AccountManagementAddEdit.displayName = 'AccountManagementAddEdit';

AccountManagementAddEdit.propTypes = {
  listOfAccounts: PropTypes.any,
};

export { AccountManagementAddEdit };
