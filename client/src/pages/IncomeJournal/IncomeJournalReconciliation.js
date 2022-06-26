import React, { memo, Fragment, useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import {
  ToolBar,
  ToolBarItem,
  InputDate,
  Button,
  ButtonDownloadAs,
  RecursiveDataTable,
  InputField,
  LinkActions,
  Drawer,
  Tooltip,
} from 'mdo-react-components';
import PropTypes from 'prop-types';
import {
  HotelSelector,
  DataLoading,
  DisplayApiErrors,
  DisplayNoData,
  IJPeriodSelector,
  DataContainer,
  IJPagesToggle,
  IfPermitted,
} from '../../components';

import { StyledPeriod } from './styled';
import { useHistory } from 'react-router-dom';
import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';
import { getText } from '../../utils/localesHelpers';
import dayjs from 'dayjs';

import { TextCellRenderer } from 'pages/IncomeJournal/TextCellRenderer';
import { TotalAmountCellRenderer } from './TotalAmountCellRenderer';
import { useIJReconciliation } from 'graphql/useIJReconciliation';
import { v4 } from 'uuid';
import { StyledCancel, StyledCloseIcon, StyledHeader, StyledHeaderWrap } from 'pages/AccountsReceivable/styled';
import { buildDownloadableFilename, exportToXLSX, findDepth } from 'utils/downloadHelpers';
import { isDateValid } from 'utils/validators';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { timestampNoSeparators } from '../../utils/formatHelpers';
import { useTableData } from 'hooks';
import { columnNamesMapping } from './utils';
import { VALUE_TYPES } from 'config/constants';

let cData;
let baseData = [];

const IncomeJournalReconciliation = memo((props) => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { hotelId, selectHotelId } = useContext(GlobalFilterContext);
  const { hotels, hotelsMap } = useContext(HotelContext);
  const [reportRequested, setReportRequested] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [ijReport, setIJReportData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [gMessage, setGMessage] = useState('');
  const [isUpdated, setIsUpdated] = useState(true);

  const { onRequestTableData, tableData: resultData } = useTableData();

  const {
    reportIJReconciliationGetLoading,
    reportIJReconciliationGet,
    getReportIJReconciliation,
    incomeJournalReconciliationSetValue,
    incomeJournalReconciliationSet,
  } = useIJReconciliation();

  const handleChangeHotel = (name, value) => {
    selectHotelId(value);

    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const csvLink = useRef();
  const excelLink = useRef();

  const [filters, setFilters] = useState({
    date: new Date(),
    period: 'CURRENT',
    pmsType: 1,
    hasAmount: 'ALL',
    mapped: 'ALL',
    keyword: '',
  });

  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);
    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const handleReport = () => {
    getReportIJReconciliation({
      params: {
        hotelId: hotelId,
        period: filters.period,
        date: dayjs(filters.date).format('YYYY-MM-DD'),
      },
    });
    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  useEffect(() => {
    if (!hotelId && hotels.length > 0) {
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, hotels, selectHotelId]);

  const onChangeDeposit = (name, a, b, trigger = '') => {
    if (trigger === 'triggered') {
      incomeJournalReconciliationSetValue({
        date: dayjs(filters.date).format('YYYY-MM-DD'),
        hotelId,
        period: filters.period,
        deposit: Number(a),
        note: b?.ijReconciliationNote?.note,
        hotelRevenueAndExpenseId: b?.id,
      });
    } else {
      let dataSet = baseData.map((tableSet) => {
        let isMatch = false;
        if (tableSet && tableSet.children && tableSet.children.length) {
          tableSet.children = tableSet.children.map((valueSet) => {
            if (valueSet.id === b.id) {
              valueSet.deposit = Number(a);
              valueSet.shortage = valueSet.amount - Number(a);
              isMatch = true;
            }
            return valueSet;
          });
        }
        if (isMatch) {
          tableSet = {
            ...tableSet,
            deposit: tableSet.children.reduce((m, n) => {
              m = m + (Number(n.deposit) || 0);
              return m;
            }, 0),
            shortage: tableSet.children.reduce((m, n) => {
              m = m + (Number(n.shortage) || 0);
              return m;
            }, 0),
          };
        }
        return tableSet;
      });
      baseData = dataSet;
      setIJReportData(dataSet);
    }
  };
  const handleMessageSubmit = () => {
    incomeJournalReconciliationSetValue({
      date: dayjs(filters.date).format('YYYY-MM-DD'),
      hotelId,
      period: filters.period,
      ...(cData && { deposit: cData?.deposit }),
      note: message,
      hotelRevenueAndExpenseId: cData ? cData?.id : null,
    });
    if (cData) {
      let dataSet = baseData.map((tableSet) => {
        if (tableSet && tableSet.children && tableSet.children.length) {
          tableSet.children = tableSet.children.map((valueSet) => ({
            ...valueSet,
            ...(valueSet.id === cData.id && {
              comments: message,
              note: message,
              ijReconciliationNote: { note: message },
            }),
          }));
        }
        return tableSet;
      });
      setIsUpdated(false);
      baseData = dataSet;
      setIJReportData(dataSet);
    } else {
      setGMessage(message);
    }
    setMessage('');
    cData = '';
  };
  useEffect(() => {
    if (incomeJournalReconciliationSet && incomeJournalReconciliationSet.data.length && isDateValid(filters.date)) {
      setOpen(false);
      setIsUpdated(true);
    }
  }, [incomeJournalReconciliationSet, filters]);

  useEffect(() => {
    if (reportIJReconciliationGet) {
      if (reportIJReconciliationGet.errors.length > 0) {
        return;
      }

      const rawReport = reportIJReconciliationGet || {};

      if (!rawReport) {
        setIJReportData([]);
        return;
      }

      const columnsMap = {};
      const columns = [
        {
          headerName: 'Expand/Collapse All',
          field: 'description',
          headerAlign: 'left',
          width: '400px',
          minWidth: '400px',
          onRender: TextCellRenderer,
          color: '#3b6cb4',
        },
        {
          headerName: 'GL Account',
          field: 'hmgGlCode',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'left',
          align: 'center',
          onRender: (e) => TextCellRenderer(e),
          // colors.white or colors.blue does not work here as theme is unavailable
          color: '#3b6cb4',
          bgColor: true,
        },
        {
          headerName: 'Amount',
          field: 'amount',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'left',
          align: 'center',
          onRender: (e) => TotalAmountCellRenderer(e),
          color: '#3b6cb4',
          valueType: VALUE_TYPES.CURRENCY,
        },
        {
          headerName: 'Deposit',
          field: 'deposit',
          width: '120px',
          // minWidth: '120px',
          headerAlign: 'left',
          align: 'center',
          bgColor: true,
          // eslint-disable-next-line
          onRender: (e) =>
            filters.period === 'CURRENT' &&
            !e?.dataRow?.topLevelHeaders &&
            !e?.dataRow?.isEditable &&
            !e?.dataRow?.isIJHeader ? (
              <InputField
                name='deposit'
                type='number'
                defaultValue={e?.dataRow?.deposit || ''}
                inputProps={{ style: { textAlign: 'center', fontSize: '12px', fontWeight: 300 } }}
                onChange={(name, value) => onChangeDeposit(name, value, e?.dataRow)}
                onBlur={(valueSet) =>
                  onChangeDeposit(valueSet.target.name, valueSet.target.value, e?.dataRow, 'triggered')
                }
                // label={}
              />
            ) : e?.dataRow?.deposit === null || e?.dataRow?.deposit === undefined ? (
              ''
            ) : (
              TotalAmountCellRenderer(e)
            ),
          // AdjustmentAmountCellRenderer({
          //   ...onR,
          //   isIncomeJournalSummaryLockSet:
          //     (filters.period && filters.period !== 'CURRENT') || isIncomeJournalSummaryLockSet,
          //   onChangeAdjustmentNote: handleAdjustmentNote,
          // }),
          color: '#3b6cb4',
          valueType: VALUE_TYPES.CURRENCY,
        },
        {
          headerName: 'Overage/Shortage',
          field: 'shortage',
          width: '130px',
          // minWidth: '120px',
          headerAlign: 'left',
          align: 'center',
          onRender: (e) =>
            e?.dataRow?.shortage === null || e?.dataRow?.shortage === undefined
              ? ''
              : TotalAmountCellRenderer(e, 'shortage'),
          color: '#3b6cb4',
          valueType: VALUE_TYPES.CURRENCY,
        },
        {
          headerName: 'Comments',
          field: 'comments',
          width: '340px',
          minWidth: '340px',
          headerAlign: 'left',
          align: 'center',
          bgColor: true,
          // eslint-disable-next-line
          onRender: (e) =>
            e?.dataRow?.hasVerticalBorder || e?.dataRow?.isIJHeader ? (
              ''
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontWeight: 300, width: '340px', whiteSpace: 'no-wrap', overflow: 'hidden' }}>
                  {e?.dataRow?.ijReconciliationNote?.note?.length > 50 ? (
                    <Tooltip title={e?.dataRow?.ijReconciliationNote?.note} arrow>
                      <div>{e?.dataRow?.ijReconciliationNote?.note.substr(0, 50)}...</div>
                    </Tooltip>
                  ) : (
                    e?.dataRow?.ijReconciliationNote?.note
                  )}
                </div>
                {filters.period === 'CURRENT' && (
                  <div
                    style={
                      !e?.dataRow?.ijReconciliationNote?.note
                        ? { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }
                        : {}
                    }
                  >
                    <LinkActions
                      style={{ marginLeft: '8px' }}
                      items={[
                        {
                          clickId: 'comments',
                          variant: 'tertiary',
                          iconName: 'Comment',
                          text: '',
                        },
                      ]}
                      onClick={() => {
                        cData = e?.dataRow;
                        setMessage(e?.dataRow?.ijReconciliationNote?.note);
                        setOpen(true);
                      }}
                    />
                  </div>
                )}{' '}
              </div>
            ),
          // AdjustmentNoteAmountCellRenderer({
          //   ...onR,
          //   isIncomeJournalSummaryLockSet:
          //     (filters.period && filters.period !== 'CURRENT') || isIncomeJournalSummaryLockSet,
          //   onChangeAdjustmentNote: handleAdjustmentNote,
          //   onDeleteRow: handleDeleteRow,
          // }),
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
      if (rawReport && rawReport.data && rawReport.data.sections) {
        rawReport.data.sections.forEach((section, sIdx) => {
          const { items } = section;
          let children = [];
          items.forEach((item, idx) => {
            children.push({
              ...item,
              comments: item?.ijReconciliationNote?.note || null,
              isMappingSummary: true,
              isEditable: section.header === 'Tax Reconciliation' || section.header === 'Statistics',
            });
          });

          tableData.push({
            ...section,
            children,
            description: section.header,
            hmgGlCode: section.glCode,
            amount: section.totalAmount,
            deposit: section.totalDeposit,
            shortage: section.totalShortage,
            header: true,
            noBorderBottom: true,
            subLevelHeaders: true,
            isMappingSummary: true,
            isIJHeader: true,

            id: v4(),
          });
        });
      }
      setGMessage(reportIJReconciliationGet.data.latestComment?.note || '');
      // setSubHeaders(columns);
      baseData = tableData;
      setIJReportData(tableData);
    }
  }, [reportIJReconciliationGet, filters]);

  const handleDownloadAs = ({ value }) => {
    if (reportIJReconciliationGet?.data && Array.isArray(resultData) && resultData?.length) {
      let indents = [];
      findDepth(ijReport, indents);

      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          reportName: DownloadableReportNames.ijRecon,
          startDate: timestampNoSeparators(new Date(reportIJReconciliationGet.data.startDate)),
          endDate: timestampNoSeparators(new Date(reportIJReconciliationGet.data.endDate)),
          hotelName: hotelsMap[reportIJReconciliationGet.data.hotelId]?.hotelName,
          period: reportIJReconciliationGet.data.period,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          indents,
          reportName: 'IJReconciliation',
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

  return (
    <Fragment>
      <Drawer open={open} onClose={() => setOpen(false)} anchor='right'>
        <div style={{ margin: '20px 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
          <StyledHeaderWrap>
            <div>
              <StyledHeader>Comments</StyledHeader>
            </div>
            <StyledCloseIcon>
              <Button dataEl='buttonClose' iconName='Close' variant='tertiary' onClick={() => setOpen(false)} />
            </StyledCloseIcon>
          </StyledHeaderWrap>
          <form>
            <InputField
              name='note'
              defaultValue={message || ''}
              onChange={(a, b) => {
                setMessage(b);
              }}
              label={getText('generic.addComment')}
              //error={!!errors['comment']}
              //helperText={errors['comment']}
              multiline
              required
            />
          </form>

          <StyledCancel>
            <Button
              variant='default'
              iconName='Block'
              text={getText('generic.cancel')}
              onClick={() => {
                setOpen(false);
                setMessage('');
              }}
            />

            <Button variant='primary' iconName='Check' text={getText('generic.save')} onClick={handleMessageSubmit} />
          </StyledCancel>
        </div>
      </Drawer>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector
            name={'hotelId'}
            value={hotelId}
            onChange={handleChangeHotel}
            disableClearable={true}
            disabled={reportIJReconciliationGetLoading}
          />
        </ToolBarItem>
        <ToolBarItem>
          <StyledPeriod>
            <IJPeriodSelector
              label={getText('generic.period')}
              name='period'
              value={filters.period}
              onChange={handleFilterChange}
              disabled={reportIJReconciliationGetLoading}
            />
          </StyledPeriod>
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('generic.date')}
            name='date'
            // minDate={datesRange.minDate}
            // maxDate={datesRange.maxDate}
            value={filters.date}
            placeholder='01/01/2021'
            onChange={handleFilterChange}
            disabled={reportIJReconciliationGetLoading}
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
            onClick={() => handleReport()}
            dataEl='buttonGo'
            disabled={reportIJReconciliationGetLoading || !isDateValid(filters.date)}
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IJPagesToggle displayMode={2} />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='ij-reconciliation' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={handleDownloadAs}
              disabled={
                !(
                  reportIJReconciliationGet?.data &&
                  reportIJReconciliationGet?.data?.sections?.some((s) => s.items && s.items?.length > 0)
                )
              }
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {reportIJReconciliationGetLoading && <DataLoading />}
        {!reportIJReconciliationGetLoading &&
          reportIJReconciliationGet &&
          reportIJReconciliationGet.errors &&
          reportIJReconciliationGet.errors.length !== 0 && (
            <DisplayApiErrors errors={reportIJReconciliationGet.errors} />
          )}
        {!reportIJReconciliationGetLoading &&
          (!(reportIJReconciliationGet.data && reportIJReconciliationGet.data.sections) ||
            (reportIJReconciliationGet.data &&
              reportIJReconciliationGet.data.sections &&
              reportIJReconciliationGet.data.sections.length > 0 &&
              !reportIJReconciliationGet.data.sections.some((s) => s.items && s.items.length > 0))) &&
          reportIJReconciliationGet.errors &&
          reportIJReconciliationGet.errors.length === 0 && (
            <DisplayNoData
              message={reportRequested ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
            />
          )}

        {!reportIJReconciliationGetLoading &&
          reportIJReconciliationGet &&
          reportIJReconciliationGet.data &&
          reportIJReconciliationGet.data.sections &&
          reportIJReconciliationGet.data.sections.length > 0 &&
          reportIJReconciliationGet.data.sections.some((s) => s.items && s.items.length > 0) &&
          reportIJReconciliationGet.errors &&
          reportIJReconciliationGet.errors.length === 0 && (
            <>
              <DataContainer obsoleteData={!reportRequested}>
                <RecursiveDataTable
                  indentStep={30}
                  data={[{ children: ijReport }]}
                  subHeaders={headers}
                  stickyHeaders={true}
                  onRequestTableData={onRequestTableData}
                  columnNamesMapping={columnNamesMapping(headers)}
                  isUpdated={isUpdated}
                />
              </DataContainer>
              {gMessage ? (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                  <span
                    style={{
                      fontWeight: 300,
                      marginLeft: '30px',

                      fontSize: '14px',
                    }}
                  >
                    {gMessage && gMessage.length > 170 ? `${gMessage.substr(0, 170)}...` : gMessage}
                  </span>
                  <IfPermitted page='ij-reconciliation' permissionType='edit'>
                    <LinkActions
                      style={{ marginLeft: '10px' }}
                      items={[
                        {
                          clickId: '',
                          variant: 'tertiary',
                          text: 'Edit',
                        },
                      ]}
                      onClick={() => {
                        setMessage(gMessage);
                        setOpen(true);
                      }}
                    />
                  </IfPermitted>
                </div>
              ) : (
                <div style={{ marginTop: '15px' }}>
                  <IfPermitted page='ij-reconciliation' permissionType='comment'>
                    <LinkActions
                      style={{ marginLeft: '10px' }}
                      items={[
                        {
                          clickId: 'Add Notes',
                          variant: 'tertiary',
                          text: 'Add Notes',
                        },
                      ]}
                      onClick={() => {
                        setMessage('');
                        setOpen(true);
                      }}
                    />
                  </IfPermitted>
                </div>
              )}
            </>
          )}
      </Fragment>
    </Fragment>
  );
});

IncomeJournalReconciliation.displayName = 'IncomeJournalReconciliation';

export { IncomeJournalReconciliation };
