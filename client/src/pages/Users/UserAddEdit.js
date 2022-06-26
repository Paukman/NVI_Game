import React, { memo, Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { omit, pick } from 'lodash';

import { Grid, GridItem, ToolBar, ToolBarItem, InputField, Button, FormState } from 'mdo-react-components';

import {
  FormContainer,
  Form,
  DisplayApiErrors,
  ButtonsCancelSave,
  RoleDropdown,
  OrganizationDropdown,
} from '../../components';

import { HmgGlCodeProvider } from '../../providers';
import { AppContext } from '../../contexts';

import { useUser } from '../../graphql';

import { getText } from '../../utils/localesHelpers';
import logger from '../../utils/logger';

import { ToastContext } from '../../components/Toast';

const newUser = {
  id: undefined,
  username: '',
  orgId: undefined,
  roleId: 2,
  firstName: '',
  lastName: '',
  businessPhoneNumber: '',
  homePhoneNumber: '',
  cellPhoneNumber: '',
  gender: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  address1: '',
  address2: '',
  password: null,
};

const UserAddEdit = memo(() => {
  const history = useHistory();
  const params = useParams();
  const { appPages, setPageProps } = useContext(AppContext);
  const {
    user,
    userGet,
    userCreate,
    userUpdate,
    userLoading,
    userCreating,
    userUpdating,
    userCreateCalled,
    userUpdateCalled,
  } = useUser();
  const { showToast } = useContext(ToastContext);
  const [state, setState] = useState(newUser);

  const validate = (formData) => {
    return !!(formData.username && formData.firstName && formData.lastName);
  };

  const handleSubmit = useCallback(
    (formData) => {
      const id = params.userId;
      const params2use = pick(formData, Object.keys(newUser));

      params2use.roleId = parseInt(params2use.roleId);
      params2use.orgId = params2use.orgId ? parseInt(params2use.orgId) : null;
      params2use.id = params2use.id ? parseInt(params2use.id) : null;

      if (id) {
        logger.debug('Update user:', { params: params2use, formData });
        userUpdate({
          id,
          params: params2use,
        });
      } else {
        logger.debug('Create user:', { params: params2use, formData });
        userCreate(params2use);
      }
    },
    [params.userId, userUpdate, userCreate],
  );

  const goBack = useCallback(() => {
    history.push(appPages.keys['users'].url);
  }, [history, appPages]);

  useEffect(() => {
    if (params.userId) {
      logger.debug('Loading user by ID', params.userId);
      userGet(params.userId);
    }
  }, [params.userId, userGet]);

  useEffect(() => {
    logger.debug('user changed:', {
      data: user.data,
      errors: user.errors,
      userCreating,
      userUpdating,
      userCreateCalled,
      userUpdateCalled,
    });

    if (user.errors.length || user.data == null) {
      return;
    }

    if (user?.data?.id && params.userId) {
      setPageProps({
        title: `Edit '${user?.data?.username}'`,
      });

      setState(user.data);
    }

    if ((userUpdateCalled && !userUpdating) || (userCreateCalled && !userCreating)) {
      setTimeout(() => {
        showToast({ message: getText(params.userId ? 'users.updatedSuccessfully' : 'users.createdSuccessfully') });
        ///goBack();
      }, 1000);
    }
  }, [
    params.userId,
    user,
    setPageProps,
    goBack,
    showToast,
    userCreating,
    userUpdating,
    userCreateCalled,
    userUpdateCalled,
  ]);

  const inProgress = userLoading || userCreating || userUpdating;

  return (
    <HmgGlCodeProvider>
      <Fragment>
        <ToolBar>
          <ToolBarItem toTheRight>
            <Button
              iconName='Close'
              variant='tertiary'
              onClick={() => {
                goBack();
              }}
              dataEl='buttonClose'
            />
          </ToolBarItem>
        </ToolBar>
        <FormState data={state} onSubmit={handleSubmit}>
          {({ data, handleChange, submit }) => {
            return (
              <FormContainer>
                <Form>
                  <Grid spacing={3}>
                    <GridItem xs={12}>
                      <OrganizationDropdown
                        required
                        name='orgId'
                        label={getText('users.orgId')}
                        onChange={handleChange}
                        value={`${data.orgId}`}
                        error={!!user.errorsMap['orgId']}
                        helperText={user.errorsMap['orgId']}
                      />
                    </GridItem>
                    {!params.userId && (
                      <GridItem xs={12}>
                        <InputField
                          name='id'
                          label={getText('generic.id')}
                          onChange={handleChange}
                          value={data.id}
                          error={!!user.errorsMap['id']}
                          helperText={user.errorsMap['id'] || getText('users.userIdHint')}
                        />
                      </GridItem>
                    )}
                    <GridItem xs={12}>
                      <InputField
                        required
                        name='username'
                        label={getText('users.username')}
                        onChange={handleChange}
                        value={data.username}
                        error={!!user.errorsMap['username']}
                        helperText={user.errorsMap['username'] || params.userId ? getText('users.usernameHint') : ''}
                        disabled={params.userId}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <RoleDropdown
                        required
                        name='roleId'
                        label={getText('users.roleId')}
                        onChange={handleChange}
                        value={data.roleId}
                        error={!!user.errorsMap['roleId']}
                        helperText={user.errorsMap['roleId']}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        required
                        name='firstName'
                        label={getText('users.firstName')}
                        onChange={handleChange}
                        value={data.firstName}
                        error={!!user.errorsMap['firstName']}
                        helperText={user.errorsMap['firstName']}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        required
                        name='lastName'
                        label={getText('users.lastName')}
                        onChange={handleChange}
                        value={data.lastName}
                        error={!!user.errorsMap['lastName']}
                        helperText={user.errorsMap['lastName']}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        name='businessPhoneNumber'
                        label={getText('address.businessPhoneNumber')}
                        onChange={handleChange}
                        value={data.businessPhoneNumber}
                        error={!!user.errorsMap['businessPhoneNumber']}
                        helperText={user.errorsMap['businessPhoneNumber']}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        name='password'
                        type='password'
                        label={getText('users.password')}
                        onChange={handleChange}
                        value={data.password}
                        error={!!user.errorsMap['password']}
                        helperText={user.errorsMap['password'] || params.userId ? getText('users.passwordHint') : ''}
                      />
                    </GridItem>
                    {user.errors.length > 0 && (
                      <GridItem xs={12}>
                        <DisplayApiErrors errors={user.errors} genericOnlyErrors />
                      </GridItem>
                    )}
                    <GridItem xs={12}>
                      <ButtonsCancelSave
                        inProgress={inProgress}
                        canSave={validate(data)}
                        onCancel={() => goBack()}
                        onSave={() => submit()}
                      />
                    </GridItem>
                  </Grid>
                </Form>
              </FormContainer>
            );
          }}
        </FormState>
      </Fragment>
    </HmgGlCodeProvider>
  );
});

UserAddEdit.displayName = 'UserAddEdit';

export { UserAddEdit };
