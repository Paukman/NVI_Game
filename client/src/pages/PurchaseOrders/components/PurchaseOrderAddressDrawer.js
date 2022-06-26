import React, { memo, useContext } from 'react';
import { Content, Grid, GridItem, Button, LinkActions, ToolBarItem, ToolBar } from 'mdo-react-components';

import { TextStyle, AddressesDrawer, colors } from '../styled';
import { getText } from '../../../utils/localesHelpers';
import { PurchaseOrderContext } from '../../../providers/PurchaseOrderProvider';

export const entity = {
  hotel: 'hotel',
  vendor: 'vendor',
};

// will be used both for vendors and hotels
export const PurchaseOrderAddressDrawer = memo(() => {
  const { addEdit } = useContext(PurchaseOrderContext);
  const {
    addEditState,
    editAddress,
    deleteAddress,
    addNewAddress,
    closeDrawer,
    onSelectedAddress,
    confirmDeleteAddress,
    cancelDeleteAddress,
  } = addEdit;
  const { currentAddress, otherAddresses, showDeleteAddressDialog } = addEditState;

  return (
    <>
      <AddressesDrawer>
        <Content pt={25} pb={0} pl={25} pr={30}>
          <Grid container spacing={2} justify='space-between' alignItems='flex-start' direction='row'>
            <GridItem xs={11}>
              <TextStyle fontSize='20px'>{getText('po.alternateAddress')}</TextStyle>
            </GridItem>
            <GridItem xs={1}>
              {!showDeleteAddressDialog && (
                <Button dataEl='buttonCancel' iconName='Close' variant='tertiary' onClick={() => closeDrawer()} />
              )}
            </GridItem>
          </Grid>

          {showDeleteAddressDialog ? (
            <>
              <Content pt={16}></Content>
              <TextStyle fontSize='16px' fontWeight='bold'>
                {getText('po.deleteAddress')}
              </TextStyle>

              <Content pt={8} />
              <TextStyle fontSize='14px'>{getText('po.cannotUndo')}</TextStyle>

              <Content pt={16} />
              <Content ml={-16}>
                <ToolBar>
                  <ToolBarItem>
                    <Button
                      dataEl='buttonCancelDelete'
                      text={getText('generic.cancel')}
                      variant='default'
                      onClick={() => cancelDeleteAddress()}
                    />
                  </ToolBarItem>
                  <ToolBarItem>
                    <Button
                      dataEl='buttonConfirmDelete'
                      variant='alert'
                      text={getText('generic.delete')}
                      onClick={() => confirmDeleteAddress()}
                    />
                  </ToolBarItem>
                </ToolBar>
              </Content>
            </>
          ) : (
            <>
              <Content pt={16}></Content>
              <TextStyle fontSize='12px' color={colors.addressFormColor}>
                <GridItem xs={12}>{getText('po.currentAddress')}</GridItem>
              </TextStyle>

              <Content pt={16}></Content>
              <Grid container spacing={2} justify='space-between' alignItems='flex-end' direction='row'>
                <GridItem xs={11}>
                  {!currentAddress ? (
                    <TextStyle fontSize='16px' color={colors.addressFormColor} textAlign='center'>
                      {getText('po.pleaseSelectAddress')}
                    </TextStyle>
                  ) : (
                    <TextStyle fontSize='14px' fontWeight='bold'>
                      <div>{currentAddress?.addressName}</div>
                      <div>{currentAddress?.formattedAddress}</div>
                    </TextStyle>
                  )}
                </GridItem>
                <GridItem xs={1}>
                  {currentAddress && !currentAddress?.notEditable && (
                    <Button
                      text=''
                      iconName='Edit'
                      variant='tertiary'
                      onClick={() => editAddress({ id: currentAddress?.id })}
                      dataEl='buttonEdit'
                    />
                  )}
                </GridItem>
              </Grid>

              <Content pt={48}></Content>
              <TextStyle fontSize='12px' color={colors.addressFormColor}>
                <GridItem xs={12}>{getText('po.chooseAlternate')}</GridItem>
              </TextStyle>

              {otherAddresses?.length > 0 &&
                otherAddresses.map((address, index) => {
                  return (
                    <div key={address.id}>
                      <Content mb={18}></Content>
                      <Grid container spacing={2} justify='space-between' alignItems='flex-end' direction='row'>
                        <GridItem xs={10}>
                          <TextStyle fontSize='14px' fontWeight='bold' lineHeight='24px'>
                            <LinkActions
                              hasFont
                              noPadding={true}
                              items={[
                                {
                                  clickId: address?.id,
                                  text: address?.addressName,
                                  color: 'black',
                                  fontSize: '14px',
                                  lineHeight: '22px',
                                },
                              ]}
                              onClick={() => onSelectedAddress({ id: address?.id })}
                              dataEl='likActionsAddress'
                            />
                          </TextStyle>
                          <TextStyle fontSize='14px' color='#2e2e2e'>
                            <div>{address?.formattedAddress}</div>
                          </TextStyle>
                        </GridItem>
                        <GridItem xs={1}>
                          {!address?.notEditable && (
                            <Button
                              text=''
                              iconName='Edit'
                              variant='tertiary'
                              onClick={() => editAddress({ id: address?.id })}
                              dataEl='buttonEdit'
                            />
                          )}
                        </GridItem>
                        <GridItem xs={1}>
                          {!address?.notEditable && (
                            <Button
                              iconName='Delete'
                              variant='tertiary'
                              onClick={() => deleteAddress({ id: address?.id })}
                              dataEl='buttonDelete'
                            />
                          )}
                        </GridItem>
                      </Grid>
                    </div>
                  );
                })}

              <Content mt={24} ml={-10}>
                <Button
                  dataEl='buttonAddNew'
                  iconName='Add'
                  text='Add New'
                  variant='tertiary'
                  onClick={() => addNewAddress()}
                />
              </Content>
            </>
          )}
        </Content>
      </AddressesDrawer>
    </>
  );
});

PurchaseOrderAddressDrawer.displayName = 'PurchaseOrderAddressDrawer';
