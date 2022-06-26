import React, { memo, Fragment } from 'react';
import { Grid, GridItem, InputField } from 'mdo-react-components';

const UserChangePassword = memo(() => {
  return (
    <Fragment>
      <Grid spacing={4} justify={'center'}>
        <GridItem xs={12} sm={12} md={6} lg={4} xl={4}>
          <InputField variant='outlined' type='password' multiline='false' label='Old Password' />
        </GridItem>
      </Grid>
      <Grid spacing={4} justify={'center'}>
        <GridItem xs={12} sm={12} md={6} lg={4} xl={4}>
          <InputField variant='outlined' type='password' multiline='false' label='New Password' />
        </GridItem>
      </Grid>
      <Grid spacing={4} justify={'center'}>
        <GridItem xs={12} sm={12} md={6} lg={4} xl={4}>
          <InputField variant='outlined' type='password' multiline='false' label='Repeat New Password' />
        </GridItem>
      </Grid>
    </Fragment>
  );
});

UserChangePassword.displayName = 'UserChangePassword';

export { UserChangePassword };
