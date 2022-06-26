import dayjs from 'dayjs';
import { mapGuestLedgerColumns } from './constants';
import {
  isValidDate,
  timestampToShortLocal,
  findInObject,
  exportToXLSX,
  buildDownloadableFilename,
  getText,
} from 'utils';
import { formatValue } from 'mdo-react-components';
import { extraSearchFields, pageState } from './constants';
import { isEqual } from 'lodash';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import logger from 'utils/logger';

const formatObject = {
  valueTypeId: 2,
  valueFormat: '0,000.00',
  displaySize: 'as-is',
};

const remapToValueLabelPairs = (items) => {
  if (!items || !items?.length) {
    return [];
  }
  const remappedItems = items.map((obj) => {
    return { value: obj, label: obj };
  });
  return remappedItems;
};

const normalizeFilters = (glFilters) => {
  if (!Array.isArray(glFilters) || !glFilters?.length) {
    return null;
  }
  let normalizedFilters = {};
  glFilters.map((obj) => {
    let values = obj.values;

    // handle customization and exceptions here
    if (obj.filterType === 'group' && values[0] === '') {
      values[0] = getText('guestLedger.noGroup');
    }
    if (obj.filterType === 'dbCode' && values[0] === '') {
      values[0] = getText('guestLedger.noDBCode');
    }
    if (obj.filterType === 'numberOfNights') {
      const numberValues = values.map((obj) => parseInt(obj).toString());
      values = [...numberValues.sort((a, b) => a - b)];
    }
    normalizedFilters[obj.filterType] = values;
  });

  logger.debug('Received filters: ', normalizedFilters);
  return normalizedFilters;
};

const prepareGLFilters = (glFilters) => {
  const normalizedFilters = normalizeFilters(glFilters?.[0]?.items);
  const filterSelections = {
    settlementCodeItems: remapToValueLabelPairs(normalizedFilters?.dbCode),
    numberOfNightsItems: remapToValueLabelPairs(normalizedFilters?.numberOfNights),
    groupCodeItems: remapToValueLabelPairs(normalizedFilters?.group),
    roomTypesItems: remapToValueLabelPairs(normalizedFilters?.type),
    folioItems: remapToValueLabelPairs(normalizedFilters?.folio),
    settlementTypeItems: normalizedFilters?.settlementType || [],
    marshaCodeItems: remapToValueLabelPairs(normalizedFilters?.marshaCode),
  };

  return filterSelections;
};

export const prepareDataForGuestLedger = (data, glFilters) => {
  let listData = [];
  let subHeaders = [];
  let searchColumns = [];

  // add more conditions here if needed
  if (Array.isArray(data) && data?.length && data?.[0]?.columnsCfg && data?.[0]?.items?.length) {
    let columns = data[0].columnsCfg;

    // ATTODO remove this part once we have proper column configuration from BE...
    let marshaCodeIndex = columns?.findIndex((obj) => obj.fieldName === 'hotelCode');
    if (marshaCodeIndex === 0) {
      if (columns[0].title === 'MarshaCode') {
        columns[0].title = 'MARSHA-Cd';
      }
      subHeaders = mapGuestLedgerColumns(columns);
    } else {
      let tempColums = columns?.filter((obj) => obj.fieldName !== 'hotelCode');
      tempColums?.unshift(columns?.find((obj) => obj.fieldName === 'hotelCode'));
      if (tempColums?.[0]?.title === 'MarshaCode') {
        tempColums[0].title = 'MARSHA-Cd';
      }
      subHeaders = mapGuestLedgerColumns(tempColums);
    }

    searchColumns = [
      ...data[0]?.columnsCfg
        ?.map((obj) => {
          return obj.fieldName;
        })
        ?.filter((item) => !['outstandingAmount', 'authorizedLimitAmount', 'variance', 'roomRate'].includes(item)),
      ...extraSearchFields,
    ];

    listData = data[0].items.map((obj) => {
      return {
        ...obj,
        numberOfNight: parseInt(obj.numberOfNight).toString(),
        numberOfGuest: parseInt(obj.numberOfGuest),
        arrivalDate: timestampToShortLocal({ timestamp: obj.arrivalDate, format: 'MM/DD/YYYY', utc: true }),
        departureDate: timestampToShortLocal({ timestamp: obj.departureDate, format: 'MM/DD/YYYY', utc: true }),
        roomRate: Number(obj.roomRate),
        outstandingAmountSearch: formatValue({ value: obj.outstandingAmount, ...formatObject }),
        authorizedLimitAmountSearch: formatValue({ value: obj.authorizedLimitAmount, ...formatObject }),
        varianceSearch: formatValue({ value: obj.variance, ...formatObject }),
        roomRateSearch: formatValue({ value: obj.roomRate, ...formatObject }),
        roomIdentifier: obj.roomIdentifier.toString(),
        folio: obj.folio.toString(),
        hotelCode: obj.hotelCode.toString(),
        businessDate: timestampToShortLocal({ timestamp: obj.businessDate, format: 'MM/DD/YYYY', utc: true }),
      };
    });
  }

  // all business dates should be the same!!!
  const businessDate = listData?.[0]?.businessDate || null;

  const returnValue = {
    subHeaders,
    listData,
    filterSelections: prepareGLFilters(glFilters),
    searchColumns,
    businessDate,
  };

  return returnValue;
};

export const downloadExcelFile = (value, resultData, name) => {
  if (Array.isArray(resultData) && resultData?.length) {
    const exportData = resultData.map((item) => {
      return {
        ...item,
        Outstdg: formatValue({ value: parseFloat(item.Outstdg), ...formatObject }),
        Limit: formatValue({ value: parseFloat(item.Limit), ...formatObject }),
        Variance: formatValue({ value: parseFloat(item.Variance), ...formatObject }),
        'Rm Rate': formatValue({ value: parseFloat(item['Rm Rate']), ...formatObject }),
      };
    });
    exportToXLSX(
      exportData,
      buildDownloadableFilename({
        hotelName: name,
        reportName: DownloadableReportNames.guestLedger,
      }),
      value == 'excel' ? 'xlsx' : value,
      '',
      {
        isHeader: false,
        style: true,
        noTotalStyle: true,
      },
    );
  }
};

export const numberOfChangedFilters = (filters) => {
  let filtersChanged = 0;
  for (const [key, value] of Object.entries(DEFAULT_FILTERS)) {
    if (filters[key] !== value) {
      filtersChanged++;
    }
  }
  return filtersChanged;
};

export const prepareFilterParams = (hotels, startDate, endDate) => {
  let params = {
    hotelCode: [...hotels],
    hotelCodeTypeId: 3,
    latestDate: true,
  };
  if (startDate && endDate) {
    params.startDate = dayjs(startDate).format('YYYY-MM-DD');
    params.endDate = dayjs(endDate).format('YYYY-MM-DD');
  }
  return params;
};

const filterOutResultsWFilters = (
  filters,
  defaultFilters,
  data,
  exludeOnDefault = true,
  objectValueStruct = true,
  // if you want to have extra special filtering
  // future use
  customValueFiltering = [],
  ignoreFields = [],
) => {
  if (isEqual(filters, defaultFilters)) {
    return data;
  }

  const listData = data.reduce((acc, cur, index) => {
    let found = false;

    for (const [key, value] of Object.entries(defaultFilters)) {
      if (key === 'outstandingAmount' || key === 'authorizedLimitAmount') {
        continue;
      }

      if (key === 'outstandingAmountOperator') {
        if (filters[key] === defaultFilters[key]) {
          continue;
        } else if (
          filters[key] === '>' &&
          filters.outstandingAmount !== '' &&
          filters[key] !== defaultFilters[key] &&
          cur.outstandingAmount >= parseFloat(filters.outstandingAmount)
        ) {
          found = true;
          continue;
        } else if (
          filters[key] === '<' &&
          filters.outstandingAmount !== '' &&
          cur.outstandingAmount < parseFloat(filters.outstandingAmount)
        ) {
          found = true;
          continue;
        } else {
          found = false;
          break;
        }
      } else if (key === 'authorizedLimitOperator') {
        if (filters[key] === defaultFilters[key]) {
          continue;
        } else if (
          filters[key] === '>' &&
          filters.authorizedLimitAmount !== '' &&
          cur.authorizedLimitAmount >= parseFloat(filters.authorizedLimitAmount)
        ) {
          found = true;
          continue;
        } else if (
          filters[key] === '<' &&
          filters.authorizedLimitAmount !== '' &&
          cur.authorizedLimitAmount < parseFloat(filters.authorizedLimitAmount)
        ) {
          found = true;
          continue;
        } else {
          found = false;
          break;
        }
      } else if (Array.isArray(filters[key])) {
        const filterValue = objectValueStruct
          ? filters[key]?.map((obj) => {
              return obj.value;
            }) || []
          : filters[key];
        const defaultValue = objectValueStruct
          ? defaultFilters[key].map((obj) => {
              return obj.value;
            }) || []
          : defaultFilters[key];
        if (exludeOnDefault && isEqual(filterValue, defaultValue)) {
          continue;
        } else if (exludeOnDefault && !isEqual(filterValue, defaultValue) && filterValue.includes(cur[key])) {
          found = true;
          continue;
        } else if (exludeOnDefault && !isEqual(filterValue, defaultValue) && !filterValue.includes(cur[key])) {
          found = false;
          break;
        } else if (!exludeOnDefault && filterValue.includes(cur[key])) {
          found = true;
          continue;
        } else if (!exludeOnDefault && !filterValue.includes(cur[key])) {
          found = false;
          break;
        }
      } else {
        if (exludeOnDefault && filters[key] === defaultFilters[key]) {
          continue;
        } else if (exludeOnDefault && filters[key] !== defaultFilters[key] && cur[key] === filters[key]) {
          found = true;
          continue;
        } else if (exludeOnDefault && filters[key] !== defaultFilters[key] && cur[key] !== filters[key]) {
          found = false;
          break;
        } else if (!exludeOnDefault && cur[key] === filters[key]) {
          found = true;
          continue;
        } else if (!exludeOnDefault && cur[key] !== filters[key]) {
          found = false;
          break;
        }
      }
    }

    if (found) {
      acc.push(cur);
      return acc;
    }
    return acc;
  }, []);
  return listData;
};

export const filterOutResultsInList = (list, keyword, includeList) => {
  let listData = list;
  if (keyword) {
    listData = list?.filter((item) => {
      const found = findInObject({
        predicate: (val) => {
          return val.toString().toLowerCase().includes(keyword.toLowerCase());
        },
        object: item,
        include: includeList,
      });
      return found;
    });
  }

  return { listData };
};

export const filterResultsWFiltersAndSearch = (filters, defaultFilters, data, keyword, includeList) => {
  const formattedFiltersForDate = {
    ...filters,
    arrivalDate: isValidDate(filters.arrivalDate)
      ? dayjs(filters.arrivalDate).format('MM/DD/YYYY')
      : filters.arrivalDate,
    departureDate: isValidDate(filters.departureDate)
      ? dayjs(filters.departureDate).format('MM/DD/YYYY')
      : filters.departureDate,
  };

  const filteredData = filterOutResultsWFilters(formattedFiltersForDate, defaultFilters, data);

  // now filter for keyword:
  const { listData } = filterOutResultsInList(filteredData, keyword, includeList);

  return { listData };
};

export const isPageTheSame = (pageState, defaultState) => {
  return pageState === defaultState;
};

export const onErrorHandle = (name, value, data, currentErrors) => {
  logger.debug('onErrorHandle: ', { name, value, data, currentErrors });
  // since we're checking previous errors as well, we need to clean them as well
  let errors = { ...currentErrors };

  switch (name) {
    case 'arrivalDate': {
      if (!isValidDate(data?.arrivalDate) && data?.arrivalDate !== null) {
        errors.arrivalDate = getText('generic.invalidDate');
        break;
      }
      const departureDate = dayjs(data?.departureDate).format('MM/DD/YYYY');
      const arrivalDate = dayjs(data?.arrivalDate).format('MM/DD/YYYY');
      if (dayjs(departureDate).isBefore(dayjs(arrivalDate)) && isValidDate(departureDate) && isValidDate(arrivalDate)) {
        errors.departureDate = getText('guestLedger.errorDepartureBeforeArival');
        break;
      } else if (isValidDate(departureDate) && isValidDate(arrivalDate)) {
        delete errors.departureDate;
      }
      delete errors.arrivalDate;
      break;
    }
    case 'departureDate': {
      if (!isValidDate(data?.departureDate) && data?.departureDate !== null) {
        errors.departureDate = getText('generic.invalidDate');
        break;
      }
      const departureDate = dayjs(data?.departureDate).format('MM/DD/YYYY');
      const arrivalDate = dayjs(data?.arrivalDate).format('MM/DD/YYYY');
      if (dayjs(departureDate).isBefore(dayjs(arrivalDate))) {
        errors.departureDate = getText('guestLedger.errorDepartureBeforeArival');
        break;
      }
      delete errors.departureDate;
      break;
    }
    case 'authorizedLimitAmount': {
      if (data?.authorizedLimitAmount && data?.authorizedLimitOperator === '') {
        errors.authorizedLimitOperator = getText('generic.selectOperator');
        break;
      }
      if (data?.authorizedLimitAmount === '' && data?.authorizedLimitOperator !== '') {
        errors.authorizedLimitAmount = getText('generic.enterAmount');
        break;
      }
      delete errors.authorizedLimitOperator;
      delete errors.authorizedLimitAmount;
      break;
    }
    case 'outstandingAmount': {
      if (data?.outstandingAmount && data?.outstandingAmountOperator === '') {
        errors.outstandingAmountOperator = getText('generic.selectOperator');
        break;
      }
      if (data?.outstandingAmount === '' && data?.outstandingAmountOperator !== '') {
        errors.outstandingAmount = getText('generic.enterAmount');
        break;
      }
      delete errors.outstandingAmount;
      delete errors.outstandingAmountOperator;
      break;
    }
    case 'outstandingAmountOperator': {
      if (data?.outstandingAmountOperator && data?.outstandingAmount === '') {
        errors.outstandingAmount = getText('generic.enterAmount');
        break;
      }
      delete errors.outstandingAmountOperator;
      delete errors.outstandingAmount;
      break;
    }
    case 'authorizedLimitOperator': {
      if (data?.authorizedLimitOperator && data?.authorizedLimitAmount === '') {
        errors.authorizedLimitAmount = getText('generic.enterAmount');
        break;
      }
      delete errors.authorizedLimitOperator;
      delete errors.authorizedLimitAmount;
      break;
    }

    default:
      break;
  }

  logger.debug('Error handling: ', name, data, errors);
  return errors;
};

export const getPageState = (data, errors) => {
  if (data?.length === 0 && !errors?.length) {
    return pageState.DEFAULT;
  } else if (errors?.length) {
    return pageState.ERROR;
  }
  return pageState.DEFAULT;
};

export const prepareParamsForFiltering = (values, state, hotelsGroupsMap, hotels) => {
  let params = {
    // by now we have to have these...
    startDate: dayjs(state.latestDate).format('YYYY-MM-DD'),
    endDate: dayjs(state.latestDate).format('YYYY-MM-DD'),
  };
  if (values?.hotelCode?.length) {
    params.hotelCode = [...values?.hotelCode?.map((obj) => obj.value)];
    params.hotelCodeTypeId = 2;
  }
  if (values?.hotelCode?.length === 0) {
    const groupHotels = getGroupHotels(state.hotelGroupId, hotelsGroupsMap, hotels);
    params.hotelCode = [...groupHotels];
    params.hotelCodeTypeId = 3;
  }
  if (values?.roomType?.length) {
    params.roomType = [...values?.roomType?.map((obj) => obj.value)];
  }
  if (values?.groupCode) {
    params.groupCode = values.groupCode === getText('guestLedger.noGroup') ? '' : values.groupCode;
  }
  if (values?.settlementCode) {
    params.settlementCode = values.settlementCode;
  }
  if (values?.settlementType !== '') {
    params.settlementType = values.settlementType;
  }
  if (values?.folio) {
    params.folio = values.folio;
  }
  if (values?.arrivalDate) {
    params.arrivalDate = dayjs(values.arrivalDate).format('YYYY-MM-DD');
  }
  if (values?.departureDate) {
    params.departureDate = dayjs(values.departureDate).format('YYYY-MM-DD');
  }
  // zero is valid
  if (values?.numberOfNight !== null) {
    params.numberOfNight = Number(values.numberOfNight);
  }
  if (values?.outstandingAmountOperator !== '') {
    params.outstandingAmountOperator = values.outstandingAmountOperator;
  }
  if (values?.outstandingAmount !== '') {
    params.outstandingAmount = Number(values.outstandingAmount);
  }
  if (values?.authorizedLimitOperator !== '') {
    params.authorizedLimitOperator = values.authorizedLimitOperator;
  }
  if (values?.authorizedLimitAmount !== '') {
    params.authorizedLimitAmount = Number(values.authorizedLimitAmount);
  }

  return params;
};

export const getGroupHotels = (hotelGroupId, hotelsGroupsMap, hotels) => {
  const groupHotels = hotelGroupId
    ? hotelsGroupsMap[hotelGroupId]?.hotels?.map((hotel) => hotel.id) || []
    : hotels?.map((hotel) => hotel.id) || [];
  return groupHotels;
};
