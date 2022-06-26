import React, { memo } from 'react';
import { Label, colors } from 'mdo-react-components';
import { GenericSelector } from 'components';
import { useMasterDecimalSelector } from '../hooks';
import { MASTER_DECIMAL_VALUES } from '../constants';
import { getText } from 'utils';

const MasterDecimalSelector = memo((props) => {
  const { widget, onDashboardGet, slug } = props;
  const { state, onHanldeDecimalValueChange } = useMasterDecimalSelector(widget, onDashboardGet, slug);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
      <Label label={getText('generic.decimals')} style={{ paddingRight: '10px' }} fontSize={12} color={colors.grey} />
      <GenericSelector
        width={50}
        selection={MASTER_DECIMAL_VALUES}
        value={state.valueDecimals}
        onChange={onHanldeDecimalValueChange}
        name='selectorDecimalValue'
        selectFontSize={14}
      />
    </div>
  );
});

MasterDecimalSelector.displayName = 'MasterDecimalSelector';

export { MasterDecimalSelector };
