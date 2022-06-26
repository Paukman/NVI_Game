import React, { memo, Fragment, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ToolBar,
  ToolBarItem,
  Toggle,
  InputDate,
  RecursiveDataTable,
  ButtonDownloadAs,
  Alert,
} from 'mdo-react-components';
import PropTypes from 'prop-types';

import { getText } from '../../utils/localesHelpers';
import { ijCalculations } from '../../utils/ijHelpers';
import { isDateValid } from '../../utils/validators';
import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';

import {
  HotelSelector,
  DataLoading,
  DisplayApiErrors,
  DisplayNoData,
  IJPeriodSelector,
  DataContainer,
  IJActions,
  IJPagesToggle,
  IfPermitted,
} from '../../components';

import { useIJeports } from '../../graphql/useIJReports';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TextCellRenderer } from './TextCellRenderer';
import { CellRenderer } from '../ProfitAndLoss/CellRenderer';
import { NameColumn } from '../ProfitAndLoss/styled';
import { AdjustmentNoteAmountCellRenderer } from './adjustmentNoteCellRenderer';
import { AdjustmentAmountCellRenderer } from './adjustmentAmountCellRenderer';
import { v4 } from 'uuid';
import { AmountCellRenderer } from './AmountCellRenderer';
import { TotalAmountCellRenderer } from './TotalAmountCellRenderer';
import { exportToXLSX, buildDownloadableFilename, findDepth } from '../../utils/downloadHelpers';
import { IncomeSummaryAddEdit } from './incomeSummaryAddEdit';
import { actions } from '../../components/IJActions/IJActions';
import { StyledPeriod } from './styled';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { timestampNoSeparators } from '../../utils/formatHelpers';
import { useTableData } from 'hooks';
import { columnNamesMapping } from './utils';
import { VALUE_TYPES } from 'config/constants';
import numeral from 'numeral';
import { padStart } from 'lodash';
import logger from 'utils/logger';

dayjs.extend(utc);

let deleteId;

let baseData = [];

const IncomeJournalSummary = memo((props) => {
  const history = useHistory();
  const { appPages, appPagesLoading } = useContext(AppContext);
  const { hotelId, selectHotelId } = useContext(GlobalFilterContext);
  const { hotels, loadingList, hotelsMap } = useContext(HotelContext);
  const [iJReportData, setIJReportData] = useState([]);
  const [filters, setFilters] = useState({
    date: new Date(),
    period: 'CURRENT',
  });
  const [headers, setHeaders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(true);
  const {
    incomeJournalSummaryGet,
    incomeJournalSummaryDelete,
    incomeJournalDelete,
    incomeJournalSummaryDeleteLoading,
    incomeJournalSummaryGetLock,
    incomeJournalSummarySetLock,
    incomeJournalSummaryLoading,
    incomeJournalSummaryLockLoading,
    isIncomeJournalSummaryLockSet,
    incomeJournalSummaryReport,
    incomeJournalSummaryAdjustment,
    incomeJournalSummarySetAdjustment,
    incomeJournalSummaryAdjustmentLoading,
  } = useIJeports();

  const { onRequestTableData, tableData: resultData } = useTableData();

  const handleChangeHotel = (name, value) => {
    selectHotelId(value);
    if (reportRequested) {
      setReportRequested(false);
    }
  };
  const [reportRequested, setReportRequested] = useState(false);
  const handleFilterChange = (name, value) => {
    if (name === 'date') {
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

  useEffect(() => {
    if (props.date && props.period && isDateValid(filters.date)) {
      setFilters({
        ...filters,
        date: props.date,
        period: props.period,
      });
      handleReport();
    }
  }, [props.date, props.period]);

  useEffect(() => {
    if (!hotelId && hotels.length > 0) {
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, hotels, selectHotelId]);

  useEffect(() => {
    if (reportRequested && isDateValid(filters.date)) {
      handleReport();
    }
  }, [hotelId, filters]);

  const handleReport = () => {
    incomeJournalSummaryGet({
      hotelId: hotelId,
      period: filters.period,
      date: dayjs(filters.date).format('YYYY-MM-DD'),
    });
    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  const handleClickLockToggle = () => {
    const params = {
      hotelId,
      date: filters.date,
      lock: !isIncomeJournalSummaryLockSet,
    };
    // logger.log('Toggle lock for Income Journal Summary report', params);

    incomeJournalSummarySetLock(params);
    const columns = [
      {
        headerName: 'Description',
        field: 'description',
        width: '150px',
        minWidth: '150px',
        onRender: TextCellRenderer,
        color: '#3b6cb4',
      },
      {
        headerName: 'GL Code',
        field: 'hmgGlCode',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'center',
        align: 'center',
        onRender: TextCellRenderer,
        // colors.white or colors.blue does not work here as theme is unavailable
        color: '#3b6cb4',
      },
      {
        headerName: 'Amount',
        field: 'amount',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'center',
        align: 'center',
        onRender: TotalAmountCellRenderer,
        color: '#3b6cb4',
        valueType: VALUE_TYPES.CURRENCY,
      },
      {
        headerName: 'Adjustment',
        field: 'amountAdjustment',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'center',
        align: 'center',
        onRender: (onR) =>
          AdjustmentAmountCellRenderer({
            ...onR,
            isIncomeJournalSummaryLockSet: !isIncomeJournalSummaryLockSet,
            onChangeAdjustmentNote: handleAdjustmentNote,
          }),
        color: '#3b6cb4',
        valueType: VALUE_TYPES.CURRENCY,
      },
      {
        headerName: 'Total',
        field: 'total',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'center',
        align: 'center',
        onRender: AmountCellRenderer,
        color: '#3b6cb4',
        valueType: VALUE_TYPES.CURRENCY,
      },
      {
        headerName: 'Adjustment Note',
        field: 'adjustmentNote',
        width: '200px',
        minWidth: '200px',
        headerAlign: 'center',
        align: 'center',
        onRender: (onR) =>
          AdjustmentNoteAmountCellRenderer({
            ...onR,
            isIncomeJournalSummaryLockSet: !isIncomeJournalSummaryLockSet,
            onChangeAdjustmentNote: handleAdjustmentNote,
            onDeleteRow: handleDeleteRow,
          }),
        color: '#3b6cb4',
      },
    ];

    columns[columns.length - 1].hasBorder = false;

    setHeaders(columns);
  };

  const customError =
    !!filters.date &&
    (filters.date.length !== 10 || new Date('1900-01-01') > new Date(filters.date)) &&
    getText('generic.invalidDate');

  useEffect(() => {
    if (filters && filters.period === 'CURRENT') {
      const params = {
        hotelId,
        date: filters.date,
      };
      // logger.log('Retrieving Income Journal Summary Report lock information', params);

      incomeJournalSummaryGetLock(params);
    }
  }, [hotelId, filters]);

  useEffect(() => {
    if (incomeJournalDelete && incomeJournalDelete.data) {
      let qData = iJReportData.map((item) => {
        if (item && item.children && item.children.length) {
          item.children = item.children.filter((b) => b.id !== incomeJournalDelete.data.id);
        }
        return item;
      });
      baseData = ijCalculations(qData);
      setIJReportData(baseData);
    }
  }, [incomeJournalDelete]);

  const Actions = () => {
    return (
      <Fragment>
        <Button
          onClick={() => {
            setShowDeleteModal(false);
            deleteId = null;
          }}
          text='Cancel'
          variant='default'
        />
        <Button onClick={() => triggerDeleteRow()} text='Delete' variant='alert' />
      </Fragment>
    );
  };
  const handleDeleteRow = (id) => {
    if (id) {
      deleteId = id;
      setShowDeleteModal(true);
    }
  };

  const triggerDeleteRow = () => {
    incomeJournalSummaryDelete(deleteId);
    setShowDeleteModal(false);
  };

  const handleAdjustmentNote = (name, value, dataRow, trigger = null) => {
    if (trigger === 'triggered') {
      let adjustmentNote =
        name == 'adjustmentNote'
          ? value
          : dataRow.adjustmentNote && dataRow.adjustmentNote
          ? dataRow.adjustmentNote
          : '';
      let adjustmentAmount = name == 'adjustmentAmount' ? value : dataRow.amountAdjustment;
      if (adjustmentNote && adjustmentAmount) {
        incomeJournalSummarySetAdjustment({
          id: dataRow.id,
          params: {
            amountAdjustment: Number(adjustmentAmount),
            note: adjustmentNote,
          },
        });
      }
    } else {
      setIsUpdated(false);
      let cd = baseData.map((section) => {
        if (section.children && section.children.length) {
          return {
            ...section,
            children: section.children.map((it) =>
              it.id === dataRow.id
                ? {
                    ...it,
                    ...(name === 'adjustmentNote' && { adjustmentNote: value }),
                    ...(name === 'adjustmentAmount' && { amountAdjustment: value }),
                  }
                : it,
            ),
          };
        } else {
          return section;
        }
      });

      cd.forEach((qw, si) => {
        if (si === 2) {
          qw.totalAdjustment = Number(cd[0].totalAdjustment) + Number(cd[1].totalAdjustment);
        } else {
          if (Array.isArray(qw?.children)) {
            qw.totalAdjustment = qw.children.reduce((acc, r) => {
              acc = Number(acc) + Number(r.amountAdjustment);
              return acc;
            }, 0);
            qw.children.forEach((child) => {
              child.total = Number(child.amount) - Number(child.amountAdjustment);
            });
          }
        }
      });
      let ajustmentNote = dataRow.adjustmentNote && dataRow.adjustmentNote ? dataRow.adjustmentNote : '';

      incomeJournalSummarySetAdjustment({
        id: dataRow.id,
        params: {
          amountAdjustment: Number(value),
          note: ajustmentNote,
        },
      });
      baseData = ijCalculations(cd);
      setIJReportData(baseData);
    }
  };
  useEffect(() => {
    setIsUpdated(true);
  }, [iJReportData]);

  useEffect(() => {
    if (incomeJournalSummaryReport) {
      if (incomeJournalSummaryReport.errors.length > 0) {
        return;
      }

      const rawReport = incomeJournalSummaryReport || {};

      if (!rawReport) {
        setIJReportData([]);
        return;
      }

      const columnsMap = {};
      const columns = [
        {
          headerName: 'Description',
          field: 'description',
          width: '150px',
          minWidth: '150px',
          onRender: TextCellRenderer,
          color: '#3b6cb4',
        },
        {
          headerName: 'GL Code',
          field: 'hmgGlCode',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'center',
          align: 'center',
          onRender: TextCellRenderer,
          // colors.white or colors.blue does not work here as theme is unavailable
          color: '#3b6cb4',
        },
        {
          headerName: 'Amount',
          field: 'amount',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'center',
          align: 'center',
          onRender: TotalAmountCellRenderer,
          color: '#3b6cb4',
        },
        {
          headerName: 'Adjustment',
          field: 'amountAdjustment',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'center',
          align: 'center',
          onRender: (onR) =>
            AdjustmentAmountCellRenderer({
              ...onR,
              isIncomeJournalSummaryLockSet:
                (filters.period && filters.period !== 'CURRENT') || isIncomeJournalSummaryLockSet,
              onChangeAdjustmentNote: handleAdjustmentNote,
            }),
          color: '#3b6cb4',
        },
        {
          headerName: 'Total',
          field: 'total',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'center',
          align: 'center',
          onRender: AmountCellRenderer,
          color: '#3b6cb4',
        },
        {
          headerName: 'Adjustment Note',
          field: 'adjustmentNote',
          width: '200px',
          minWidth: '200px',
          headerAlign: 'center',
          align: 'center',
          onRender: (onR) =>
            AdjustmentNoteAmountCellRenderer({
              ...onR,
              isIncomeJournalSummaryLockSet:
                (filters.period && filters.period !== 'CURRENT') || isIncomeJournalSummaryLockSet,
              onChangeAdjustmentNote: handleAdjustmentNote,
              onDeleteRow: handleDeleteRow,
            }),
          color: '#3b6cb4',
        },
      ];

      columns[columns.length - 1].hasBorder = false;

      setHeaders(columns);

      const tableData = [];

      const buildRowColumns = (columnsData, { hasKpi, setEmtpy } = {}) => {
        return columnsData
          .reduce((acc, column) => {
            acc.push({
              value: column.value,
            });
            acc.push({
              value: hasKpi ? column.kpiValue : '',
            });
            return acc;
          }, [])
          .reduce((acc, column, idx) => {
            acc[columnsMap[`${idx}`]] = setEmtpy ? '' : column.value;
            return acc;
          }, {});
      };
      if (rawReport && rawReport.data) {
        rawReport.data.sections.forEach((section, sIdx) => {
          const { items } = section;
          let children = [];
          items.forEach((item, idx) => {
            item = { ...item, adjustmentNote: item?.adjustmentNote?.note };
            children.push({
              ...item,
              isMappingSummary: true,
            });
          });
          tableData.push({
            ...section,
            children,
            description: section.subtitle ? `${section.title} ${section.subtitle}` : section.title,
            // header: true,
            subLevelHeaders: true,
            isMappingSummary: true,
            hasVerticalBorder: true,
            id: v4(),
          });
        });
      }

      // setSubHeaders(columns);
      baseData = tableData;
      setIJReportData(tableData);
    }
  }, [incomeJournalSummaryReport, filters]);

  const downloadFileName = () => {
    return buildDownloadableFilename({
      reportName: DownloadableReportNames.ijSummary,
      startDate: timestampNoSeparators(new Date(incomeJournalSummaryReport.data.startDate)),
      hotelName: hotelsMap[incomeJournalSummaryReport.data.hotelId]?.hotelName,
      endDate: timestampNoSeparators(new Date(incomeJournalSummaryReport.data.endDate)),
      period: filters.period,
    });
  };

  const handleDownloadAs = ({ value }) => {
    if (incomeJournalSummaryReport?.data && Array.isArray(resultData) && resultData?.length) {
      let indents = [];
      findDepth(iJReportData, indents);
      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          reportName: DownloadableReportNames.ijSummary,
          startDate: timestampNoSeparators(new Date(incomeJournalSummaryReport.data.startDate)),
          hotelName: hotelsMap[incomeJournalSummaryReport.data.hotelId]?.hotelName,
          endDate: timestampNoSeparators(new Date(incomeJournalSummaryReport.data.endDate)),
          period: filters.period,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          indents,
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

  const handleAddRow = (a, b = null) => {
    if (a === 'close') {
      setShowModal(false);
    }
    if (a === 'data') {
      let index;
      if (b.pmsType && b.pmsType.pmsTypeName) {
        index =
          b.pmsType.pmsTypeName === 'Revenue' || b.pmsType.pmsTypeName === '- Revenue'
            ? 0
            : b.pmsType.pmsTypeName === 'Tax' || b.pmsType.pmsTypeName === '- Tax'
            ? 1
            : b.pmsType.pmsTypeName === 'Settlements' || b.pmsType.pmsTypeName === '- Settlements'
            ? 3
            : null;
      }
      let qData = iJReportData.map((acc, i) => {
        if (index !== null && index === i) {
          return {
            ...acc,
            children: [...acc.children, { ...b, isMappingSummary: true, canRemove: true }],
          };
        } else {
          return acc;
        }
      });
      let cd = qData.map((section) => {
        if (Array.isArray(section?.children)) {
          return {
            ...section,
            totalAdjustment: section.children.reduce((acc, r) => {
              acc = acc + r.amountAdjustment;
              return acc;
            }, 0),
          };
        }
      });
      baseData = ijCalculations(cd);
      setIJReportData(baseData);
      setShowModal(false);
    }
  };

  const isCurrentPeriod = filters.period === 'CURRENT';
  const canChange = !isIncomeJournalSummaryLockSet && isCurrentPeriod;

  return !showModal ? (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector name={'hotelId'} value={hotelId} disableClearable={true} onChange={handleChangeHotel} />
        </ToolBarItem>
        <ToolBarItem>
          <StyledPeriod>
            <IJPeriodSelector label='Period' name='period' value={filters.period} onChange={handleFilterChange} />
          </StyledPeriod>
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label='Date'
            name='date'
            value={filters.date}
            placeholder='01/01/2021'
            onChange={handleFilterChange}
            errorMsg={getText('generic.dateErrorText')}
            dataEl='inputDate'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => handleReport()}
            dataEl='buttonGo'
            disabled={incomeJournalSummaryLoading || !isDateValid(filters.date)}
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IJPagesToggle displayMode={1} />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        {/* <ToolBarItem toTheRight>
          <Button
            iconName='BackupSharp'
            variant='tertiary'
            text=''
            title={getText('generic.import')}
            onClick={() => {
              history.push(appPages.keys['ij-import'].url);
            }}
            disabled={incomeJournalSummaryLoading || incomeJournalSummaryLockLoading || !canChange}
            dataEl='buttonImport'
          />
        </ToolBarItem> */}
        <ToolBarItem toTheRight>
          <IfPermitted page='ij-summary' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={handleDownloadAs}
              disabled={incomeJournalSummaryLoading || incomeJournalSummaryLockLoading}
              dataEl='buttonDownloadAs'
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='ij-summary' permissionType='lock'>
            <Button
              iconName={isIncomeJournalSummaryLockSet ? 'Lock' : 'LockOpen'}
              variant='tertiary'
              title={getText(`incomeJournal.${isIncomeJournalSummaryLockSet ? 'unlock' : 'lock'}`)}
              onClick={handleClickLockToggle}
              disabled={incomeJournalSummaryLoading || incomeJournalSummaryLockLoading || filters.period !== 'CURRENT'}
              dataEl='buttonLock'
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='ij-summary' permissionType='sync'>
            <IJActions
              label=''
              name='Actions'
              disabledItems={
                filters && filters.period === 'CURRENT' && !isIncomeJournalSummaryLockSet ? [] : [actions.ADD]
              }
              onClick={() => {
                setShowModal(!showModal);
              }}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {incomeJournalSummaryLoading && <DataLoading />}
        {!incomeJournalSummaryLoading &&
          incomeJournalSummaryReport &&
          incomeJournalSummaryReport.errors &&
          incomeJournalSummaryReport.errors.length !== 0 && (
            <DisplayApiErrors errors={incomeJournalSummaryReport.errors} customError={customError} />
          )}
        {!incomeJournalSummaryLoading &&
          incomeJournalSummaryReport &&
          !incomeJournalSummaryReport.data &&
          incomeJournalSummaryReport.errors &&
          incomeJournalSummaryReport.errors.length === 0 && (
            <DisplayNoData
              message={reportRequested ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
            />
          )}
        {!incomeJournalSummaryLoading &&
          incomeJournalSummaryReport &&
          incomeJournalSummaryReport.data &&
          incomeJournalSummaryReport.data.sections &&
          incomeJournalSummaryReport.data.sections.length > 0 &&
          incomeJournalSummaryReport.errors &&
          incomeJournalSummaryReport.errors.length === 0 && (
            <DataContainer obsoleteData={!reportRequested}>
              <RecursiveDataTable
                data={[{ children: iJReportData }]}
                subHeaders={headers}
                stickyHeaders={true}
                onRequestTableData={(value) => {
                  value.forEach((item) => {
                    let getValue;
                    let addedValue;
                    if (
                      item['Description'].includes('Total Received') ||
                      item['Description'].includes('Out Of Balance')
                    ) {
                      getValue = iJReportData.find(
                        (dataItem) =>
                          dataItem.title.includes('Total Received') || dataItem.title.includes('Out Of Balance'),
                      );
                    } else if (
                      !(
                        item['Description'].includes('Total Received') ||
                        item['Description'].includes('Out Of Balance') ||
                        item['Description'].includes('Total Settlements') ||
                        item['Description'].includes('Total Taxes') ||
                        item['Description'].includes('Total Revenue')
                      )
                    ) {
                      addedValue = item;
                    } else {
                      getValue = iJReportData.find((dataItem) => dataItem.title === item['Description']);
                    }
                    if (getValue) {
                      item['Amount'] = numeral(
                        Math.abs(getValue['totalAmount']) < 1e-6 ? 0 : getValue['totalAmount'],
                      ).format(`($0,0.${padStart('', 2, '0')})`);
                      item['Adjustment'] = numeral(
                        Math.abs(getValue['totalAdjustment']) < 1e-6 ? 0 : getValue['totalAdjustment'],
                      ).format(`($0,0.${padStart('', 2, '0')})`);
                    }
                    if (addedValue) {
                      item['Amount'] = numeral(Math.abs(item['Amount']) < 1e-6 ? 0 : item['Amount']).format(
                        `($0,0.${padStart('', 2, '0')})`,
                      );
                      item['Adjustment'] = numeral(Math.abs(item['Adjustment']) < 1e-6 ? 0 : item['Adjustment']).format(
                        `($0,0.${padStart('', 2, '0')})`,
                      );
                    }
                    if (item['Total'] !== null && item['Total'] !== undefined) {
                      item['Total'] = numeral(Math.abs(item['Total']) < 1e-6 ? 0 : item['Total']).format(
                        `($0,0.${padStart('', 2, '0')})`,
                      );
                    }
                  });
                  onRequestTableData(value);
                }}
                columnNamesMapping={columnNamesMapping(headers)}
                isUpdated={isUpdated}
              />
            </DataContainer>
          )}
      </Fragment>
      <Alert
        title='Delete Row'
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        buttons={<Actions />}
        iconColor='red'
        description='Do you want to delete the selected rows?'
      ></Alert>
    </Fragment>
  ) : (
    <IncomeSummaryAddEdit hotelId={hotelId} date={filters.date} onClose={handleAddRow} />
  );
});

IncomeJournalSummary.displayName = 'IncomeJournalSummary';
IncomeJournalSummary.propTypes = {
  date: PropTypes.any,
  period: PropTypes.any,
  dateChange: PropTypes.any,
  periodChange: PropTypes.any,
};

export { IncomeJournalSummary };
