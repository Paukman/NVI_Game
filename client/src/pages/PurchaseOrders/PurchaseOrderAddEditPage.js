import React, { memo, useContext } from 'react';

import {
  Content,
  Button,
  Grid,
  GridItem,
  InputField,
  SearchableDropdown,
  InputDate,
  LinkActions,
  Drawer,
  ToolBarItem,
  ToolBar,
} from 'mdo-react-components';

import { getText } from 'utils/localesHelpers';
import { PurchaseOrderContext } from 'providers/PurchaseOrderProvider';
import { PurchaseOrderAddEditItem, PurchaseOrderTotalsFooterRow, PurchaseOrderAddressMenu } from './components';
import { POTypeDropdown, HotelSelector } from 'components';
import { HmgGlCodeProvider } from 'providers';
import { alternateAddress, addEditMode } from './constants';

import {
  POCardHeaderStyle,
  POAddressPlaceholderStyle,
  ShippingAddressStyle,
  TextStyle,
  colors,
  EditFooterHeight,
} from './styled';

const PurchaseOrderAddEditPage = memo(() => {
  // use provider, not directly from the hook
  const { addEdit } = useContext(PurchaseOrderContext);
  const {
    addEditState,
    onSaveUpdatePurchaseOrder,
    onChangePOItem,
    onChange,
    addPoItem,
    deletePOItem,
    updateTotals,
    onShipToPropertyNameChange,
    onVendorChange,
    onCancelPurchaseOrder,
    onSelectHotelAlternateAddress,
    onSelectVendorAlternateAddress,
    closeDrawer,
    onDateUpdate,
    onCreateNewVendorAddress,
  } = addEdit;

  const { data: state, errors } = addEditState;

  return (
    <HmgGlCodeProvider>
      <Grid container spacing={6} justify='center' alignItems='stretch' direction='row'>
        <GridItem xs={12} sm={6} md={4}>
          <POCardHeaderStyle>{getText('po.shipTo')}</POCardHeaderStyle>
          <HotelSelector
            name='hotelId'
            value={state?.hotelId || ''}
            onChange={onShipToPropertyNameChange}
            errorMsg={errors['hotelId']}
          />
          <Content mb={8} />
          <InputField
            name='shipToAttention'
            value={state?.shipToAttention || ''}
            onChange={onChange}
            label={getText('po.attention')}
            dataEl='inputFieldShipToAttention'
          />

          <Grid container direction='row' spacing={1} justify='space-between'>
            <GridItem xs={6}>
              <Content mt={16} />
              {state?.shipToAddressFormatted ? (
                <ShippingAddressStyle>{state?.shipToAddressFormatted || ''}</ShippingAddressStyle>
              ) : (
                <POAddressPlaceholderStyle>{getText('po.addressPlaceholder')}</POAddressPlaceholderStyle>
              )}
            </GridItem>
            <TextStyle>
              <GridItem xs={6}>
                <Content mt={24} />
                <Content mr={-8}>
                  {state?.shipToAddressFormatted && (
                    <LinkActions
                      hasFont
                      items={[
                        {
                          clickId: 'comments',
                          text: getText('po.useAlternateAddress'),
                          color: colors.linkBlue,
                        },
                      ]}
                      onClick={() => {
                        onSelectHotelAlternateAddress(alternateAddress.hotel);
                      }}
                      dataEl='linkActionsShipToUseAlternateAddress'
                    />
                  )}
                </Content>
              </GridItem>
            </TextStyle>
          </Grid>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <POCardHeaderStyle>{getText('po.vendor')}</POCardHeaderStyle>
          <SearchableDropdown
            label={getText('po.vendor')}
            name='vendorId'
            items={addEditState?.vendorsMapped || []}
            value={state?.vendorId || null}
            onChange={onVendorChange}
            error={!!errors['vendorId']}
            helperText={errors['vendorId']}
            dataEl='searchableDropdownVendor'
          />
          <Content mb={8} />
          <InputField
            name='vendorToAttention'
            value={state?.vendorToAttention || ''}
            onChange={onChange}
            label={getText('po.attention')}
            dataEl='inputFieldVendorToAttention'
          />

          <Grid container direction='row' spacing={1} justify='space-between'>
            <GridItem xs={6}>
              <Content mt={16} />
              {state?.vendorAddressFormatted ? (
                <ShippingAddressStyle>{state?.vendorAddressFormatted || ''}</ShippingAddressStyle>
              ) : (
                <POAddressPlaceholderStyle>{getText('po.addressPlaceholder')}</POAddressPlaceholderStyle>
              )}
            </GridItem>
            <TextStyle>
              <GridItem xs={6}>
                <Content mt={24} />
                <Content mr={-8}>
                  {state?.vendorAddressFormatted && (
                    <LinkActions
                      hasFont
                      items={[
                        {
                          clickId: 'comments',
                          text: getText('po.useAlternateAddress'),
                          color: colors.linkBlue,
                        },
                      ]}
                      onClick={() => {
                        onSelectVendorAlternateAddress(alternateAddress.vendor);
                      }}
                      dataEl='linkActionsVendorUseAlternateAddress'
                    />
                  )}
                  {!state?.vendorAddressFormatted && state?.vendorId && (
                    <LinkActions
                      hasFont
                      items={[
                        {
                          clickId: 'comments',
                          text: getText('po.createNewAddress'),
                          color: colors.linkBlue,
                        },
                      ]}
                      onClick={() => {
                        onCreateNewVendorAddress(alternateAddress.hotel);
                      }}
                      dataEl='linkActionsCreateNewAddress'
                    />
                  )}
                </Content>
              </GridItem>
            </TextStyle>
          </Grid>
        </GridItem>
      </Grid>
      <Grid container spacing={6} justify='center' alignItems='stretch' direction='row'>
        <GridItem xs={12} sm={6} md={4}>
          <POCardHeaderStyle>{getText('po.poDetails')}</POCardHeaderStyle>
          <InputDate
            label={getText('po.date')}
            name='date'
            value={state?.date || ''}
            onChange={onDateUpdate}
            required
            disablePast={addEditState?.addEditMode === addEditMode.ADD}
            error={!!errors['date']}
            helperText={errors['date']}
            errorMsg={getText('generic.dateErrorText')}
            dataEl='inputDate'
          />
          <Content mb={8} />
          <POTypeDropdown
            label={`${getText('po.poTypes')} *`}
            value={state?.poTypeId?.toString() || ''}
            name='poTypeId'
            onChange={onChange}
            error={!!errors['poTypeId']}
            helperText={errors['poTypeId']}
            dataEl='poTypeDropdown'
          />
          <Content mb={8} />
          <SearchableDropdown
            label={getText('po.department')}
            name='departmentId'
            items={addEditState?.departmentsMapped || []}
            value={state?.departmentId || null}
            onChange={onChange}
            dataEl='searchableDropdownDepartment'
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <POCardHeaderStyle>{getText('po.poTerms')}</POCardHeaderStyle>
          <div>
            <InputDate
              label={getText('po.deliverBy')}
              name='requiredBy'
              value={state?.requiredBy || ''}
              onChange={onDateUpdate}
              required
              disablePast={addEditState?.addEditMode === addEditMode.ADD}
              error={!!errors['requiredBy']}
              helperText={errors['requiredBy']}
              errorMsg={getText('generic.dateErrorText')}
              dataEl='inputDateDeliverBy'
            />
          </div>
          <Content mb={8} />
          <InputField name='fob' value={state?.fob || ''} onChange={onChange} label={getText('po.fob')} />
          <Grid container direction='row' spacing={2} justify='flex-start' alignItems='center'>
            <GridItem xs={6}>
              <Content mb={8} />
              <InputField
                name='shipVia'
                value={state?.shipVia || ''}
                onChange={onChange}
                label={getText('po.shipVia')}
                dataEl='inputFieldShipVia'
              />
            </GridItem>
            <GridItem xs={6}>
              <Content mb={8} />
              <InputField
                dataEl='inputFieldTerms'
                name='terms'
                value={state?.terms || ''}
                onChange={onChange}
                label={getText('po.terms')}
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <Grid container spacing={6} justify='center' alignItems='stretch' direction='row'>
        <GridItem xs={12} md={8}>
          <POCardHeaderStyle>{getText('po.poItems')}</POCardHeaderStyle>
          <TextStyle color={colors.darkGrey}>
            <Content mb={20}>
              <PurchaseOrderAddEditItem
                purchaseOrderItems={state?.purchaseOrderItems}
                deletePOItem={deletePOItem}
                onChangePOItem={onChangePOItem}
              />
            </Content>
          </TextStyle>
        </GridItem>
      </Grid>
      <Content mt={24} />

      <Grid container spacing={6} justify='center' alignItems='stretch' direction='row'>
        <GridItem xs={12} md={8}>
          <TextStyle color={colors.darkGrey}>
            <PurchaseOrderTotalsFooterRow
              leftItem={
                <Content ml={-16}>
                  <Button
                    text='Add Row'
                    iconName='Add'
                    variant='tertiary'
                    onClick={() => {
                      addPoItem();
                    }}
                    dataEl='buttonAddRow'
                  />
                </Content>
              }
              rightItem3={
                <TextStyle fontSize='12px' fontWeight='600' lineHeight='24px'>
                  {getText('po.subTotal')}
                </TextStyle>
              }
              rightItem4={<TextStyle textAlign='end'>{state?.subtotal || ''}</TextStyle>}
            />
            <PurchaseOrderTotalsFooterRow
              rightItem3={
                <TextStyle fontSize='12px' fontWeight='600' lineHeight='24px'>
                  {getText('po.shipping')}
                </TextStyle>
              }
              rightItem4={
                <>
                  <Content mb={-16} />
                  <InputField
                    name='shippingAmount'
                    value={state?.shippingAmount || ''}
                    onChange={updateTotals}
                    inputProps={{ style: { textAlign: 'end' } }}
                    dataEl='inputFieldShippingAmount'
                  />
                </>
              }
            />
            <Content mt={12} />
            <PurchaseOrderTotalsFooterRow
              rightItem1={
                <TextStyle fontSize='12px' fontWeight='600' lineHeight='24px'>
                  {getText('po.taxRate')}
                </TextStyle>
              }
              rightItem2={
                <>
                  <Content mb={-32} />
                  <InputField
                    label={getText('po.enterPercent')}
                    name='taxPercentage'
                    value={state?.taxPercentage || ''}
                    onChange={updateTotals}
                    inputProps={{ style: { textAlign: 'end' } }}
                    dataEl='inputFieldTaxPercentage'
                  />
                </>
              }
              rightItem3={
                <TextStyle fontSize='12px' fontWeight='600'>
                  {getText('po.saleTax')}
                </TextStyle>
              }
              rightItem4={
                <>
                  <Content mb={-16} />
                  <InputField
                    name='taxAmount'
                    value={state?.taxAmount || ''}
                    onChange={updateTotals}
                    inputProps={{ style: { textAlign: 'end' } }}
                    dataEl='inputFieldTaxAmount'
                  />
                </>
              }
            />
            <Content mt={8} />
            <PurchaseOrderTotalsFooterRow
              leftItem={
                <>
                  <Content mb={-32} />
                  <InputField
                    label={getText('po.comment')}
                    name='comment'
                    value={state?.comment || ''}
                    onChange={onChange}
                    dataEl='inputFieldComment'
                  />
                </>
              }
              rightItem3={
                <TextStyle fontSize='12px' fontWeight='600' lineHeight='24px'>
                  {getText('po.totalCaps')}
                </TextStyle>
              }
              rightItem4={<TextStyle textAlign='end'>{state?.total || ''}</TextStyle>}
            />
          </TextStyle>
        </GridItem>
      </Grid>

      <Content mb={100} />

      <Drawer open={true} anchor='bottom' variant='persistent'>
        <EditFooterHeight>
          <Content mt={10} />
          <ToolBar>
            <ToolBarItem toTheRight>
              <Button
                dataEl='buttonCancel'
                text={getText('generic.cancel')}
                variant='default'
                onClick={() => onCancelPurchaseOrder()}
              />
            </ToolBarItem>
            <ToolBarItem>
              <Button
                variant='success'
                text={
                  addEditState?.addEditMode === addEditMode.EDIT ? getText('generic.update') : getText('generic.save')
                }
                onClick={() => onSaveUpdatePurchaseOrder()}
                dataEl='buttonUpdateSave'
              />
            </ToolBarItem>
            <ToolBarItem>
              <Content mr={50} />
            </ToolBarItem>
          </ToolBar>
        </EditFooterHeight>
      </Drawer>

      <Drawer
        open={addEditState.showHotelAddressDrawer || addEditState.showVendorAddressDrawer}
        onClose={() => closeDrawer()}
        anchor='right'
      >
        <PurchaseOrderAddressMenu />
      </Drawer>
    </HmgGlCodeProvider>
  );
});

PurchaseOrderAddEditPage.displayName = 'PurchaseOrderAddEditPage';

export { PurchaseOrderAddEditPage };
