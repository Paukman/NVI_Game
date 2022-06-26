import React, { memo, Fragment, useCallback, useContext, useEffect, useState, useRef } from 'react';
//import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import {
  Grid,
  GridItem,
  ToolBar,
  ToolBarItem,
  InputField,
  Button,
  FormState,
  InputDate,
  Typography,
} from 'mdo-react-components';

import {
  KpiAggregatorButtonDropdown,
  KpiOperandButtonDropdown,
  FormContainer,
  Form,
  DisplayApiErrors,
  SuccessMessage,
  MdoGlCodeButtonSideBar,
  KpiButtonSideBar,
  ButtonsCancelSave,
  DictionaryDropdown,
  PortfolioSelector,
  KpiDropdown,
  PeriodSelector,
  ErrorMessage,
  Selector,
} from '../../components';
import { getText } from '../../utils/localesHelpers';
import { HmgGlCodeProvider } from '../../providers';
import { GlobalFilterContext, HotelContext } from '../../contexts';
import { useKpi } from '../../graphql/useKpi';
import logger from '../../utils/logger';
import { pick } from 'lodash';
import { timestampToShortLocal, valueConvertor } from 'utils';

const KpiLibraryTest = memo(() => {
  const { kpiCalculate, kpiCalculation, kpiCalculating } = useKpi();
  const { portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds } = useContext(HotelContext);
  const [state, setState] = useState({
    kpiId: '',
    date: new Date(Date.parse('2021-01-31T00:00:00Z')),
    period: 'MTD',
    valueDataType: 'ACTUAL',
    valueDateOffsetTypeId: 'THIS_YEAR',
    forecastBudgetNumber: 1,
    groupDataBy: '',
  });

  const handleSubmit = useCallback(
    (formData) => {
      const params = {
        ...formData,
        forecastBudgetNumber: Number(formData.forecastBudgetNumber),
        hotelId: getPortfolioHotelIds(portfolio),
      };
      logger.debug('Calculate KPI:', { params });
      kpiCalculate(params);
    },
    [portfolio, getPortfolioHotelIds, kpiCalculate],
  );

  const handleChangePortfolio = (name, value) => {
    logger.debug('Portfolio changed:', value);
    selectPortfolio(value);
  };

  const resultValue = kpiCalculation.data && Array.isArray(kpiCalculation.data.value) ? kpiCalculation.data.value : [];

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            variant='tertiary'
            onClick={() => {
              goBack();
            }}
            dataEl='buttonClose'
          />
        </ToolBarItem>
      </ToolBar>
      <FormState data={state} onSubmit={handleSubmit}>
        {({ data, handleChange, submit }) => {
          return (
            <FormContainer>
              <Form>
                <Grid spacing={3}>
                  <GridItem xs={12}>
                    <PortfolioSelector
                      required
                      name='portfolio'
                      onChange={handleChangePortfolio}
                      value={portfolio}
                      disableClearable
                      allowAllGroups
                      allowAllHotels
                    />
                    {kpiCalculation.errorsMap['hotelId'] && (
                      <ErrorMessage>{kpiCalculation.errorsMap['hotelId']}</ErrorMessage>
                    )}
                  </GridItem>
                  <GridItem xs={12}>
                    <KpiDropdown
                      label={getText('selectors.kpi.title')}
                      name='kpiId'
                      value={data.kpiId}
                      onChange={handleChange}
                    />
                    {kpiCalculation.errorsMap['kpiId'] && (
                      <ErrorMessage>{kpiCalculation.errorsMap['kpiId']}</ErrorMessage>
                    )}
                  </GridItem>
                  <GridItem xs={12}>
                    <InputDate
                      required
                      name='date'
                      label={getText('generic.date')}
                      onChange={handleChange}
                      value={data.date}
                      error={!!kpiCalculation.errorsMap['date']}
                      helperText={kpiCalculation.errorsMap['date']}
                      dataEl='inputDate'
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <PeriodSelector
                      required
                      name='period'
                      label={getText('generic.period')}
                      periods={['CURRENT', 'WTD', 'WEEK', 'MTD', 'MONTH', 'QTD', 'QUARTER', 'YTD', 'YEAR']}
                      onChange={handleChange}
                      value={data.period}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <DictionaryDropdown
                      required
                      name='valueDataType'
                      label={getText('selectors.valueDataType.title')}
                      onChange={handleChange}
                      value={data.valueDataType}
                      dictionaryType='value-data-type'
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <DictionaryDropdown
                      required
                      name='valueDateOffsetTypeId'
                      label={getText('selectors.dateOffsetType.title')}
                      onChange={handleChange}
                      value={data.valueDateOffsetTypeId}
                      dictionaryType='widget-value-date-offset-type'
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <InputField
                      name='forecastBudgetNumber'
                      label={getText('generic.forecastBudgetNumber')}
                      onChange={handleChange}
                      value={data.forecastBudgetNumber}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <Selector
                      name='groupDataBy'
                      label={getText('generic.groupDataBy')}
                      onChange={handleChange}
                      value={data.groupDataBy}
                      options={[
                        {
                          label: 'None',
                          value: '',
                        },
                        {
                          label: 'Date',
                          value: 'date',
                        },
                        {
                          label: 'Hotel',
                          value: 'hotelId',
                        },
                      ]}
                    />
                  </GridItem>
                  {kpiCalculation.errors.length > 0 && (
                    <GridItem xs={12}>
                      <DisplayApiErrors errors={kpiCalculation.errors} genericOnlyErrors />
                    </GridItem>
                  )}
                  {resultValue.map((value, idx) => {
                    return (
                      <GridItem xs={12} key={idx}>
                        <Typography variant='h5'>Result</Typography>
                        {value.date && (
                          <div>
                            <Typography variant='p'>
                              Date: {timestampToShortLocal({ timestamp: value.date })}
                            </Typography>
                          </div>
                        )}
                        {value.hotel?.hotelName && (
                          <div>
                            <Typography variant='p'>Hotel: {value.hotel?.hotelName}</Typography>
                          </div>
                        )}
                        <div>
                          <Typography variant='p'>Value: {valueConvertor(value.value, value.valueTypeId)}</Typography>
                        </div>
                      </GridItem>
                    );
                  })}
                  <GridItem xs={12}>
                    <Button text={getText('generic.calculate')} inProgress={kpiCalculating} onClick={() => submit()} />
                  </GridItem>
                </Grid>
              </Form>
            </FormContainer>
          );
        }}
      </FormState>
    </Fragment>
  );
});

KpiLibraryTest.displayName = 'KpiLibraryTest';

export { KpiLibraryTest };
