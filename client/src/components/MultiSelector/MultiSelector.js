import React, { memo, useState, useEffect } from 'react';
import { Checkbox, Search, Chip, Button } from 'mdo-react-components';
import { Wrapper, LeftWrapper, RightWrapper, CheckboxWrapper, ButtonWrapper } from './styled';
import { useMultiSelector } from './useMultiSelector';
import { getText } from 'utils';

const MultiSelector = memo((props) => {
  const { data, selectedData, onSave, onCancel, inProgress, canSave } = props;

  const { state, onDelete, onSelectAll, onSearch, onListSelect } = useMultiSelector(data, selectedData);

  return (
    <>
      <Wrapper>
        <LeftWrapper>
          <Search value={state.searchValue} onChange={onSearch} />
          <CheckboxWrapper>
            <Checkbox label={getText('generic.selectAll')} checked={state.allActive} onChange={onSelectAll} />
            <ul>
              {state?.searchData?.map(({ value, label }, idx) => (
                <li key={idx}>
                  <Checkbox id={value} label={label} checked={state.active[value] === true} onChange={onListSelect} />
                </li>
              ))}
            </ul>
          </CheckboxWrapper>
        </LeftWrapper>
        <RightWrapper>
          <ul>
            {state?.selectedList?.map(({ value, label }, idx) => (
              <li key={idx}>
                <Chip onDelete={() => onDelete(value)} label={label} />
              </li>
            ))}
          </ul>
        </RightWrapper>
      </Wrapper>
      <ButtonWrapper>
        <Button
          text={getText('generic.cancel')}
          variant='default'
          title={getText('generic.cancel')}
          onClick={onCancel}
        />
        <Button
          text={getText('generic.upload')}
          title={getText('generic.upload')}
          variant='success'
          iconName={inProgress ? 'MoreHoriz' : ''}
          onClick={() => onSave(state.selectedList)}
          inProgress={inProgress}
          disabled={!canSave || !state.selectedList.length > 0}
        />
      </ButtonWrapper>
    </>
  );
});

MultiSelector.displayName = 'MultiSelector';

export { MultiSelector };
