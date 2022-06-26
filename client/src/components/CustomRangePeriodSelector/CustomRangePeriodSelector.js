import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PeriodSelector } from '../PeriodSelector';
import { InputDate } from 'mdo-react-components';
import { getText } from 'utils';
import { useCustomRangePeriodSelector } from './useCustomRangePeriodSelector';
import { Container, PeriodStyling, StartDateStyling, EndDateStyling } from './styled';

const CustomRangePeriodSelector = memo((props) => {
  const {
    value,
    onChange,
    rangeSelectionTrigger,
    name,
    inputDateFontSize,
    inputDateLabelSize,
    inputDateIconSize,
    inputDateIconPadding,
    returnValueAsObject = true,
    dateWidth,
    startDate,
    endDate,
    date,
  } = props;
  const { state, onChangeCustomPeriodRange } = useCustomRangePeriodSelector(
    value,
    onChange,
    name,
    returnValueAsObject,
    startDate,
    endDate,
    date,
  );

  return (
    <>
      <Container>
        <PeriodStyling {...props}>
          <PeriodSelector {...props} value={state?.period} onChange={onChangeCustomPeriodRange} />
        </PeriodStyling>
        {(state?.period === rangeSelectionTrigger || (!returnValueAsObject && value === rangeSelectionTrigger)) && (
          <>
            <StartDateStyling {...props}>
              <InputDate
                dataEl='inputDateStartDate'
                label={getText('generic.fromDate')}
                name='startDate'
                onChange={onChangeCustomPeriodRange}
                value={state.startDate}
                fontSize={inputDateFontSize}
                labelSize={inputDateLabelSize}
                iconSize={inputDateIconSize}
                iconPadding={inputDateIconPadding}
                width={dateWidth}
              />
            </StartDateStyling>
            <EndDateStyling {...props}>
              <InputDate
                dataEl='inputDateEndDate'
                label={getText('generic.toDate')}
                name='endDate'
                onChange={onChangeCustomPeriodRange}
                value={state.endDate}
                fontSize={inputDateFontSize}
                labelSize={inputDateLabelSize}
                iconSize={inputDateIconSize}
                iconPadding={inputDateIconPadding}
                width={dateWidth}
              />
            </EndDateStyling>
          </>
        )}
      </Container>
    </>
  );
});

CustomRangePeriodSelector.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  rangeSelectionTrigger: PropTypes.string,
  name: PropTypes.string,
  inputDateFontSize: PropTypes.number,
  inputDateLabelSize: PropTypes.number,
  inputDateIconSize: PropTypes.number,
  inputDateIconPadding: PropTypes.number,
  returnValueAsObject: PropTypes.bool,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  date: PropTypes.any,
};

CustomRangePeriodSelector.defaultProps = {
  inputDateFontSize: 16,
  inputDateLabelSize: 16,
  inputDateIconSize: 24,
  inputDateIconPadding: 0,
  returnValueAsObject: true,
};

CustomRangePeriodSelector.displayName = 'CustomRangePeriodSelector';

export { CustomRangePeriodSelector };
