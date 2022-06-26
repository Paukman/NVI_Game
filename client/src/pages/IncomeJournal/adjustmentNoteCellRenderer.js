import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { InputField, Icon } from 'mdo-react-components';
import { DeleteRow } from './styled';

const AdjustmentNoteAmountCellRenderer = ({
  value,
  dataRow,
  isIncomeJournalSummaryLockSet,
  onChangeAdjustmentNote,
  onDeleteRow,
}) => {
  if (isIncomeJournalSummaryLockSet || dataRow.subLevelHeaders) {
    return (
      <DeleteRow>
        <span>{value && value ? value : ''}</span>
        {!isIncomeJournalSummaryLockSet && dataRow.canRemove && (
          <span onClick={() => onDeleteRow(dataRow.id)}>
            <Icon name='DeleteOutline' color='#697177' size='20' />
          </span>
        )}
      </DeleteRow>
    );
  } else {
    return (
      <DeleteRow>
        <InputField
          name='adjustmentNote'
          value={(value && value) || ''}
          onInput={(e) => {
            e.target.value = e.target.value.slice(0, 200);
          }}
          inputProps={{ style: { textAlign: 'center', fontSize: '12px', fontWeight: 300 } }}
          onChange={(name, value) => onChangeAdjustmentNote(name, value, dataRow)}
          onBlur={(e) => onChangeAdjustmentNote(name, e.target.value, dataRow, 'triggered')}
          // label={}
        />
        {!isIncomeJournalSummaryLockSet && dataRow.canRemove && (
          <span onClick={() => onDeleteRow(dataRow.id)}>
            <Icon name='DeleteOutline' color='#697177' size='20' />
          </span>
        )}
      </DeleteRow>
    );
  }
};

AdjustmentNoteAmountCellRenderer.displayName = 'AdjustmentNoteAmountCellRenderer';

AdjustmentNoteAmountCellRenderer.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
  isIncomeJournalSummaryLockSet: PropTypes.any,
  onChangeAdjustmentNote: PropTypes.any,
  onDeleteRow: PropTypes.any,
};

export { AdjustmentNoteAmountCellRenderer };
