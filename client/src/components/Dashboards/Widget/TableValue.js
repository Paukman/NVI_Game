import React, { useMemo, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatValue, RecursiveDataTable, LinkActions, mapArrayBy, Icon, ToolBar, Tooltip } from 'mdo-react-components';
import { CustomizableTable, DataContainer, useIfPermitted } from 'components';
import logger from 'utils/logger';
import {
  getText,
  direction,
  switchDirection,
  stableSort,
  getComparator,
  lowerCaseComparator,
  getCustomComparator,
  numberComparator,
  percDiff,
} from 'utils';
import { NegativeNumberStyle, ButtonWithoutStyle } from './styled';
import { GlobalFilterContext, HotelContext } from 'contexts';
import { useWindowDimensions } from 'hooks';
import { WIDGET_ID } from './constants';
import { buttonComment } from 'config/actionButtons';
import { useComments, useMissingDates } from './hooks';
import { localColors } from 'config/colors';
import MissingDatesModal from './components/MissingDatesModal';
import { noOfColumnsToSkip } from './utils';

const CellRenderer = (props) => {
  const { dataRow, value, columnIdx, column } = props;
  let valuetoUse = value || value === 0 ? value : 'N/A';
  const columnIndexValue = Number(column.field.split('_')[1]);
  const isShowPerformanceIndicator =
    value != 0 &&
    value != 'N/A' &&
    value != '$0.00' &&
    value != '$0' &&
    value != '0%' &&
    value != '0.00%' &&
    !!dataRow[`compareValue_${columnIndexValue}`] &&
    !!dataRow[`compareChangeValue_${columnIndexValue}`] &&
    dataRow[`compareChangeValue_${columnIndexValue}`] != 0 &&
    dataRow?.performanceColumnIds.includes(columnIdx);

  return dataRow.isTotal ? (
    <ToolBar>
      <b>
        <NegativeNumberStyle negativeColor={value?.indexOf('(') > -1 || value?.indexOf('-') > -1}>
          {valuetoUse}
        </NegativeNumberStyle>
      </b>
      {isShowPerformanceIndicator && (
        <Tooltip
          title={`Same Day LY: ${dataRow[`compareValue_${columnIndexValue}`]}  Variance" ${
            dataRow[`compareChangePercentage_${columnIndexValue}`] &&
            dataRow[`compareChangePercentage_${columnIndexValue}`].toFixed(0)
          }%`}
        >
          <ButtonWithoutStyle>
            <Icon
              name={dataRow[`compareChangeValue_${columnIndexValue}`] > 0 ? 'ArrowDropDown' : 'ArrowDropUp'}
              color={dataRow[`compareChangeValue_${columnIndexValue}`] > 0 ? localColors.RED : localColors.GREEN}
              size='20'
            />
          </ButtonWithoutStyle>
        </Tooltip>
      )}
    </ToolBar>
  ) : (
    <ToolBar>
      <NegativeNumberStyle negativeColor={value?.indexOf('(') > -1}>{valuetoUse}</NegativeNumberStyle>
      {isShowPerformanceIndicator && (
        <Tooltip
          title={`Same Day LY: ${dataRow[`compareValue_${columnIndexValue}`]}  Variance" ${
            dataRow[`compareChangePercentage_${columnIndexValue}`] &&
            dataRow[`compareChangePercentage_${columnIndexValue}`].toFixed(0)
          }%`}
        >
          <ButtonWithoutStyle>
            <Icon
              name={dataRow[`compareChangeValue_${columnIndexValue}`] > 0 ? 'ArrowDropDown' : 'ArrowDropUp'}
              color={dataRow[`compareChangeValue_${columnIndexValue}`] > 0 ? localColors.RED : localColors.GREEN}
              size='20'
            />
          </ButtonWithoutStyle>
        </Tooltip>
      )}
    </ToolBar>
  );
};

CellRenderer.propTypes = {
  dataRow: PropTypes.any,
  id: PropTypes.any,
  value: PropTypes.any,
};

const TableValue = (props) => {
  const {
    widgetCalculation,
    widget,
    customTableEnabled,
    dashboard,
    onRequestTableData,
    onEditCustomColumn,
    onDeleteColumn,
    onGetGroupData,
    onViewAllComments,
    period,
    date,
    hotelId,
    performanceColumnIds,
    startDate,
    endDate,
  } = props;
  const widgetVariant = widget.widgetVariant;
  const [customTable] = useState(widget?.widgetValues?.[0]?.customTable);
  const { state: commentState, handleOnCommentClick } = useComments(widget.id, dashboard?.data?.id, onViewAllComments);
  const { state: missingDatesState, handleViewMissingDates } = useMissingDates(
    widget.id,
    dashboard?.data?.id,
    period,
    date,
    hotelId,
    startDate,
    endDate,
  );

  props.missingDownloadData(missingDatesState?.downloadData);

  const { height } = useWindowDimensions();
  const { portfolio } = useContext(GlobalFilterContext);
  const { hotelsGroups, hotelsWithNoGroupsMap } = useContext(HotelContext);

  const [order, updateOrder] = useState({
    orderBy: '',
    direction: direction.ASC,
    orderByColumn: '',
  });

  const [isGroupedByProperty, groupByProperty] = useState(false);

  const { isPermitted } = useIfPermitted({ dashboardPage: 'primary' });

  useEffect(() => {
    if (Array.isArray(hotelsGroups)) {
      groupByProperty(
        !portfolio.hotelGroupId &&
          !portfolio.hotelId &&
          widget.id === WIDGET_ID.BY_PROPERTY &&
          hotelsGroups?.length > 0,
      );
    }
  }, [hotelsGroups, portfolio.hotelGroupId, portfolio.hotelId]);

  const subHeaders = useMemo(() => {
    let firstColumnHeaderName = '';
    if (widget.id === WIDGET_ID.CREDIT_SETTLEMENT) {
      firstColumnHeaderName = getText('generic.description');
    }
    if (isGroupedByProperty) {
      firstColumnHeaderName = getText('generic.groups');
    }
    if (widget.id === WIDGET_ID.BY_PROPERTY && !isGroupedByProperty) {
      firstColumnHeaderName = 'Property';
    }

    const items = [
      {
        field: 'name',
        headerName: firstColumnHeaderName,
        width: `300px`,
        minWidth: `100px`,
        align: 'left',
        sortable: false,
        // eslint-disable-next-line
        onRender: ({ dataRow, value }) => {
          if (dataRow?.isTotal) {
            return <b>{value}</b>;
          } else {
            return value;
          }
        },
      },
    ];

    if (widget.id === WIDGET_ID.BY_PROPERTY) {
      items.push({
        field: 'missingDates',
        headerName: '',
        width: '16px',
        minWidth: `40px`,
        maxWidth: `90px`,
        align: 'right',
        padding: '0',
        sortable: false,
        onRender: ({ dataRow }) => {
          if (dataRow.hotelId && missingDatesState?.missingHotelIds?.includes(dataRow.hotelId))
            return <MissingDatesModal data={handleViewMissingDates(dataRow.hotelId)} />;
        },
      });

      if (isPermitted('comment')) {
        items.push({
          field: 'comment',
          headerName: '',
          width: '16px',
          minWidth: `16px`,
          maxWidth: `48px`,
          align: 'left',
          padding: '0',
          sortable: false,
          onRender: ({ dataRow }) => {
            if (commentState?.hotelComments?.includes(dataRow.hotelId))
              return (
                <LinkActions
                  items={[buttonComment]}
                  noPadding={true}
                  onClick={() => handleOnCommentClick(dataRow.hotelId)}
                />
              );
          },
        });
      }
    }

    items.push(
      ...(customTable?.rowsAndColumns
        ?.filter((item) => !item?.thisIsRow)
        ?.map((item, idx) => {
          return {
            field: `column_${idx}`,
            headerName: `${item?.name}`,
            width: `150px`,
            minWidth: `100px`,
            align: 'right',
            sortable: true,
            // eslint-disable-next-line
            onRender: CellRenderer,
            bgColor: !(idx % 2),
            id: item.id,
          };
        }) || []),
    );

    return items;
  }, [customTable, commentState, isGroupedByProperty, missingDatesState]);

  const data = useMemo(() => {
    const items = widgetCalculation?.data[0]?.values[0]?.data || [];

    const valueTypeIds = items[0]?.valueTypeIds?.map((value) => {
      if (!value) {
        return 1;
      }
      return value;
    });

    const customColumnsDecimalValues = customTable?.rowsAndColumns?.reduce((acc, cur) => {
      if (!cur.thisIsRow) {
        acc.push(cur.valueDecimals);
      }
      return acc;
    }, []);

    const masterDecimalValue = customTable?.valueDecimals;

    const addDecimalValues = (initialFormat, columnDecimals, masterDecimals) => {
      let decimalZeros = '';
      let retValue = initialFormat;
      let valueToUse = 0;
      if (masterDecimals !== null && masterDecimals !== undefined && masterDecimals !== '') {
        valueToUse = masterDecimals;
      }
      if (columnDecimals !== null && columnDecimals !== undefined && columnDecimals !== '') {
        valueToUse = columnDecimals;
      }

      for (let i = 0; i < valueToUse; i++) {
        decimalZeros += '0';
      }
      if (valueToUse > 0) {
        retValue = `${initialFormat}.${decimalZeros}`;
      }
      return retValue;
    };

    let hotelsNoGroupData = [];

    const allData = items.map((row, ridx) => {
      const singleDataRow = {
        name: row.hotel?.hotelName || row.date || row.title,
        hotelId: row.hotelId,
        ...(row?.values &&
          row.values.reduce((columns, value, idx) => {
            const valueFormat = addDecimalValues(
              valueTypeIds?.[idx] === 3 ? '0' : '0,000',
              customColumnsDecimalValues?.[idx],
              masterDecimalValue,
            );

            columns[`column_${idx}`] = formatValue({
              value: value,
              valueTypeId: valueTypeIds?.[idx] || 1,
              valueFormat: valueFormat,
              displaySize: widget.widgetValues?.[0]?.displaySize || 'as-is',
              noValueStr: '',
            });
            return columns;
          }, {})),
        ...(row?.values &&
          row.values.reduce((columns, value, idx) => {
            columns[`raw_${idx}`] = value;
            return columns;
          }, {})),
        ...(row?.compareValues &&
          row.compareValues.reduce((columns, value, idx) => {
            columns[`compareRaw_${idx}`] = value;
            return columns;
          }, {})),
        ...(row?.compareValues &&
          row.compareValues.reduce((columns, value, idx) => {
            columns[`compareValue_${idx}`] = formatValue({
              value: value,
              valueTypeId: valueTypeIds?.[idx] || 1,
              displaySize: widget.widgetValues?.[0]?.displaySize || 'as-is',
              valueFormat: valueTypeIds?.[idx] === 2 ? '0,000.00' : valueTypeIds?.[idx] === 1 ? '0,000' : '0',
              noValueStr: '',
            });
            return columns;
          }, {})),
        ...(row?.compareChangeValues &&
          row.compareChangeValues.reduce((columns, value, idx) => {
            columns[`compareChangeValue_${idx}`] = value;
            return columns;
          }, {})),
        ...(row?.compareChangePercentages &&
          row.compareChangePercentages.reduce((columns, value, idx) => {
            columns[`compareChangePercentage_${idx}`] = value * 100;
            return columns;
          }, {})),
        isTotal: row.isTotal,
        performanceColumnIds,
      };
      if (hotelsWithNoGroupsMap?.[singleDataRow.hotelId]) {
        hotelsNoGroupData.push(singleDataRow);
      }
      return singleDataRow;
    });

    if (hotelsNoGroupData.length > 0) {
      hotelsNoGroupData = stableSort(
        hotelsNoGroupData,
        getCustomComparator({
          order: order.direction,
          orderBy: order.orderBy === '' ? 'name' : order.orderBy,
          comparator: order.orderBy === '' ? lowerCaseComparator : numberComparator,
          ignoreList: null,
        }),
      );
    }

    let groupData = [];

    const allDataSorted = stableSort(
      allData,
      getCustomComparator({
        order: order.direction,
        orderBy: order.orderBy === '' ? 'name' : order.orderBy,
        comparator: order.orderBy === '' ? lowerCaseComparator : numberComparator,
        ignoreList: null,
      }),
    );

    if (isGroupedByProperty) {
      // here create data by groups:
      const dataAsObject = mapArrayBy(allData, 'hotelId');
      // we need this for totals for each group

      // we use aggregator for 2 things, number of columns and for aggragation type
      // implement logic for aggregator here

      const aggregators = customTable?.rowsAndColumns?.reduce((acc, cur) => {
        if (!cur.thisIsRow) {
          if (cur.aggregator) {
            acc.push(cur.aggregator);
          } else if (cur.kpi?.aggregator) {
            acc.push(cur.kpi.aggregator);
          } else {
            if (cur.valueTypeId === 3) {
              acc.push('avg');
            } else {
              acc.push('sum');
            }
          }
        }
        return acc;
      }, []);

      // sort hotel groups here
      const hotelGroupsSorted = stableSort(
        hotelsGroups,
        getCustomComparator({
          order: direction.ASC,
          orderBy: 'groupName',
          comparator: lowerCaseComparator,
          ignoreList: null,
        }),
      );

      groupData = hotelGroupsSorted.reduce((acc, group) => {
        // 2 passes, one to see if the hotel is in the group
        let isHotelInGroup = false;
        for (let i = 0; i < group.hotels.length; i++) {
          if (dataAsObject[group.hotels?.[i]?.id]) {
            isHotelInGroup = true;
            break;
          }
        }

        // second if is then reduce
        if (isHotelInGroup) {
          let groupWithChildren = {};
          groupWithChildren = {
            name: group.groupName,
            id: group.id,
            performanceColumnIds,
            children: group.hotels.reduce((allHotels, hotel) => {
              if (dataAsObject[hotel.id]) {
                allHotels.push({ ...dataAsObject[hotel.id], children: [] });
              }
              return allHotels;
            }, []),
          };
          // add total here
          let initialTotalValues = {};

          for (let i = 0; i < aggregators.length; i++) {
            initialTotalValues[`column_${i}`] = 0;
            initialTotalValues[`compareValue_${i}`] = 0;
            initialTotalValues[`compareChangeValue_${i}`] = 0;
            initialTotalValues[`compareChangePercentage_${i}`] = 0;
          }
          const totals = {
            name: getText('widgets.groupTotal'),
            isTotal: true,

            ...groupWithChildren.children.reduce((columns, value) => {
              for (let i = 0; i < aggregators.length; i++) {
                if (value[`raw_${i}`] !== null) {
                  columns[`column_${i}`] = columns[`column_${i}`] + value[`raw_${i}`];
                }
                if (value[`compareValue_${i}`] !== null) {
                  columns[`compareValue_${i}`] = columns[`compareValue_${i}`] + value[`compareRaw_${i}`];
                }
                if (value[`compareChangeValue_${i}`] !== null) {
                  columns[`compareChangeValue_${i}`] =
                    columns[`compareChangeValue_${i}`] + value[`compareChangeValue_${i}`];
                }
              }

              return columns;
            }, initialTotalValues),
          };

          // now format totals:
          for (let i = 0; i < aggregators.length; i++) {
            totals[`compareChangePercentage_${i}`] = percDiff(totals[`column_${i}`], totals[`compareValue_${i}`]) * 100;
            totals[`column_${i}`] = formatValue({
              value:
                aggregators[i].toLowerCase() === 'avg'
                  ? groupWithChildren.children?.length === 0
                    ? 0
                    : totals[`column_${i}`] / groupWithChildren.children?.length
                  : totals[`column_${i}`],
              valueTypeId: valueTypeIds?.[i],
              valueFormat: addDecimalValues(
                valueTypeIds?.[i] === 3 ? '0' : '0,000',
                customColumnsDecimalValues?.[i],
                masterDecimalValue,
              ),
              displaySize: widget.widgetValues?.[0]?.displaySize || 'as-is',
              noValueStr: '',
            });
            totals[`compareValue_${i}`] = formatValue({
              value:
                aggregators[i].toLowerCase() === 'avg'
                  ? groupWithChildren.children?.length === 0
                    ? 0
                    : totals[`compareValue_${i}`] / groupWithChildren.children?.length
                  : totals[`compareValue_${i}`],
              valueTypeId: valueTypeIds?.[i],
              valueFormat: valueTypeIds?.[i] === 2 ? '0,000.00' : valueTypeIds?.[i] === 1 ? '0,000' : '0',
              displaySize: widget.widgetValues?.[0]?.displaySize || 'as-is',
              noValueStr: '',
            });
            totals[`compareChangeValue_${i}`] =
              aggregators[i].toLowerCase() === 'avg'
                ? groupWithChildren.children?.length === 0
                  ? 0
                  : totals[`compareChangeValue_${i}`] / groupWithChildren.children?.length
                : totals[`compareChangeValue_${i}`];
          }

          // and finaly add totals to the existing children at the end
          // enable this if we want to see eventually totals in groups at the bottom
          // groupWithChildren.children.push(totals);

          //add empty columns for groups:
          for (let i = 0; i < aggregators.length; i++) {
            groupWithChildren[`column_${i}`] = totals[`column_${i}`];
            groupWithChildren[`compareValue_${i}`] = totals[`compareValue_${i}`];
            groupWithChildren[`compareChangeValue_${i}`] = totals[`compareChangeValue_${i}`];
            groupWithChildren[`compareChangePercentage_${i}`] = totals[`compareChangePercentage_${i}`];
          }

          //here order hotels within groups. Use groupOrder state to preserve ordering:
          const childrenSorted = stableSort(
            groupWithChildren.children,
            getCustomComparator({
              order: order.direction, // all properties within children sort asc
              orderBy: order.orderBy === '' ? 'name' : order.orderBy,
              comparator: order.orderBy === '' ? lowerCaseComparator : numberComparator,
              ignoreList: null,
            }),
          );

          acc.push({ ...groupWithChildren, isGroupRow: true, children: [...childrenSorted] });
        }

        return acc;
      }, []);
    }
    if (hotelsNoGroupData?.length) {
      groupData = [...hotelsNoGroupData, ...groupData];
    }
    const totalRowIndex = allDataSorted.findIndex((obj) => obj.isTotal);
    const totalRow = { ...allDataSorted[totalRowIndex] };
    if (totalRowIndex > -1) {
      groupData.push({ ...allDataSorted[totalRowIndex], name: getText('widgets.portfolioTotal') });
      // 1. if all properties and in 'By Property' widget, change name
      if (!portfolio.hotelId && widget.id === WIDGET_ID.BY_PROPERTY) {
        // remove first, when sorted it is in the middle of the table
        allDataSorted.splice(totalRowIndex, 1);
        // add at the end again and change name:
        allDataSorted.push({ ...totalRow, name: getText('widgets.portfolioTotal') });
      }
      // 2. if single property selected, no need to see the total:
      if (portfolio.hotelId && widget.id === WIDGET_ID.BY_PROPERTY) {
        allDataSorted.splice(totalRowIndex, 1);
      }
    }
    onGetGroupData({ groupData, isGroupedByProperty });
    return { allData: allDataSorted, groupData };
  }, [widgetCalculation, hotelsGroups, isGroupedByProperty, order]);

  logger.debug(`TableValue: ${widget.widgetName}`, {
    data,
    subHeaders,
    widgetValues: widget.widgetValues,
    widgetCalculation,
    widgetVariant,
    customTable,
    dashboard,
    widget,
    hotelsGroups,
    hotelsWithNoGroupsMap,
    portfolio,
  });

  // this should come from BE, but we can do it like this for now...
  const isEditable =
    widget?.editable ?? (widget.id === WIDGET_ID.BY_PROPERTY || widget.id === WIDGET_ID.BY_REVENUE ? true : false);

  const onRequestSort = (column, dir) => {
    let newDirection = dir;
    // will be sorting by raw values, not column values (fromatted)
    const rawColumn = column.replace('column', 'raw');

    if (rawColumn === order.orderBy && dir === order.direction) {
      newDirection = switchDirection(dir);
    }
    if (rawColumn !== order.orderBy) {
      newDirection = direction.ASC; // start ascending as default for new columns
    }

    updateOrder({
      orderBy: rawColumn,
      orderByColumn: column,
      direction: newDirection,
    });
  };

  return (
    <>
      {isEditable ? (
        <CustomizableTable
          noOfColumnsToSkip={noOfColumnsToSkip(widget.id, isPermitted('comment'))}
          subHeaders={subHeaders}
          items={isGroupedByProperty ? data.groupData : data.allData}
          freezeColumns={0}
          stickyHeaders={true}
          expandCollapePlacement={isGroupedByProperty ? undefined : -1}
          hasStripes={false}
          editable={customTableEnabled}
          onDeleteColumn={onDeleteColumn}
          onEditColumn={onEditCustomColumn}
          onRequestTableData={onRequestTableData}
          // min is 200px, 450 is number after taking with UX
          tableHeight={600} //{height - 450 < 200 ? 200 : height - 450}
          order={order.direction}
          orderBy={order.orderByColumn}
          onRequestSort={onRequestSort}
        />
      ) : (
        <DataContainer tableHeight={280}>
          <RecursiveDataTable
            subHeaders={subHeaders}
            data={[{ children: data.allData }]}
            freezeColumns={0}
            stickyHeaders={true}
            expandCollapePlacement={-1}
            hasStripes={false}
          />
        </DataContainer>
      )}
    </>
  );
};

TableValue.displayName = 'TableValue';

TableValue.propTypes = {
  widgetCalculation: PropTypes.any,
  widget: PropTypes.any,
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
  customTableEnabled: PropTypes.bool,
};

export { TableValue };
