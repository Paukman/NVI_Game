import React, { Fragment, memo, useEffect, useState, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { Button, InputField, ToolBar, ToolBarItem, PageLoading } from 'mdo-react-components';
import { AppContext } from '../../contexts';
import { ErrorMessage } from '../../components/ErrorMessage';
import { getText } from '../../utils/localesHelpers';
import { Form, ButtonGroup, FormContainer } from '../AccountMapping/styled';
import { SalesManagerProvider } from '../../providers';
import { useSalesManager } from '../../graphql';

const SalesManagerAddEdit = memo(({ hotelId, handleAddEdit }) => {
  const { appPages, setPageProps } = useContext(AppContext);
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  const params = useParams();

  const { createManager, updateManager, createSalesManager, getSalesManagers, getSalesManager, editSalesManager } =
    useSalesManager();
  const accountId = params.id;

  const goBack = useCallback(() => {
    //history.push(appPages.keys['sales-managers'].url);
    handleAddEdit();
  }, [history, appPages]);

  useEffect(() => {
    if (createSalesManager && createSalesManager.data.length) {
      handleAddEdit({ type: 'create', data: createSalesManager.data[0] });
    }
  }, [createSalesManager]);

  useEffect(() => {
    if (editSalesManager && editSalesManager.data.length) {
      handleAddEdit({ type: 'edit', data: editSalesManager.data[0] });
    }
  }, [createSalesManager]);

  useEffect(() => {
    if (accountId) {
      getSalesManagers({
        id: accountId,
      });
    }
  }, [accountId, getSalesManagers]);

  useEffect(() => {
    if (!accountId) {
      return;
    }
    if (getSalesManager.data.length) {
      const newState = { id: accountId, ...getSalesManager.data[0] };
      setErrors({});
      setState(newState);
      validate(newState);

      setPageProps({
        title: `Edit ${newState.firstName} account`,
      });
    }
  }, [getSalesManager, accountId]);

  const validate = useCallback(
    (state) => {
      const isValidChange = state.firstName && state.lastName;

      if (isValid !== isValidChange) {
        setValid(isValidChange);
      }
    },
    [isValid, accountId],
  );

  const handleChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value || '',
    };

    setState(newState);
    validate(newState);
  };

  const handleSubmit = () => {
    setSaving(true);
    setErrors({});
    if (
      state.email &&
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        state.email,
      )
    ) {
      setErrors({
        ...errors,
        email: 'Email is not valid',
      });
    }
    if (state.id) {
      updateManager({
        id: state.id,
        params: {
          firstName: state.firstName || '',
          lastName: state.lastName || '',
          phone: state.phone || '',
          email: state.email || '',
          address1: state.address1 || '',
          address2: state.address2 || '',
          city: state.city || '',
          state: state.state || '',
        },
      });
      history.goBack();
    } else {
      createManager({
        params: {
          hotelId,
          firstName: state.firstName || '',
          lastName: state.lastName || '',
          phone: state.phone || '',
          email: state.email || '',
          address1: state.address1 || '',
          address2: state.address2 || '',
          city: state.city || '',
          state: state.state || '',
        },
      });
    }

    // history.push(appPages.keys['sales-managers'].url);
  };

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
              name='firstName'
              value={state.firstName || ''}
              onChange={handleChange}
              label='First Name'
              error={!!errors['firstName']}
              helperText={errors['firstName']}
              required
            />
            <InputField
              name='lastName'
              value={state.lastName || ''}
              onChange={handleChange}
              label='Last Name'
              error={!!errors['lastName']}
              helperText={errors['lastName']}
              required
            />
            <InputField name='phone' value={state.phone || ''} onChange={handleChange} label='Phone Number' />
            <InputField name='email' value={state.email || ''} onChange={handleChange} label='Email Id' />
            {errors['email'] && <ErrorMessage>{errors['email']}</ErrorMessage>}
            <InputField name='address1' value={state.address1 || ''} onChange={handleChange} label='Address 1' />
            <InputField name='address2' value={state.address2 || ''} onChange={handleChange} label='Address 2' />
            <InputField name='city' value={state.city || ''} onChange={handleChange} label='City' />
            <InputField name='state' value={state.state || ''} onChange={handleChange} label='State/Province' />
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
            />
          </ButtonGroup>
        </FormContainer>
      </Fragment>
    </SalesManagerProvider>
  );
});

SalesManagerAddEdit.displayName = 'SalesManagerAddEdit';

SalesManagerAddEdit.propTypes = {
  handleAddEdit: PropTypes.any,
  hotelId: PropTypes.number,
};

export { SalesManagerAddEdit };
