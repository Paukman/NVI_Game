import React, { memo, useContext } from 'react';
import { Content, Grid, GridItem, Button, InputField, ToolBar, ToolBarItem } from 'mdo-react-components';

import { TextStyle, AddressesDrawer, colors } from '../styled';
import { getText } from '../../../utils/localesHelpers';
import { PurchaseOrderContext } from '../../../providers/PurchaseOrderProvider';

//import { alternateAddressFormConfig } from '../constants';
//import { GenericForm } from 'components';

export const entity = {
  hotel: 'hotel',
  vendor: 'vendor',
};
// will be used both for vendors and hotels
export const PurchaseOrderAddEditAddress = memo(() => {
  const { addEdit } = useContext(PurchaseOrderContext);
  const { addEditState, onChangeAddressData, onCancelNewAddress, onSaveNewAddress } = addEdit;
  const { addressData: state, newAddressErrors: errors } = addEditState;

  //const { formCfg } = alternateAddressFormConfig(onCancelNewAddress, onSaveNewAddress);

  return (
    <>
      <AddressesDrawer>
        <Content pt={25} pb={0} pl={25} pr={30}>
          {/*<GenericForm formCfg={formCfg} data={state} errors={errors} />*/}
          <Grid container spacing={2} justify='space-between' alignItems='flex-start' direction='row'>
            <GridItem xs={11}>
              <TextStyle fontSize='20px'>{getText('po.alternateAddress')}</TextStyle>
            </GridItem>
            <GridItem xs={1}>
              <Button dataEl='buttonClose' iconName='Close' variant='tertiary' onClick={() => onCancelNewAddress()} />
            </GridItem>
          </Grid>
          <Content pt={16}></Content>
          <TextStyle fontSize='12px' color={colors.addressFormColor}>
            <GridItem xs={12}>{getText('po.addNewAddress')}</GridItem>
          </TextStyle>
          <InputField
            name='addressName'
            value={state?.addressName || ''}
            onChange={onChangeAddressData}
            label={getText('po.deliveryLocationName')}
            helperText={errors['addressName'] || getText('po.required')}
            error={!!errors['addressName']}
            dataEl='inputFieldAddressName'
          />
          <InputField
            name='address1'
            value={state?.address1 || ''}
            onChange={onChangeAddressData}
            label={getText('po.address1')}
            helperText={errors['address1'] || getText('po.required')}
            error={!!errors['address1']}
            dataEl='inputFieldAddress1'
          />
          <InputField
            name='address2'
            value={state?.address2 || ''}
            onChange={onChangeAddressData}
            label={getText('po.address2')}
            dataEl='inputFieldAddress2'
          />
          <InputField
            name='city'
            value={state?.city || ''}
            onChange={onChangeAddressData}
            label={getText('po.city')}
            helperText={errors['city'] || getText('po.required')}
            error={!!errors['city']}
            dataEl='inputFieldCity'
          />
          <InputField
            name='stateProvince'
            value={state?.stateProvince || ''}
            onChange={onChangeAddressData}
            label={getText('po.stateProvince')}
            helperText={errors['stateProvince'] || getText('po.required')}
            error={!!errors['stateProvince']}
            dataEl='inputFieldStateProvince'
          />
          <InputField
            name='postalCode'
            value={state?.postalCode || ''}
            onChange={onChangeAddressData}
            label={getText('po.zipCodePostalCode')}
            helperText={errors['postalCode'] || getText('po.required')}
            error={!!errors['postalCode']}
            dataEl='inputFieldPostalCode'
          />
          <InputField
            name='country'
            value={state?.country || ''}
            onChange={onChangeAddressData}
            label={getText('po.country')}
            helperText={errors['countryId'] || getText('po.required')}
            error={!!errors['countryId']}
            dataEl='inputFieldCountry'
          />

          <ToolBar>
            <Content mt={16} />
            <ToolBarItem toTheRight>
              <Button
                dataEl='buttonCancel'
                text={getText('generic.cancel')}
                variant='default'
                onClick={() => onCancelNewAddress()}
              />
            </ToolBarItem>
            <ToolBarItem>
              <Button
                variant='success'
                text={getText('generic.save')}
                onClick={() => onSaveNewAddress({ id: state?.id })}
                dataEl='buttonSave'
              />
            </ToolBarItem>
          </ToolBar>
        </Content>
      </AddressesDrawer>
    </>
  );
});

PurchaseOrderAddEditAddress.displayName = 'PurchaseOrderAddEditAddress';
