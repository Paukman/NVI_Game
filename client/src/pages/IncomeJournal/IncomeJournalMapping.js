import React, { memo, Fragment, useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { ToastContext } from 'components/Toast';

import {
  Drawer,
  Button,
  ToolBar,
  ToolBarItem,
  InputDate,
  ButtonDownloadAs,
  Search,
  ButtonFilter,
} from 'mdo-react-components';

import { mappingReportColumnsConfig } from './mappingReportColumnsConfig';

import {
  HotelSelector,
  DataLoading,
  DisplayApiErrors,
  DisplayNoData,
  IJPeriodSelector,
  PaginatedDataTable,
  PmsTypeSelector,
  IJPagesToggle,
  IfPermitted,
  useIfPermitted,
} from 'components';

import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';

import { getText, search } from '../../utils/localesHelpers';
import logger from '../../utils/logger';

import { buildDownloadableFilename } from '../../utils/downloadHelpers';

import { useIncomeJournal, useIJExport } from '../../graphql';

import { MappingReportFilters } from './MappingReportFilters';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { timestampNoSeparators } from '../../utils/formatHelpers';
import { StyledPeriod } from './styled';
import { useTableData } from 'hooks';
import { exportToXLSX } from '../../utils/downloadHelpers';
import { isDateValid } from '../../utils/validators';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const csvColumns = {
  reportSourceName: {
    Header: getText('incomeJournal.reportName'),
  },
  pmsCode: {
    Header: getText('incomeJournal.pmsCode'),
  },
  description: {
    Header: getText('generic.description'),
  },
  amount: {
    Header: getText('incomeJournal.amount'),
  },
  pmsTypeName: {
    Header: getText('incomeJournal.type'),
  },
  hmgGlCode: {
    Header: getText('generic.hmgGlCode'),
  },
};

const IncomeJournalMapping = memo((props) => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { hotelId, selectHotelId } = useContext(GlobalFilterContext);
  const { hotels, hotelsMap } = useContext(HotelContext);
  const [reportRequested, setReportRequested] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const csvLink = useRef();
  const excelLink = useRef();

  const { showToast } = useContext(ToastContext);

  const { onRequestTableData, tableData: resultData } = useTableData();

  const [filters, setFilters] = useState({
    date: new Date(),
    period: 'CURRENT',
    pmsType: 1,
    hasAmount: 'ALL',
    mapped: 'ALL',
    keyword: '',
  });

  const {
    incomeJournalMappingGet,
    incomeJournalMappingGetLock,
    incomeJournalMappingSetLock,
    incomeJournalMappingLoading,
    incomeJournalMappingLockLoading,
    isIncomeJournalMappingLockSet,
    incomeJournalMappingReport,
    incomeJournalMappingSetPmsType,
    incomeJournalMappingPmsTypeLoading,
    incomeJournalMappingSetGlCode,
    incomeJournalMappingGLCodeLoading,
  } = useIncomeJournal();

  const {
    incomeJournalSyncAvailability,
    incomeJournalSyncAvailabilityLoading,
    incomeJournalSyncAvailabilityCalled,
    incomeJournalSyncAvailabilityResult,
    incomeJournalSync,
    incomeJournalSyncLoading,
    incomeJournalSyncCalled,
    incomeJournalSyncResult,
  } = useIJExport();

  const calcSelectedFilters = () => {
    let cnt = 0;

    if (filters.pmsType != 1) {
      cnt++;
    }

    if (filters.hasAmount != 'ALL') {
      cnt++;
    }

    if (filters.mapped != 'ALL') {
      cnt++;
    }

    return cnt;
  };

  const customError =
    !!filters.date &&
    (filters.date.length !== 10 || new Date('1900-01-01') > new Date(filters.date)) &&
    getText('generic.invalidDate');

  useEffect(() => {
    if (!props.period) {
      props.periodChange('CURRENT');
    }
  }, []);

  useEffect(() => {
    incomeJournalSyncAvailability({ hotelId });
  }, [incomeJournalSyncAvailability, hotelId]);

  const handleChangeHotel = (name, value) => {
    selectHotelId(value);

    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const handleFilterChange = (name, value) => {
    if (name === 'date' && value != null && value != getText('generic.invalidDate')) {
      props.dateChange(value);
    } else if (name === 'period') {
      props.periodChange(value);
    }
    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);

    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    logger.log('Apply new filters', newFilters);
    setFilters(newFilters);
    setFilterOpen(false);
  };

  useEffect(() => {
    if (props.date && props.period && isDateValid(filters.date)) {
      setFilters({
        ...filters,
        date: props.date,
        period: props.period,
      });
      requestReport({ date: props.date, period: props.period, hotelId });
    }
  }, [props.date, props.period]);

  const requestReport = (filtersToUse) => {
    const params = {
      hotelId: filtersToUse.hotelId,
      date: filtersToUse.date,
    };

    const reportParams = {
      ...params,
      period: filtersToUse.period,
    };

    logger.log('Requesting Income Journal Mapping Report report and lock information', reportParams);

    incomeJournalMappingGetLock(params);
    incomeJournalMappingGet(reportParams);
    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  const handleDownloadAs = ({ value }) => {
    if (incomeJournalMappingReport?.data && Array.isArray(resultData) && resultData?.length) {
      const excelData =
        value == 'csv'
          ? resultData?.map((item) =>
              Object.keys(item)?.reduce((acc, value) => ({ ...acc, [value]: `="${item[value]}"` }), {}),
            )
          : resultData;
      exportToXLSX(
        excelData,
        buildDownloadableFilename({
          hotelName: hotelsMap[incomeJournalMappingReport.data.hotelId]?.hotelName,
          reportName: DownloadableReportNames.ijMapping,
          startDate: timestampNoSeparators(new Date(incomeJournalMappingReport.data.startDate)),
          endDate: timestampNoSeparators(new Date(incomeJournalMappingReport.data.endDate)),
          period: incomeJournalMappingReport.data.period,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          noTotalStyle: true,
          // subHeader: ['', '', 'Actual', 'Budget', 'Variance'],
          // span: [
          //   [1, 1],
          //   [2, 2],
          //   [3, 4],
          //   [5, 6],
          //   [7, 8],
          // ],
        },
      );
    }
  };

  const handleClickLockToggle = () => {
    const params = {
      hotelId,
      date: filters.date,
      lock: !isIncomeJournalMappingLockSet,
    };

    logger.log('Toggle lock for Income Journal Mapping report', params);

    incomeJournalMappingSetLock(params);
  };

  const handleClickSync = useCallback(() => {
    logger.debug('Sync:', { hotelId, period: filters.period, date: filters.date });

    incomeJournalSync({ hotelId, period: filters.period, date: filters.date });
  }, [incomeJournalSync, hotelId, filters.period, filters.date]);

  useEffect(() => {
    if (incomeJournalSyncCalled && !incomeJournalSyncLoading) {
      const data = incomeJournalSyncResult.data?.[0];
      const { exportType, filename, numberOfRows, period } = data || {};

      if (incomeJournalSyncResult.errors.length > 0) {
        showToast({
          severity: 'error',
          message: `Sync failed for the reason: ${incomeJournalSyncResult.errorsMap['']}`,
        });
      } else {
        showToast({
          //severity: 'error',
          message: `Sync is complete with report type '${exportType}'. The report has ${numberOfRows} records and has been stored as ${filename}`,
        });
      }
    }
  }, [showToast, incomeJournalSyncResult, incomeJournalSyncCalled, incomeJournalSyncLoading]);

  const { isPermitted } = useIfPermitted({ page: 'ij-mapping' });
  const permitted = isPermitted('map');

  const handleChangePmsType = ({ reportItem, value }) => {
    logger.log('Set PMS Type:', { reportItem, value });

    incomeJournalMappingSetPmsType({
      params: {
        id: reportItem.id,
        pmsTypeId: Number(value),
      },
    });
  };

  const handleChangeGlCode = ({ reportItem, value }) => {
    logger.log('Set GL Code Type:', { reportItem, value });

    incomeJournalMappingSetGlCode({
      params: {
        id: reportItem.id,
        hmgGlCode: value,
      },
    });
  };

  const items = useMemo(() => {
    const { items } = incomeJournalMappingReport;
    const { mapped, hasAmount, pmsType, keyword } = filters;

    const newItems = items.filter((item) => {
      if (keyword.length > 0) {
        let found = false;

        if (search(item.reportSourceName, keyword) !== -1) {
          found = true;
        }

        if (search(item.pmsCode, keyword) !== -1) {
          found = true;
        }

        if (search(item.description, keyword) !== -1) {
          found = true;
        }

        if (search(item.amount.toString(), keyword.replace(/\$|,/g, '')) !== -1) {
          found = true;
        }

        if (item.pmsType && search(item.pmsType.pmsTypeName, keyword) !== -1) {
          found = true;
        }

        if (search(item.hmgGlCode, keyword) !== -1) {
          found = true;
        }

        if (!found) {
          return false;
        }
      }

      if (pmsType > 2 && item.pmsTypeId !== pmsType) {
        return false;
      }

      if (pmsType === 2 && PmsTypeSelector.allowed.indexOf(item.pmsTypeId) !== -1) {
        return false;
      }

      if (hasAmount === 'AMOUNT' && !item.amount) {
        return false;
      } else if (hasAmount === 'NO-AMOUNT' && item.amount) {
        return false;
      }

      if (mapped === 'MAPPED' && !item.hmgGlCode) {
        return false;
      } else if (mapped === 'UNMAPPED' && item.hmgGlCode) {
        return false;
      }

      return true;
    });

    return newItems;
  }, [filters, hotelId, incomeJournalMappingReport]);

  useEffect(() => {
    if (!hotelId && hotels.length > 0) {
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, hotels, selectHotelId]);

  const isCurrentPeriod = filters.period === 'CURRENT';
  const canChange = !isIncomeJournalMappingLockSet && isCurrentPeriod;
  const isSyncAvailable = incomeJournalSyncAvailabilityResult.data?.[0]?.isEnabled ?? false;

  return (
    <Fragment>
      <Drawer open={filterOpen} anchor='right' onClose={() => setFilterOpen(false)}>
        <MappingReportFilters filters={filters} onApply={handleApplyFilters} onCancel={() => setFilterOpen(false)} />
      </Drawer>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector
            name={'hotelId'}
            value={hotelId}
            onChange={handleChangeHotel}
            disableClearable={true}
            disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading}
          />
        </ToolBarItem>
        <ToolBarItem>
          <StyledPeriod>
            <IJPeriodSelector
              label={getText('generic.period')}
              name='period'
              value={filters.period}
              onChange={handleFilterChange}
              disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading}
            />
          </StyledPeriod>
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label='Date'
            name='date'
            // minDate={datesRange.minDate}
            // maxDate={datesRange.maxDate}
            value={filters.date}
            placeholder='01/01/2021'
            onChange={handleFilterChange}
            disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading}
            dataEl='inputDate'
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport({ ...filters, hotelId })}
            dataEl='buttonGo'
            disabled={
              incomeJournalMappingLoading ||
              incomeJournalMappingLockLoading ||
              filters.date == null ||
              filters.date == 'Invalid Date' ||
              !isDateValid(filters.date)
            }
          />
        </ToolBarItem>
        <ToolBarItem>
          <ButtonFilter
            variant='tertiary'
            filtersSelected={calcSelectedFilters()}
            text={`${getText('generic.filters')}`}
            onClick={() => setFilterOpen(true)}
            onReset={() => {
              setFilters({
                ...filters,
                pmsType: 1,
                hasAmount: 'ALL',
                mapped: 'ALL',
              });
            }}
            disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading}
            dataEl='buttonOpenFilters'
            resetDataEl='buttonResetFilters'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IJPagesToggle displayMode={0} />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem width='450px'>
          <Search
            label='Search'
            value={filters?.keyword}
            name='keyword'
            onChange={(name, value, event) => {
              handleApplyFilters({
                ...filters,
                keyword: value,
              });
            }}
            disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading}
            dataEl='searchInput'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IfPermitted page='ij-mapping' permissionType='sync'>
            <Button
              iconName={!incomeJournalSyncLoading ? 'Sync' : 'HourglassEmpty'}
              variant='tertiary'
              title={
                !incomeJournalSyncLoading
                  ? isSyncAvailable
                    ? getText(`incomeJournal.sync`)
                    : getText(`incomeJournal.syncDisabled`)
                  : getText(`incomeJournal.syncInProgress`)
              }
              onClick={handleClickSync}
              disabled={
                !isSyncAvailable ||
                incomeJournalSyncLoading ||
                incomeJournalMappingLoading ||
                incomeJournalMappingLockLoading ||
                filters.period !== 'CURRENT'
              }
              dataEl='buttonSync'
            />
          </IfPermitted>
        </ToolBarItem>
        {/* <ToolBarItem>
          <Button
            iconName='BackupSharp'
            variant='tertiary'
            title={getText('generic.import')}
            onClick={() => {
              history.push(appPages.keys['ij-import'].url);
            }}
            disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading || !canChange}
            dataEl={'buttonImport'}
          />
        </ToolBarItem> */}
        <ToolBarItem>
          <IfPermitted page='ij-mapping' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              title={getText('generic.download')}
              onClick={handleDownloadAs}
              exclude={['pdf']}
              dataEl={'buttonDownloadAs'}
              disabled={incomeJournalMappingLoading || incomeJournalMappingLockLoading || items.length === 0}
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='ij-mapping' permissionType='lock'>
            <Button
              iconName={isIncomeJournalMappingLockSet ? 'Lock' : 'LockOpen'}
              variant='tertiary'
              title={getText(`incomeJournal.${isIncomeJournalMappingLockSet ? 'unlock' : 'lock'}`)}
              onClick={handleClickLockToggle}
              disabled={
                incomeJournalMappingLoading || incomeJournalMappingLockLoading || items.length === 0 || !isCurrentPeriod
              }
              dataEl={isIncomeJournalMappingLockSet ? 'buttonUnlock' : 'buttonLock'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {incomeJournalMappingLoading && <DataLoading />}
        {!incomeJournalMappingLoading && incomeJournalMappingReport.errors.length !== 0 && (
          <DisplayApiErrors errors={incomeJournalMappingReport.errors} customError={customError} />
        )}
        {!incomeJournalMappingLoading &&
          incomeJournalMappingReport.items.length === 0 &&
          incomeJournalMappingReport.errors.length === 0 && (
            <DisplayNoData
              message={reportRequested ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
            />
          )}
        {!incomeJournalMappingLoading &&
          incomeJournalMappingReport.items.length > 0 &&
          incomeJournalMappingReport.errors.length === 0 &&
          items?.length > 0 && (
            <PaginatedDataTable
              obsoleteData={!reportRequested}
              expandCollapePlacement={-1}
              subHeaders={mappingReportColumnsConfig({
                onChangePmsType: handleChangePmsType,
                onChangeGlCode: handleChangeGlCode,
                isIncomeJournalMappingLockSet,
                hotelId,
                permitted,
              })}
              items={items}
              stickyHeaders={true}
              onRequestTableData={onRequestTableData}
              filtersActive={!!filters?.keyword || calcSelectedFilters() > 0}
              filters={{ hasAmount: filters?.hasAmount, mapped: filters?.mapped, pmsType: filters?.pmsType }}
              search={filters?.keyword ?? ''}
            />
          )}
      </Fragment>
    </Fragment>
  );
});

IncomeJournalMapping.displayName = 'IncomeJournalMapping';

IncomeJournalMapping.propTypes = {
  hotelId: PropTypes.number,
  filters: PropTypes.any,
  dateChange: PropTypes.any,
  periodChange: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.any,
};

export { IncomeJournalMapping };
