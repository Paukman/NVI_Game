import XLSX from '@sheet/core';
import dayjs from 'dayjs';
import _, { snakeCase, startCase, lowerCase } from 'lodash';
import { VALUE_TYPES } from 'config/constants';
import { formatValue, colors as colorOfCompenent } from 'mdo-react-components';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { DateTimeHelpers } from './dateHelpers';

const dh = new DateTimeHelpers();

export const buildDownloadData = (data, columnsMap) => {
  const csvArray = [];
  const columnsAccessors = Object.keys(columnsMap);

  if (Array.isArray(data) && data.length > 0) {
    // Go over each row in data array
    data.forEach((rawRow) => {
      // Go over each column and makes its header name as object key
      // and data for the column as value of the object
      const csvRow = columnsAccessors.reduce((acc, accessor) => {
        acc[columnsMap[accessor].Header] = rawRow[accessor];
        return acc;
      }, {});

      csvArray.push(csvRow);
    });
  }

  return csvArray;
};

export const findDepth = (data, arr, depth = 0) => {
  if (!data) return;
  data.forEach((obj) => {
    if (obj?.name) {
      if (obj?.id === obj?.name || (!obj?.hotelId && obj?.id)) {
        arr.push({ title: obj?.name, depth, parent: true });
      } else {
        arr.push({ title: obj?.name, depth, parent: false });
      }
    } else if (obj?.description && (obj?.header || obj?.title)) {
      if (obj?.header || obj?.title || obj?.id === obj?.description) {
        arr.push({ title: obj?.description, depth, parent: true });
      } else {
        arr.push({ title: obj?.description, depth, parent: false });
      }
    } else if (obj?.description && obj?.id) {
      if (obj?.id === obj?.description) {
        arr.push({ title: obj?.description, depth, parent: true });
      } else {
        arr.push({ title: obj?.description, depth, parent: false });
      }
    } else if (obj?.description && !(obj?.header || obj?.title)) {
      arr.push({ title: obj?.description, depth, parent: null });
    } else if (obj?.title) {
      if (obj?.hasHorizontalTopBorder) {
        arr.push({ title: obj?.title, depth, parent: true });
      } else {
        arr.push({ title: obj?.title, depth, parent: false });
      }
    } else {
      arr.push({ title: obj?.id, depth, parent: null });
    }
    findDepth(obj?.children, arr, depth + 1);
  });
};

export const exportToXLSX = (
  csvData,
  fileName,
  type = 'xlsx',
  sheetName = 'Report',
  /* span and subHeader object
    empty key means no header title
    subHeader: ['', '', 'Actual', 'Budget', 'Variance'],
    span: [
          [1, 1],
          [2, 2],
          [3, 4],
          [5, 6],
          [7, 8],
        ]
  */
  opts,
) => {
  const {
    isHeader,
    subHeader,
    style,
    span,
    noTotalStyle,
    header,
    maxValues,
    mediumValues,
    indents,
    reportName,
    overrideLeftAlignBodyData,
  } = opts || {};
  const ws = XLSX.utils.json_to_sheet(csvData, { origin: subHeader ? 'A2' : 'A1', skipHeader: isHeader, header });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  if (style) {
    let range = XLSX.utils.decode_range(ws['!ref']);

    const mergedReportColumns = []; // Stores cells which represent headers of the report, that are in-accessible due to merging
    if (subHeader) {
      /**
       * first row consist of merging cells which is header
       */
      let mergedCells = [];
      span.forEach((item, index) => {
        ws[`${columnToLetter(item[0])}1`] = { v: subHeader[index], t: 's' };

        // Check for merged and in-accessible headers(columns) of the report and add those to 'mergedReportColumns' array
        if (item[1] > item[0]) {
          const columNumbers = _.range(item[0] + 1, item[1] + 1); // Getting only the in-accessible columns, first column is accessible
          columNumbers.map((columNumber) => {
            mergedReportColumns.push(`${columnToLetter(columNumber)}1`);
          });
        }

        if (item[0] !== item[1]) {
          mergedCells.push({ s: { r: 0, c: item[0] - 1 }, e: { r: 0, c: item[1] - 1 } });
        }

        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'] = mergedCells;
      });
    }
    const titles = [];
    const indeces = [];
    const totalIndeces = [];
    if (indents) {
      indents.forEach((item) => {
        if (item?.parent) {
          titles.push(item?.title);
        } else if (item?.parent === null && item?.depth == 0) {
          titles.push(item?.title);
        }
      });

      for (let i = 0; i <= range.e.c + 1; i++) {
        for (let j = 1; j <= range.e.r + 1; j++) {
          if (
            reportName == 'IJReconciliation' &&
            ws[`${columnToLetter(i)}${j}`] &&
            ws[`${columnToLetter(i)}${j}`].t === 's' &&
            i == 1 &&
            (ws[`${columnToLetter(i)}${j}`].v.toLowerCase().search('total') > -1 ||
              ws[`${columnToLetter(i)}${j}`].v.toLowerCase().search('statistics') > -1)
          ) {
            totalIndeces.push(j);
          }
          if (ws[`${columnToLetter(i)}${j}`] && titles.includes(ws[`${columnToLetter(i)}${j}`].v)) {
            indeces.push(j);
          }
        }
      }
    }

    if (reportName == 'pickup') {
      for (let i = 0; i <= range.e.c + 1; i++) {
        for (let j = 1; j <= range.e.r + 1; j++) {
          if (
            ws[`${columnToLetter(i)}${j}`] &&
            (ws[`${columnToLetter(i)}${j}`].v == 'On The Books' || ws[`${columnToLetter(i)}${j}`].v == 'Actual')
          ) {
            indeces.push(j);
          }
        }
      }
    }

    for (let i = 0; i <= range.e.c + 1; i++) {
      /**
       * Modify columns
       */
      ws[`${columnToLetter(i)}${Number(subHeader ? 2 : 1)}`] = {
        ...ws[`${columnToLetter(i)}${Number(subHeader ? 2 : 1)}`],
        v: ws[`${columnToLetter(i)}${Number(subHeader ? 2 : 1)}`]?.v.split(':')[0],
      };
      for (let j = 1; j <= range.e.r + 1; j++) {
        let isBody = subHeader ? j != 1 && j != 2 : j != 1;
        let isHeader = subHeader ? j == 1 || j == 2 : j == 1;

        let indentObj =
          indents &&
          ws[`${columnToLetter(i)}${j}`] &&
          indents.find((item) => item?.title === ws[`${columnToLetter(i)}${j}`].v);

        if (mergedReportColumns.indexOf(`${columnToLetter(i)}${j}`) < 0) {
          // Skip excel columns that are already merged
          ws[`${columnToLetter(i)}${j}`] = {
            ...ws[`${columnToLetter(i)}${j}`],
            s: {
              ...(isHeader && {
                bold: true,
                sz: 10,
                fgColor: { rgb: j == 1 ? 0x3b6cb4 : 0x20467f },
                alignment: {
                  horizontal: 'center',
                },
                left: {
                  style: 'thin',
                  color: {
                    rgb:
                      (subHeader && i == 1 && j == 1) ||
                        (subHeader && i != 1 && j == 2) ||
                        (subHeader && i != 1 && j == 1) ||
                        (!subHeader && i != 1 && j == 1)
                        ? 0xffffff
                        : 0x000000,
                  },
                },
                bottom: { style: 'thin', color: { rgb: 0x000000 } },
                right: { style: 'thin', color: { rgb: i == range.e.c + 1 ? 0x000000 : 0xffffff } },
                ...(!subHeader &&
                  j == 1 && {
                  top: {
                    style: 'thin',
                    color: {
                      rgb:
                        //&& ws[`${columnToLetter(i)}${j}`] && ws[`${columnToLetter(i)}${j}`].v === ''
                        //? 0xffffff
                        // :
                        0x000000,
                    },
                  },
                }),

                color: { rgb: 0xffffff },
              }),
              /**
               * first column is left aligned
               */
              ...(isBody && {
                bold:
                  (indentObj && indentObj?.parent) ||
                  totalIndeces.includes(j) ||
                  (indentObj && indentObj?.parent === null && indentObj?.depth === 0),
                sz: 10,
                alignment: {
                  horizontal:
                    // Check if value is a percentage|curreny| etc.
                    ((ws[`${columnToLetter(i)}${j}`] !== null &&
                      ws[`${columnToLetter(i)}${j}`] !== undefined &&
                      ws[`${columnToLetter(i)}${j}`].v !== null &&
                      ws[`${columnToLetter(i)}${j}`].v !== undefined &&
                      ws[`${columnToLetter(i)}${j}`].t == 's' &&
                      !ws[`${columnToLetter(i)}${j}`]?.v?.includes('(%)') &&
                      (ws[`${columnToLetter(i)}${j}`]?.v?.indexOf('%') ==
                        ws[`${columnToLetter(i)}${j}`]?.v?.length - 1 ||
                        (ws[`${columnToLetter(i)}${j}`]?.v?.length > 1 &&
                          ws[`${columnToLetter(i)}${j}`]?.v?.indexOf('%') ==
                          ws[`${columnToLetter(i)}${j}`]?.v?.length - 2) ||
                        ws[`${columnToLetter(i)}${j}`]?.v?.indexOf('$') == 0 ||
                        ws[`${columnToLetter(i)}${j}`]?.v?.indexOf('$') == 1)) ||
                      // Check if value is a Number|N/A| etc.
                      (ws[`${columnToLetter(i)}${j}`] !== null &&
                        ws[`${columnToLetter(i)}${j}`] !== undefined &&
                        ws[`${columnToLetter(i)}${j}`]?.v !== null &&
                        ws[`${columnToLetter(i)}${j}`]?.v !== undefined &&
                        (isNaN(Number(ws[`${columnToLetter(i)}${j}`]?.v)) === false ||
                          ws[`${columnToLetter(i)}${j}`]?.v === 'N/A' ||
                          isNaN(Number(ws[`${columnToLetter(i)}${j}`]?.v?.toString().replace(/,/g, ''))) == false))) &&
                      // Check for specific report types
                      (overrideLeftAlignBodyData ? false : true)
                      ? 'right'
                      : 'left',

                  ...(i == 1 && {
                    ...(indentObj && { indent: indentObj?.parent ? indentObj?.depth : indentObj?.depth + 1 }),
                  }),
                },
                ...(!indeces.includes(j) && {
                  left: { style: 'thin', color: { rgb: 0x000000 } },
                  right: { style: 'thin', color: { rgb: 0x000000 } },
                  bottom: { style: 'thin', color: { rgb: 0x000000 } },
                }),
                /**
                 * parent border
                 */

                ...(indeces.includes(j) && {
                  fgColor: { rgb: 0xd9d9d9 },
                  top: { style: 'medium', color: { rgb: 0x000000 } },
                  ...(i == 1 && { left: { style: 'thin', color: { rgb: 0x000000 } } }),
                  ...(i == range.e.c + 1 && { right: { style: 'thin', color: { rgb: 0x000000 } } }),
                }),

                /**
                 * negative value is red color
                 */
                ...((ws[`${columnToLetter(i)}${j}`] &&
                  ws[`${columnToLetter(i)}${j}`].v < 0 &&
                  String(ws[`${columnToLetter(i)}${j}`]?.v)?.indexOf('($') > -1) ||
                  (ws[`${columnToLetter(i)}${j}`] &&
                    ws[`${columnToLetter(i)}${j}`].v &&
                    ws[`${columnToLetter(i)}${j}`].t == 's' &&
                    ws[`${columnToLetter(i)}${j}`]?.v?.indexOf('($') > -1)
                  ? { color: { rgb: 0xc81f1f } }
                  : { color: { rgb: 0x000000 } }),
                /**
                 * Cell has color
                 */
                ...(maxValues &&
                  mediumValues && {
                  ...(ws[`${columnToLetter(i)}${j}`] &&
                    maxValues.includes(ws[`${columnToLetter(i)}${j}`].v) && {
                    fgColor: { rgb: 0xffc1c1 },
                  }),
                  ...(ws[`${columnToLetter(i)}${j}`] &&
                    mediumValues.includes(ws[`${columnToLetter(i)}${j}`].v) && {
                    fgColor: { rgb: 0xffdd9f },
                  }),
                }),
                ...(reportName == 'pickup' &&
                  indeces.includes(j) && {
                  top: { style: 'medium', color: { rgb: 0x000000 } },
                  fgColor: { rgb: 0xd9d9d9 },
                  bold: true,
                }),
              }),
            },
          };
        }
        //  if (isHeader) console.log(`${columnToLetter(i)}${j}`, ws[`${columnToLetter(i)}${j}`]);
      }
      /**
       * it creates width and height for columns automatically
       */
      if (!ws['!cols']) ws['!cols'] = [];
      ws['!cols'][i] = { auto: 1 };
      ws['!cols'][i].s = { auto: 1 };

      if (reportName === DownloadableReportNames.mdoGlCodes && i === 0) {
        ws['!cols'][i] = { width: 19 };
        ws['!cols'][i].s = { auto: 19 };
      }

      if (!noTotalStyle) {
        /**
         * Color for total row
         */
        ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`] = {
          ...ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`],
          s: {
            bold: true,
            fgColor: { rgb: 0xd3d3d3 },
            color: { rgb: 0x000000 },
            top: { style: 'medium', color: { rgb: 0x000000 } },
            bottom: { style: 'medium', color: { rgb: 0x000000 } },
            ...(i !== 1 && {
              alignment: {
                horizontal: 'right',
              },
            }),
            left: { style: 'thin', color: { rgb: 0x000000 } },
            right: { style: 'thin', color: { rgb: 0x000000 } },
            /**
             * negative value is red color
             */
            ...((ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`] &&
              ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`].v < 0) ||
              (ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`] &&
                ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`].v &&
                ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`].t == 's' &&
                ws[`${columnToLetter(i)}${csvData.length + Number(subHeader ? 2 : 1)}`]?.v?.indexOf('($') > -1)
              ? { color: { rgb: 0xc81f1f } }
              : { color: { rgb: 0x000000 } }),
          },
        };
      }
    }
  }

  XLSX.writeFile(wb, `${fileName}.${type}`, { cellStyles: true });
};

const columnToLetter = (column) => {
  let temp;
  let letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
};

export const buildReportFilename = (hotelId, reportName, date) => `${hotelId}-${reportName}-${date}`;

export const buildMissingDateFileName = (reportName, period, startDate, endDate) => {

  if (period !== 'DATE_RANGE') {
    const mappedDate = dh.createPeriod(period, endDate);
    startDate = mappedDate.startDate;
    endDate = mappedDate.endDate;
  }

  const name = startCase(lowerCase(reportName).split(' ').join(''));
  const from = dayjs(startDate).format('MM-DD-YYYY');
  const to = dayjs(endDate).format('MM-DD-YYYY');

  return `${name}_${snakeCase(from)}_to_${snakeCase(to)}`;
};

export const buildDownloadableFilename = (args) => {
  const {
    hotelGroupId,
    hotelId,
    hotelName,
    hotelGroupName,
    accountName,
    reportName,
    period,
    businessDate,
    date,
    year,
    startDate,
    endDate,
    exportType,
    ...rest
  } = args || {};
  const arr = [];

  if (reportName) {
    arr.push(startCase(reportName));
  }

  if (hotelName) {
    arr.push(`h_${startCase(hotelName).replaceAll(' ', '_')}`);
  } else if (hotelId > 0) {
    arr.push(`h_${hotelId}`);
  } else if (hotelGroupName) {
    arr.push(`g_${startCase(hotelGroupName)}`);
  } else if (hotelGroupId > 0) {
    arr.push(`g_${hotelGroupId}`);
  } else if (accountName) {
    arr.push(`acc_${startCase(accountName)}`);
  } else {
    arr.push('All');
  }

  if (exportType) {
    arr.push(exportType);
  }

  if (period) {
    arr.push(`p_${snakeCase(period)}`);
  }

  if (businessDate) {
    arr.push(`bd_${dayjs(businessDate).format('YYYYMMDD')}`);
  }

  if (date) {
    arr.push(`d_${dayjs(date).format('YYYYMMDD')}`);
  }

  if (startDate) {
    arr.push(`from_${dayjs(startDate).format('YYYYMMDD')}`);
  }

  if (endDate) {
    arr.push(`to_${dayjs(endDate).format('YYYYMMDD')}`);
  }

  if (year) {
    arr.push(`year_${year}`);
  }

  return arr.join('_').replace(/\s/gi, '');
};

export const createDownloadFile = ({ data, rowFields, rowNamesMapping, expandedRows }) => {
  const returnRow = (row) => {
    const tempRows = [];

    if (!rowFields || !rowFields?.length || !row) {
      return tempRows;
    }

    const rowFromRowFields = rowFields?.reduce((acc, cur) => {
      const name = rowNamesMapping ? rowNamesMapping[cur]?.name || cur : cur;
      // if we don't explicitly say don't forma we will format if valueType is there
      const format = rowNamesMapping?.[cur]?.format ?? true;
      let value = row[cur] ?? '';
      switch (row.valueType) {
        case VALUE_TYPES.CURRENCY: {
          if (format) {
            value = formatValue({
              value: row[cur],
              valueTypeId: 2,
              valueFormat: '0,000.00',
              noValueStr: row[cur],
              displaySize: 'as-is',
            });
          }
          break;
        }
        case VALUE_TYPES.PERCENTAGE: {
          if (format) {
            value = formatValue({
              value: row[cur],
              valueTypeId: 3,
              valueFormat: '0.00',
              noValueStr: row[cur],
              displaySize: 'as-is',
            });
          }
          break;
        }
        default:
          break;
      }
      return {
        ...acc,
        [name]: value,
      };
    }, {});

    tempRows.push(rowFromRowFields);
    let tempRowsChildren = [];
    if (row.children && row.children?.length && expandedRows?.[row.id]) {
      tempRowsChildren = row.children.reduce((allChilderRows, childrenRow) => {
        const childrenRows = returnRow(childrenRow);
        allChilderRows.push(...childrenRows);
        return allChilderRows;
      }, []);
    }
    tempRows.push(...tempRowsChildren);
    return tempRows;
  };
  const resultData =
    data?.[0]?.children?.reduce((allRows, row) => {
      const rowRows = returnRow(row);
      allRows.push(...rowRows);
      return allRows;
    }, []) || [];

  return resultData;
};
