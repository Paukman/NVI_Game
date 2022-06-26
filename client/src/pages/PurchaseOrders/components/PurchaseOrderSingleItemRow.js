import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Grid, GridItem, Content } from 'mdo-react-components';

export const PurchaseOrderSingleItemRow = memo((props) => {
  PurchaseOrderSingleItemRow.propTypes = {
    no: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
    itemNumber: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    itemDescription: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    hmgGlCode: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
    unitOfMeasure: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    unitPrice: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    quantity: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
    total: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
    deleteButton: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };
  const { no, itemNumber, itemDescription, hmgGlCode, unitOfMeasure, unitPrice, quantity, total, deleteButton } = props;
  return (
    <>
      <Grid container spacing={1}>
        <GridItem xs={12} sm={7} md={6}>
          <Grid container spacing={1}>
            <GridItem xs={1}>{no || null}</GridItem>
            <GridItem xs={2}>{itemNumber || null}</GridItem>
            <GridItem xs={5}>{itemDescription || null}</GridItem>
            <GridItem xs={4}>{hmgGlCode || null}</GridItem>
          </Grid>
        </GridItem>
        <GridItem xs={12} sm={5} md={6}>
          <Grid container spacing={1}>
            <GridItem xs={11}>
              <Grid container spacing={1}>
                <GridItem xs={2}>{unitOfMeasure || null}</GridItem>
                <GridItem xs={3}>{unitPrice || null}</GridItem>
                <GridItem xs={3}>{quantity || null}</GridItem>
                <GridItem xs={4}>{total || null}</GridItem>
              </Grid>
            </GridItem>
            <GridItem xs={1}>
              <Content ml={-8}>
                <Grid container spacing={2} justify='flex-start' alignItems='flex-end'>
                  <GridItem xs={12}>{deleteButton || null}</GridItem>
                </Grid>
              </Content>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
});

PurchaseOrderSingleItemRow.displayName = 'PurchaseOrderSingleItemRow';
