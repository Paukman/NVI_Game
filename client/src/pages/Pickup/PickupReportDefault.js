import React, { memo, Fragment, useState, useContext, useCallback, useMemo, useEffect, useRef } from 'react';

import {
  ToolBar,
  ToolBarItem,
  InputDate,
  Button,
  ButtonDownloadAs,
  RecursiveDataTable,
  colors,
  ExclamationIcon,
  SlideBar,
} from 'mdo-react-components';

import { AppContext, GlobalFilterContext, HotelContext } from '../../contexts';
import {
  DisplayApiErrors,
  DisplayNoData,
  DataLoading,
  PortfolioSelector,
  PickupDrawer,
  DataContainer,
  IfPermitted,
} from '../../components';
import { usePickup, useUserSettings } from '../../graphql';
import { cloneDeep } from 'lodash';
import { CellRenderer } from './CellRendered';
import {
  getText,
  logger,
  dh,
  isDateValid,
  buildDownloadableFilename,
  timestampToMonthDay,
  timestampToShortLocal,
  formatPercentageWithThousandSeparator,
  exportToXLSX,
} from '../../utils';
import dayjs from 'dayjs';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { chain, groupBy, map, value, difference, remove } from 'lodash';
import { useTableData } from 'hooks';
import { columnNamesMappingPickup } from './util';
import { DateTimeHelpers } from 'utils/dateHelpers';

const defaultColumnsConfig = {
  headers: [
    {
      title: '',
      colSpan: 1,
    },
  ],
  subHeaders: [
    {
      field: 'title',
      headerName: getText('pickup.dailyActivity'),
      align: 'left',
      width: 300,
      sortable: true,
      onRender: CellRenderer,
      background: colors.white,
    },
  ],
};
const defaultSettingsConfig = [
  {
    title: '',
    subColumns: [
      {
        title: '',
        subtitle: '',
        settingTypeId: '',
        settingCode: '',
        userSettingValue: '',
        valueTypeId: '',
      },
    ],
  },
];
const defaultFilesColumns = {
  csv: {
    title: {
      Header: getText('pickup.dailyActivity'),
    },
  },
  excel: [
    {
      accessor: 'title',
      title: getText('pickup.dailyActivity'),
    },
  ],
};

const PickupReportDefault = memo(() => {
  const { pickupDefaultReportGet, pickupDefaultReport, pickupDefaultReportLoading } = usePickup();
  const { settingsListGet, userSettingsList, userSettingsSet, userSettingsSetLoading } = useUserSettings();
  const dh = new DateTimeHelpers();
  const [rawSettings, setRawSettings] = useState([]);
  const [settings, setSettings] = useState([]);
  const { hotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { hotels, getPortfolioHotelIds, hotelsMap, hotelsGroupsMap } = useContext(HotelContext);
  const { appPages } = useContext(AppContext);
  const [reportRequested, setReportRequested] = useState(false);
  const [requestNo, setRequestNo] = useState(1);
  const [columns, setColumns] = useState(defaultColumnsConfig);
  const [fileColumns, setFileColumns] = useState(defaultFilesColumns);
  const [openSettings, setOpenSettings] = useState(false);
  const [missingDates, setMissingDates] = useState([]);
  const [data, setData] = useState([]);
  const { onRequestTableData, tableData: resultData } = useTableData();

  const [filters, setFilters] = useState({
    businessDate: dh.dateWithoutTimestamp(dayjs().add(-1, 'day')),
    startDate: dh.dateWithoutTimestamp(dayjs().add(-1, 'day')),
    endDate: dh.dateWithoutTimestamp(dayjs().add(5, 'day')),
    keyword: '',
  });
  const [visibilityState, setVisibilityState] = useState([]);
  const [settingTypeId, setSettingTypeId] = useState({
    settingTypeId: 100,
  });
  const [updatedSettings, setUpdatedSettings] = useState([]);

  const handleFilterChange = (name, value) => {
    logger.debug('Filter changed:', { name, value });

    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);

    if (['keyword'].indexOf(name) !== -1) {
      return;
    }

    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const handleChangePortfolio = (name, value) => {
    logger.debug('Portfolio changed:', value);

    selectPortfolio(value);

    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const requestReport = (newFilters) => {
    const filters2use = newFilters || filters;
    logger.debug('requestReport', { filters2use, newFilters, filters });
    const params = {
      hotelId: getPortfolioHotelIds(filters2use?.portfolio || portfolio),
      businessDate: dh.dateWithoutTimestamp(filters2use.businessDate),
      startDate: dh.dateWithoutTimestamp(filters2use.startDate),
      endDate: dh.dateWithoutTimestamp(filters2use.endDate),
    };

    logger.debug('Request Pickup Default report with params:', params);
    pickupDefaultReportGet(params);

    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  const handleDownloadAs = ({ value }) => {
    if (pickupDefaultReport?.data && Array.isArray(resultData) && resultData?.length) {
      let subHeader = [];
      let span = [];
      let count = 1;
      renderHeaders(columns.headers).forEach((item) => {
        subHeader.push(item?.content ? item?.content : '');
        if (item?.single) {
          span.push([count, count]);
          count++;
        } else {
          span.push([count, count + item?.span - 1]);
          count += item?.span;
        }
      });
      const excelData =
        value == 'csv'
          ? resultData?.map((item) =>
              Object.keys(item)?.reduce((acc, value) => ({ ...acc, [value]: `="${item[value]}"` }), {}),
            )
          : resultData;
      exportToXLSX(
        excelData,
        buildDownloadableFilename({
          reportName: DownloadableReportNames.pickup,
          hotelName: hotelsMap[portfolio.hotelId]?.hotelName,
          hotelGroupName: hotelsGroupsMap[portfolio.hotelGroupId]?.groupName,
          businessDate: filters.businessDate,
          startDate: filters.startDate,
          endDate: filters.endDate,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          subHeader,
          span,
          reportName: 'pickup',
        },
      );
    }
  };

  const handleClickSettings = () => {
    logger.debug('Open Settings Sidebar');
    setOpenSettings(true);
  };

  const handleSettingsSaved = () => {
    logger.debug('Settings saved, reload report');
    if (validateDisabledButton()) {
      requestReport();
    }
  };

  const handleUpdateSettings = (settings) => {
    //Remove duplicate settings and add new updated setting

    settings.forEach((element) => {
      const temp = updatedSettings?.filter((val) => val.settingCode != element.settingCode);
      setUpdatedSettings([...temp, element]);
    });
  };

  const applySettings = (isReset) => {
    let settingsToBeUpdated;

    if (isReset) {
      settingsToBeUpdated = settings
        .map((setting) =>
          setting.subColumns.map((subColumn) => ({ settingCode: subColumn.settingCode, userSettingValue: 'true' })),
        )
        .flatMap((x) => x);
    } else {
      settingsToBeUpdated = updatedSettings;
    }

    userSettingsSet({ params: settingsToBeUpdated });
    setUpdatedSettings([]);
    setOpenSettings(false);
    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  useEffect(() => {
    if (!userSettingsSetLoading) {
      settingsListGet({
        params: settingTypeId,
        pagination: {
          page: 1,
          pageSize: 1000,
        },
      });
    }
  }, [settingsListGet, userSettingsSetLoading, openSettings]);

  useEffect(() => {
    if (!openSettings && !userSettingsSetLoading && userSettingsList.errors.length === 0) {
      const data = userSettingsList.data || [];

      if (!data) {
        return;
      }
      if (reportRequested) {
        pickupDefaultReportGet({
          hotelId: getPortfolioHotelIds(filters?.portfolio || portfolio),
          businessDate: filters.businessDate,
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
      }
      setRawSettings(data);
    }
  }, [userSettingsList, openSettings, pickupDefaultReportGet]);

  useEffect(() => {
    if (!userSettingsSetLoading) {
      if (pickupDefaultReport.errors.length > 0) {
        return;
      }

      const data = pickupDefaultReport.data[0];

      if (!data) {
        return;
      }

      // Set table headers and subheaders
      const columns2set = data.columnsCfg || [];
      const newColumns = cloneDeep(defaultColumnsConfig);
      const newFileColumns = cloneDeep(defaultFilesColumns);
      let idx = 0;

      const groupSettings = chain(
        rawSettings.reduce((acc, item) => {
          const keyWord = item?.settingName?.split(',');
          if (keyWord && keyWord[1]) acc = [...acc, { ...item, title: keyWord[1]?.trim() }];
          return acc;
        }, []),
      )
        .groupBy('title')
        .map((value, key) => ({
          title: key,
          subColumns: value.map((item) => {
            const keyWord = item?.settingName?.split(',');
            return { ...item, subTitle: keyWord[0]?.trim() };
          }),
          subTitles: value.map((item) => {
            const keyWord = item?.settingName?.split(',');
            return keyWord[0]?.trim();
          }),
        }))
        .value();

      setSettings(groupSettings);
      setVisibilityState(rawSettings);

      columns2set.forEach((column, cidx) => {
        newColumns.headers.push({
          title: column.title,
          colSpan: column?.subColumns?.length,
        });

        column.subColumns.forEach((subColumn, sidx) => {
          idx++;
          const border = sidx === column.subColumns.length - 1;
          const columnName = `column_${idx}`;
          newColumns.subHeaders.push({
            field: columnName, //`${column.title}-${subColumn}`,
            headerName: subColumn,
            align: 'right',
            width: 80,
            minWidth: 80,
            sortable: false,
            onRender: CellRenderer,
            bgColor: idx % 2 === 1 ? colors.lightGrey : colors.white,
            hasBorder: border,
          });
          newFileColumns.csv[columnName] = {
            Header: `${column.title} - ${subColumn}`,
          };

          newFileColumns.excel.push({
            accessor: columnName,
            title: `${column.title} - ${subColumn}`,
          });
        });
      });

      setColumns(newColumns);
      setFileColumns(newFileColumns);

      // set table data
      const data2set = data.sections || [];

      const newData = [];
      const newMissingDates = [];

      const sectionsLastChk = data2set.length - 1;
      const totalNames =
        data2set.length === 2
          ? [getText('pickup.totalActual'), getText('pickup.totalOnTheBooks')]
          : [getText('pickup.totalOnTheBooks')];

      data2set.forEach((section, sidx) => {
        if (section.missingDates?.length > 0) {
          newMissingDates.push(...section.missingDates);
        }

        if (section.items.length === 0) {
          return;
        }

        const itemsLastChk = section.items.length - 1;
        const onTheBooks = section.title === 'On The Books';

        if (!onTheBooks || section.items.length > 2) {
          // If we the section is On The Books and it has less than 3 items than
          // it means we have only totals rows and we do not need to display
          // the section header
          newData.push({
            id: section.title,
            title: section.title,
            header: true,
            children: [],
            removeBottomBorder: true,
            hasHorizontalTopBorder: false,
          });
        }

        let sliceStart = 0;

        if (onTheBooks && section.items.length < 3) {
          sliceStart = 1;
        }

        newData.push(
          ...section.items.slice(sliceStart).map((item, iidx) => {
            const isGrandTotal = (sidx === sectionsLastChk && iidx === itemsLastChk) || sliceStart === 1;
            const isPreGrandTotal = sidx === sectionsLastChk && iidx === itemsLastChk - 1;

            return item.columnsData.reduce(
              (acc, columnData, idx) => {
                const column = `column_${idx + 1}`;
                const columnNames = newColumns?.subHeaders.find((item) => item?.field === column)?.field;
                let value2use = columnData;
                const thousandSeparatorWithDecimal = new Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                });
                const thousandSeparatorWithoutDecimal = new Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                });

                if (idx === 0) {
                  value2use = formatPercentageWithThousandSeparator(columnData);
                } else if ([3, 4, 14, 19, 24].includes(idx)) {
                  value2use = value2use !== null ? thousandSeparatorWithoutDecimal.format(value2use) : value2use;
                } else if (idx > 8 || [1, 2].indexOf(idx) !== -1) {
                  value2use = columnData != null && !isNaN(columnData) ? Number(columnData).toFixed(2) : columnData;
                  value2use = value2use !== null ? thousandSeparatorWithDecimal.format(value2use) : value2use;
                } else {
                  value2use = value2use !== null ? thousandSeparatorWithDecimal.format(value2use) : value2use;
                }

                const naValue = onTheBooks ? '0' : 'N/A';

                if (columnNames) {
                  acc[columnNames] = value2use != null ? value2use : naValue;
                }

                return acc;
              },
              {
                children: [],
                id: item.date,
                onTheBooks,
                total: item.date == null,
                title: item.date
                  ? timestampToMonthDay(item.date)
                  : getText(isGrandTotal ? 'pickup.grandTotal' : totalNames[sidx]),
                hasHorizontalBottomBorder: (iidx === itemsLastChk && !isGrandTotal) || isPreGrandTotal,
              },
            );
          }),
        );
      });

      setMissingDates(newMissingDates);
      setData(newData);
      setRequestNo(requestNo + 1);
    }
  }, [pickupDefaultReport, rawSettings]);

  const items = useMemo(() => {
    return data;
  }, [data]);

  const downloadableData = useMemo(() => {
    const items = [];
    data.forEach((section) => {
      items.push(section);
    });
    return items;
  }, [data]);

  const renderHeaders = useCallback(
    (headers) => {
      const newHeaders = headers.map((obj, index) => {
        if (index === 0) {
          return { span: 1, single: true };
        } else {
          return {
            span: obj.colSpan,
            content: obj.title,
          };
        }
      });
      return newHeaders;
    },
    [pickupDefaultReport],
  );

  const validateDisabledButton = () => {
    return [filters.businessDate, filters.startDate, filters.endDate].filter((date) => !isDateValid(date)).length == 0
      ? false
      : true;
  };

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <PortfolioSelector
            name={'portfolio'}
            value={portfolio}
            onChange={handleChangePortfolio}
            disabled={pickupDefaultReportLoading}
            disableClearable
            allowAllGroups
            allowAllHotels
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('pickup.businessDate')}
            name='businessDate'
            value={filters.businessDate}
            onChange={handleFilterChange}
            disabled={pickupDefaultReportLoading}
            dataEl='inputDate'
            maxDate={new Date()}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('generic.startDate')}
            name='startDate'
            value={filters.startDate}
            onChange={handleFilterChange}
            disabled={pickupDefaultReportLoading}
            dataEl='inputDateStartDate'
            maxDate={filters.endDate}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('generic.endDate')}
            name='endDate'
            minDate={filters.startDate}
            value={filters.endDate}
            onChange={handleFilterChange}
            disabled={pickupDefaultReportLoading}
            dataEl='inputDateEndDate'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport()}
            dataEl='buttonGo'
            disabled={pickupDefaultReportLoading || validateDisabledButton()}
          />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem width={'450px'}>
          {/* <Search
            label={getText('generic.search')}
            value={filters.keyword}
            name='keyword'
            onChange={handleFilterChange}
            disabled={pickupDefaultReportLoading}
            dataEl='searchInput'
          /> */}
        </ToolBarItem>
        <ToolBarItem toTheRight>
          {missingDates.length > 0 && (
            <ExclamationIcon
              title={getText('pickup.missingDates')}
              data={missingDates.map((date) => timestampToShortLocal({ timestamp: date }))}
            />
          )}
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='pickup' permissionType='download'>
            <ButtonDownloadAs
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={handleDownloadAs}
              disabled={pickupDefaultReportLoading || items.length === 0}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='pickup' permissionType='edit-column'>
            <Button
              variant='tertiary'
              text=''
              iconName='ViewWeekOutlined'
              title={getText('generic.settings')}
              onClick={handleClickSettings}
              disabled={pickupDefaultReportLoading || pickupDefaultReport.data.length === 0}
              dataEl={'buttonSettings'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {(pickupDefaultReportLoading || userSettingsSetLoading) && <DataLoading />}
        {!pickupDefaultReportLoading && !userSettingsSetLoading && pickupDefaultReport.errors.length > 0 && (
          <DisplayApiErrors errors={pickupDefaultReport.errors} />
        )}
        {!pickupDefaultReportLoading &&
          !userSettingsSetLoading &&
          pickupDefaultReport.data.length === 0 &&
          pickupDefaultReport.errors.length === 0 && (
            <DisplayNoData
              message={reportRequested ? getText('generic.emptyData') : getText('generic.selectFilters')}
            />
          )}
        {!pickupDefaultReportLoading && !userSettingsSetLoading && pickupDefaultReport.data.length > 0 && (
          <DataContainer obsoleteData={!reportRequested}>
            <RecursiveDataTable
              key={requestNo}
              expandCollapePlacement={-1}
              headers={[renderHeaders(columns.headers)]}
              subHeaders={columns.subHeaders}
              data={[{ children: items }]}
              maxValues={[]}
              mediumValues={[]}
              titleWithoutBorder={[]}
              freezeColumns={0}
              stickyHeaders={true}
              onRequestTableData={onRequestTableData}
              columnNamesMapping={columnNamesMappingPickup(columns?.subHeaders)}
            />
          </DataContainer>
        )}
      </Fragment>
      <Fragment>
        <SlideBar
          title={getText('generic.settings')}
          open={openSettings}
          onCancel={(e) => {
            if (!e?.clickId) { // When clicked outside
              setOpenSettings(false);
            } else { // When clicked on a button which has clickId property
              applySettings(true);
            }
          }}
          onSave={applySettings}
          anchor={'right'}
          buttonSaveText={getText('pickup.applyDrawer')}
          buttonCancelText={getText('pickup.cancelDrawer')}
        >
          <PickupDrawer data={settings} onApply={handleUpdateSettings} visibility={visibilityState} />
        </SlideBar>
      </Fragment>
    </Fragment>
  );
});

PickupReportDefault.displayName = 'PickupReportDefault';

export { PickupReportDefault };
