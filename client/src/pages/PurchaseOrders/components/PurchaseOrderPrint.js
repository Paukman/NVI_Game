import React, { useContext } from 'react';
import { Content, Grid, GridItem } from 'mdo-react-components';

import { ViewContainer, TextStyle, PreWrap } from '../styled';
import { PurchaseOrderViewItemRow } from './PurchaseOrderViewItemRow';
import { PurchaseOrderContext } from '../../../providers/PurchaseOrderProvider';
import { getText } from '../../../utils/localesHelpers';
import { formatPrice } from '../../../utils/formatHelpers';

export const PurchaseOrderPrint = () => {
  // no need to pass anything to the component, it should be available from context
  const { view } = useContext(PurchaseOrderContext);
  const { viewState } = view;
  const { data: state } = viewState;

  return (
    <>
      {state ? (
        <ViewContainer showReceivedAlert={state?.poReceivedAt ? true : false}>
          <Content pt={80} pb={80} pl={75} pr={75}>
            <Grid container spacing={10} justify='center' alignItems='stretch' direction='row'>
              <GridItem xs={6}>
                <Content pr={40}>
                  <TextStyle fontSize='24px'>{getText('po.purchaseOrder')}</TextStyle>
                </Content>
              </GridItem>
              <GridItem xs={3}>
                <Content pl={40}>
                  <TextStyle lineHeight='20px' fontWeight='bold'>
                    <div>{getText('po.poNumber')}</div>
                    <div>{getText('po.poDate')}</div>
                    <div>{getText('po.poType')}</div>
                    <div>{getText('po.department')}</div>
                    <div>{getText('po.createdBy')}</div>
                  </TextStyle>
                </Content>
              </GridItem>
              <GridItem xs={3}>
                <Content ml={-40}>
                  <TextStyle lineHeight='20px'>
                    {state?.poNumber ? <div>{state.poNumber}</div> : <br></br>}
                    {state?.date ? <div>{state.date}</div> : <br></br>}
                    {state?.poType ? <div>{state.poType}</div> : <br></br>}
                    {state?.departmentName ? <div>{state.departmentName}</div> : <br></br>}
                    {state?.userCreated?.displayName ? <div>{state.userCreated.displayName}</div> : <br></br>}
                  </TextStyle>
                </Content>
              </GridItem>
            </Grid>
            <Grid container spacing={10} justify='center' alignItems='stretch' direction='row'>
              <GridItem xs={6}>
                <Content pr={40}>
                  <TextStyle fontSize='16px' fontWeight='600'>
                    {getText('po.shipTo')}
                  </TextStyle>
                  <hr />
                  <PreWrap>{state.hotel?.hotelName}</PreWrap>
                  <div>{state?.shipToAttention}</div>
                  <PreWrap>{state?.shipToAddressCalc}</PreWrap>
                </Content>
              </GridItem>
              <GridItem xs={6}>
                <Content pl={40}>
                  <TextStyle fontSize='16px' fontWeight='600'>
                    {getText('po.vendor')}
                  </TextStyle>
                  <hr />
                  <PreWrap>{state?.vendor?.companyName}</PreWrap>
                  <div>{state?.vendorToAttention}</div>
                  <PreWrap>{state?.vendorAddressCalc}</PreWrap>
                </Content>
              </GridItem>
            </Grid>
            <div>
              <Content mt={24} />
              <TextStyle fontSize='16px' fontWeight='600'>
                {getText('po.poTerms')}
              </TextStyle>
              <hr />
            </div>
            <TextStyle lineHeight='22px'>
              <Grid container spacing={10} justify='center' alignItems='stretch' direction='row'>
                <GridItem xs={3}>
                  <TextStyle fontWeight='bold'> {getText('po.deliverBy')}</TextStyle>
                  <div>{state?.requiredBy || ''}</div>
                </GridItem>
                <GridItem xs={3}>
                  <TextStyle fontWeight='bold'>{getText('po.fob')}</TextStyle>
                  <div>{state?.fob || ''}</div>
                </GridItem>
                <GridItem xs={3}>
                  <TextStyle fontWeight='bold'>{getText('po.shipVia')}</TextStyle>
                  <div>{state?.shipVia || ''}</div>
                </GridItem>
                <GridItem xs={3}>
                  <TextStyle fontWeight='bold'>{getText('po.terms')}</TextStyle>
                  <div>{state?.terms || ''}</div>
                </GridItem>
              </Grid>
            </TextStyle>
            <div>
              <Content mt={24} />
              <TextStyle fontSize='16px' fontWeight='600'>
                {getText('po.poItems')}
              </TextStyle>
              <hr />
            </div>
            <TextStyle fontSize='12px' fontWeight='bold'>
              <PurchaseOrderViewItemRow
                itemNumber={getText('po.itemNo')}
                itemDescription={getText('po.description')}
                hmgGlCode={getText('po.glCode')}
                unitOfMeasure={getText('po.unit')}
                unitPrice={getText('po.unitPrice')}
                quantity={getText('po.quantity')}
                total={<TextStyle textAlign='end'>{getText('po.total')}</TextStyle>}
              />
            </TextStyle>
            <Content mb={8} />

            {state?.purchaseOrderItems &&
              state.purchaseOrderItems.map((poItem, index) => {
                return (
                  <div key={poItem.id}>
                    <TextStyle fontSize='12px'>
                      <PurchaseOrderViewItemRow
                        no={index + 1}
                        itemNumber={poItem.itemNumber}
                        itemDescription={poItem.itemDescription}
                        hmgGlCode={poItem.hmgGlCode}
                        unitOfMeasure={poItem.unitOfMeasure}
                        unitPrice={poItem.unitPrice}
                        quantity={poItem.quantity}
                        total={<TextStyle textAlign='end'>{poItem.total}</TextStyle>}
                      />
                    </TextStyle>
                  </div>
                );
              })}

            <Content mt={20} />
            <Grid container spacing={10} justify='center' alignItems='stretch' direction='row'>
              <GridItem xs={8}>
                {state?.comment && (
                  <>
                    <Content mt={70}>
                      <TextStyle fontWeight='bold' lineHeight='32px'>
                        {getText('po.comment')}
                      </TextStyle>
                    </Content>
                    <div>{state?.comment}</div>
                  </>
                )}
              </GridItem>
              <GridItem xs={2}>
                <TextStyle lineHeight='32px'>
                  <div>{getText('po.subTotal')}</div>
                  <div>{getText('po.shipping')}</div>
                  <div>{getText('po.saleTax')}</div>
                  <TextStyle fontWeight='bold'>{getText('po.totalCaps')}</TextStyle>
                </TextStyle>
              </GridItem>
              <GridItem xs={2}>
                <TextStyle lineHeight='32px' textAlign='end'>
                  {state?.subtotal ? <div>{formatPrice(state.subtotal)}</div> : <div>0.00</div>}
                  {state?.shippingAmount ? <div>{formatPrice(state.shippingAmount)}</div> : <div>0.00</div>}
                  {state?.taxAmount ? <div>{formatPrice(state.taxAmount)}</div> : <div>0.00</div>}
                  <TextStyle fontWeight='bold'>{formatPrice(state.total)}</TextStyle>
                </TextStyle>
              </GridItem>
            </Grid>
          </Content>
        </ViewContainer>
      ) : null}
    </>
  );
};
