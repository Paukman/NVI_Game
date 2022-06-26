import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from 'mdo-react-components';

export const PurchaseOrderTotalsFooterRow = memo((props) => {
  PurchaseOrderTotalsFooterRow.propTypes = {
    leftItem: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
    rightItem1: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
    rightItem2: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
    rightItem3: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
    rightItem4: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
  };
  const { leftItem, rightItem1, rightItem2, rightItem3, rightItem4 } = props;
  return (
    <>
      <Grid container spacing={1}>
        <GridItem xs={12} sm={7} md={6}>
          {leftItem || null}
        </GridItem>
        <GridItem xs={12} sm={5} md={6}>
          <Grid container spacing={1}>
            <GridItem xs={12}>
              <Grid container spacing={1}>
                <GridItem xs={2}>{rightItem1 || null}</GridItem>
                <GridItem xs={3}>{rightItem2 || null}</GridItem>
                <GridItem xs={1} />
                <GridItem xs={3}>{rightItem3 || null}</GridItem>
                <GridItem xs={3}>{rightItem4 || null}</GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
});

PurchaseOrderTotalsFooterRow.displayName = 'PurchaseOrderTotalsFooterRow';
