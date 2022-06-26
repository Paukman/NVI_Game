import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from 'mdo-react-components';
import { TextStyle } from '../styled';

export const PurchaseOrderViewItemRow = memo((props) => {
  PurchaseOrderViewItemRow.propTypes = {
    no: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
    itemNumber: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    itemDescription: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    hmgGlCode: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
    unitOfMeasure: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    unitPrice: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
    quantity: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
    total: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  };
  const { no, itemNumber, itemDescription, hmgGlCode, unitOfMeasure, unitPrice, quantity, total } = props;
  return (
    <>
      <Grid container spacing={1}>
        <GridItem xs={7}>
          <Grid container spacing={1}>
            <GridItem xs={1}>{no || null}</GridItem>
            <GridItem xs={2}>{itemNumber || ''}</GridItem>
            <GridItem xs={5}>{itemDescription || ''}</GridItem>
            <GridItem xs={4}>{hmgGlCode || ''}</GridItem>
          </Grid>
        </GridItem>
        <GridItem xs={5}>
          <Grid container spacing={1}>
            <GridItem xs={3}>{unitOfMeasure || ''}</GridItem>
            <GridItem xs={3}>
              <TextStyle textAlign='end'>{unitPrice || ''}</TextStyle>
            </GridItem>
            <GridItem xs={3}>
              <TextStyle textAlign='end'>{quantity || ''}</TextStyle>
            </GridItem>
            <GridItem xs={3}>{total || ''}</GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
});

PurchaseOrderViewItemRow.displayName = 'PurchaseOrderViewItemRow';
