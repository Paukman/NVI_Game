import React from 'react';
import { timestampToShortLocal, isValidDate } from 'utils';
import { getText } from 'utils/localesHelpers';
import dayjs from 'dayjs';
import logger from 'utils/logger';
import { colors } from 'mdo-react-components';
import { filter, matches, sortBy } from 'lodash';
import { Reply } from './components/Reply';
import { SubHeader, MissingContent } from './styled';

import { CUSTOM_COLUMN_MODE, REVENUE_TYPES, REVENUE_TYPES_LABEL, WIDGET_ID } from './constants';

export const prepareDataForRollingRevenue = (widgetCalculation) => {
  let data = [];
  let valueTypeIds = [];
  let latestDate = null;
  let earliestDate = null;

  widgetCalculation.data[0]?.values.map((valueResult) => {
    if (!valueResult.data || !valueResult.data?.length) {
      data.push([]);
    } else {
      const dataWithLocalDate = valueResult.data.map((obj, index) => {
        if (index === 0) {
          // all are the same, we only need one for this array
          valueTypeIds.push(obj.valueTypeId);
        }
        const date = timestampToShortLocal({ timestamp: obj.date });
        if (latestDate === null || dayjs(date).isAfter(latestDate)) {
          latestDate = date;
        }
        if (earliestDate === null || dayjs(date).isBefore(earliestDate)) {
          earliestDate = date;
        }
        return { value: obj.value, date: date };
      });
      // if all values are null or undefined then push empty array,
      // chart will deal with it...
      let invalidData = true;
      dataWithLocalDate.forEach((obj) => {
        if (obj.value !== null && obj.value !== undefined) {
          invalidData = false;
        }
      });
      if (invalidData) {
        data.push([]);
      } else {
        data.push(dataWithLocalDate);
      }
    }
  });
  return { data, valueTypeIds, latestDate, earliestDate };
};

export const adjustDataForTrend = (data, latestDate, earliestDate) => {
  if (!data || !data?.length || !isValidDate(latestDate) || !isValidDate(earliestDate)) {
    logger.debug('adjustDataForTrend does not have proper input params: ', {
      data,
      latestDate,
      earliestDate,
    });
    return [];
  }

  const lastYear = dayjs(latestDate).year();
  let trendData = null;
  if (dayjs(latestDate).diff(earliestDate, 'day') > 365) {
    trendData = data.map((singleInputData) => {
      const yearOfLastDateInInput = dayjs(singleInputData[singleInputData.length - 1]?.date).year();
      if (!singleInputData.length || yearOfLastDateInInput === lastYear) {
        return singleInputData;
      } else {
        const yearsToIncrease = lastYear - yearOfLastDateInInput;
        // reverse for manipulation
        // we have to do it from the last date in case reports spans over two years (eg jan. and dec. of prev. year)
        const reversedInput = singleInputData.map((item) => item).reverse();
        const reversedTrendData = reversedInput.map((item) => {
          const newYear = dayjs(item.date).year() + yearsToIncrease;
          const newDate = dayjs(item.date).year(newYear);
          return {
            value: item.value,
            date: timestampToShortLocal({ timestamp: newDate }),
          };
        });
        // reverse back
        return reversedTrendData.map((item) => item).reverse();
      }
    });
    return trendData;
  }
  return data;
};

export const isDataAvailable = (data, rollingRevenue) => {
  if (!data || !data?.length) {
    logger.debug('isDataAvailable data is not avilable: ', {
      data,
      rollingRevenue,
    });
    return false;
  }

  let noData = true;
  for (let i = 0; i < data?.length; i++) {
    // check rolling revenue
    if (Array.isArray(data[i]) && data[i]?.length) {
      data[i].map((obj) => {
        if (obj.value !== null && obj.value !== undefined) {
          noData = false;
        }
      });
    } // check column data
    else if (data[i]?.value && !rollingRevenue) {
      noData = false;
    }
  }
  return !noData;
};

export const prepareReplayAndParentComments = (data, state) => {
  if (!data || !state) {
    return { parentComment: null, replyComments: null };
  }
  let parentComment = state?.parentComment;
  if (!parentComment) {
    // we got all the data, find parent comment
    parentComment = data
      ?.filter((obj) => obj.hotelId === state.hotelId && !obj.parentCommentId)
      ?.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
  }

  const replyComments = data.filter((obj) => obj.parentCommentId === parentComment?.id);
  //const sortedReplies = sortBy(replyComments, 'createdAt');

  return { parentComment, replyComments };
};

export const getReplyComponent = (replyComments, open) => {
  return replyComments?.map((obj, index) => {
    return (
      <Reply
        key={index}
        color={colors.mediumGray}
        username={obj.userCreated?.username}
        message={obj.message}
        createdAt={obj.createdAt}
        index={index}
        open={open}
      />
    );
  });
};

export const getActionsButtonsConfig = (open) => {
  return [
    {
      clickId: 'view',
      text: getText('dashboard.viewAll'),
      variant: 'tertiary',
      color: colors.darkBlue,
      iconName: open ? 'ArrowDropUp' : 'ArrowDropDown',
      iconColor: colors.darkBlue,
      iconAlign: 'right',
    },
  ];
};

export const mapCustomTableRowColumnCfg = (cfg) => {
  const columnConfig = cfg?.reduce((acc, cur) => {
    if (!acc.includes(cur?.inputTypeId)) {
      acc.push(cur?.inputTypeId);
    }
    return acc;
  }, []);
  return columnConfig;
};

export const updateLocalFormFields = (data, mode, statusOfPerformanceIndicator) => {
  const updatedData = { ...data };
  if (data.description) {
    updatedData.brandDescription = 'Description';
  }
  if (data.brandId || data.priority) {
    updatedData.brandDescription = 'Brand';
  }
  if (!data.performanceIndicatorMasterOverride) {
    updatedData.performanceIndicatorMasterOverride = statusOfPerformanceIndicator ? 'On' : 'Off';
  }
  if (data.customDate) {
    const localDate = timestampToShortLocal({ timestamp: updatedData.customDate });
    updatedData.month = dayjs(localDate).month();
    updatedData.year = dayjs(localDate).year();
  }
  if (data.period && mode === CUSTOM_COLUMN_MODE.EDIT) {
    updatedData.overrideDefaultPeriod = true;
  } else if (!data.period && mode === CUSTOM_COLUMN_MODE.EDIT) {
    updatedData.overrideDefaultPeriod = false;
  }

  if (data.valueDecimals === null || data.valueDecimals === undefined || data.valueDecimals === '') {
    updatedData.overrideDecimalMaster = false;
  } else if (data.valueDecimals >= 0) {
    updatedData.overrideDecimalMaster = true;
  }
  return updatedData;
};

export const getCustomDate = (year, month) => {
  let customDate = null;
  if (year && !month) {
    customDate = dayjs().set('year', year).set('month', 0).set('date', 1).format('MM/DD/YYYY');
  }
  if (year && month) {
    customDate = dayjs().set('year', year).set('month', month).set('date', 1).format('MM/DD/YYYY');
  }

  return customDate;
};

export const getOrderNo = (customTable) => {
  let lastOrderNo = null;
  if (customTable?.rowsAndColumns?.length) {
    const currentLastOrderNo = customTable.rowsAndColumns[customTable.rowsAndColumns.length - 1]?.orderNo;
    lastOrderNo = (parseInt(currentLastOrderNo, 36) + parseInt('10000', 36)).toString(36);
  }

  return lastOrderNo;
};

export const formatMissingDates = (reportMissingDates, dateObject) => {
  const missingDates = {};
  const missingHotelIds = [];
  reportMissingDates?.map((hotel) => {
    if (hotel.hotelId) {
      let resultArray = {};
      hotel?.details?.map((value) => {
        const dates = value?.missingDates?.reduce((acc, item) => {
          const date = dayjs(item);
          const monthYear = date.format('YYYY-MM-01');
          if (!acc[monthYear]) {
            acc[monthYear] = [];
          }
          acc[monthYear].push(date.format('DD'));

          if (!missingHotelIds.includes(hotel.hotelId)) {
            missingHotelIds.push(hotel.hotelId);
          }

          return acc;
        }, {});

        const mappedDates = Object.keys(dates).map((month) => {
          return `${dayjs(month).format('MMM YYYY')}: ${dates[month].join(', ')}`;
        });
        resultArray[value.detailsType] = mappedDates;
      });

      missingDates[hotel.hotelId] = { ...missingDates[hotel.hotelId], ...resultArray };
    }
    return true;
  });

  return {
    missingHotelIds,
    missingDates,
  };
};

export const formatMissingDatesDownload = (reportMissingDates, requestedDate, hotels) => {
  const resultArray = [];

  reportMissingDates?.map((hotel) => {
    if (hotel.hotelId) {
      hotel?.details?.map((value) => {
        let responseArray = {};

        value.missingDates.forEach((date) => {
          const hotelIdAndDate = { Date: dayjs(date).format('MM/DD/YYYY'), 'Property ID': hotel.hotelId };
          const isRecordAlreadyThere = filter(resultArray, matches(hotelIdAndDate));

          const revenueType = REVENUE_TYPES.filter((type) => value.detailsType === type);

          if (isRecordAlreadyThere?.length > 0) {
            isRecordAlreadyThere[0][REVENUE_TYPES_LABEL[revenueType[0]]] = 'Yes';
          } else {
            responseArray = {
              'Property ID': hotel.hotelId,
              'Property Name': hotels?.find((item) => item.id == hotel.hotelId).hotelName,
              Date: dayjs(date).format('MM/DD/YYYY'),
            };
            responseArray[REVENUE_TYPES_LABEL[revenueType[0]]] = 'Yes';
            resultArray.push(responseArray);
          }
        });
      });
    }
    return hotel.hotelId;
  });

  const formatNoResult = resultArray.map((val) => {
    REVENUE_TYPES.map((revenue) => {
      if (val[REVENUE_TYPES_LABEL[revenue]] === undefined) {
        val[REVENUE_TYPES_LABEL[revenue]] = 'No';
        return val;
      }
    });
    return val;
  });

  const sortResult = sortBy(formatNoResult, ['Property ID', 'Date']);

  return {
    downloadData: sortResult,
  };
};

export const getTooltipTitle = (stateMissingDates, hotelId) => {
  let roomRevenue = null;
  let fAndBRevenue = null;
  let otherRevenue = null;
  if (Object.keys(stateMissingDates.missingDates).length > 0 && stateMissingDates.missingDates?.[hotelId]) {
    REVENUE_TYPES.map((revenue) => {
      if (stateMissingDates?.missingDates?.[hotelId]?.[revenue]) {
        switch (revenue) {
          case 'RMREV90':
            if (stateMissingDates.missingDates[hotelId][revenue].length > 0) {
              const multipleRecords = stateMissingDates.missingDates[hotelId][revenue].map((data) => {
                return data;
              });

              roomRevenue = multipleRecords;
            }
            break;
          case 'ALLFNBREV':
            if (stateMissingDates.missingDates[hotelId][revenue].length > 0) {
              const multipleRecords = stateMissingDates.missingDates[hotelId][revenue].map((data) => {
                return data;
              });
              fAndBRevenue = multipleRecords;
            }
            break;
          case 'OTDREV':
            if (stateMissingDates.missingDates[hotelId][revenue].length > 0) {
              const multipleRecords = stateMissingDates.missingDates[hotelId][revenue].map((data) => {
                return data;
              });
              otherRevenue = multipleRecords;
            }
            break;
          default:
            break;
        }
      }
    });
  }

  return {
    roomRevenue,
    fAndBRevenue,
    otherRevenue,
  };
};

export const prepareMissingDatesTooltip = (roomRevenue, fAndBRevenue, otherRevenue) => {
  return (
    <>
      {roomRevenue && (
        <>
          <SubHeader>Room Revenue</SubHeader>
          {roomRevenue.length && roomRevenue.map((value, key) => <MissingContent key={key}>{value}</MissingContent>)}
        </>
      )}
      {fAndBRevenue && (
        <>
          <SubHeader>F&B Revenue</SubHeader>
          {fAndBRevenue.length && fAndBRevenue.map((value, key) => <MissingContent key={key}>{value}</MissingContent>)}
        </>
      )}
      {otherRevenue && (
        <>
          <SubHeader>Other Revenue</SubHeader>
          {otherRevenue.length && otherRevenue.map((value, key) => <MissingContent key={key}>{value}</MissingContent>)}
        </>
      )}
    </>
  );
};

export const noOfColumnsToSkip = (widgetId, additionalCondition) => {
  let result = 1; // default for by revenue
  if (widgetId === WIDGET_ID.BY_PROPERTY && additionalCondition) {
    result = 3;
  }
  if (widgetId === WIDGET_ID.BY_PROPERTY && !additionalCondition) {
    result = 2;
  }
  return result;
};

export const onErrorHandle = (name, value, data, currentErrors) => {
  logger.debug('onErrorHandle: ', { name, value, data, currentErrors });
  // since we're checking previous errors as well, we need to clean them as well
  let errors = { ...currentErrors };

  switch (name) {
    case 'startDate': {
      if (!isValidDate(data?.startDate)) {
        // uncomment this part if we allow no date: && data?.startDate !== null) {
        errors.startDate = getText('generic.invalidDate');
        break;
      }
      const endDate = dayjs(data?.endDate).format('MM/DD/YYYY');
      const startDate = dayjs(data?.startDate).format('MM/DD/YYYY');
      if (dayjs(endDate).isBefore(dayjs(startDate)) && isValidDate(endDate) && isValidDate(startDate)) {
        errors.endDate = getText('dashboard.errorEndBeforeStart');
        break;
      } else if (isValidDate(endDate) && isValidDate(startDate)) {
        delete errors.endDate;
      }
      delete errors.startDate;
      break;
    }
    case 'endDate': {
      if (!isValidDate(data?.endDate)) {
        // uncomment this part if we allow no date && data?.endDate !== null) {
        errors.endDate = getText('generic.invalidDate');
        break;
      }
      const endDate = dayjs(data?.endDate).format('MM/DD/YYYY');
      const startDate = dayjs(data?.startDate).format('MM/DD/YYYY');
      if (dayjs(endDate).isBefore(dayjs(startDate))) {
        errors.endDate = getText('dashboard.errorEndBeforeStart');
        break;
      }
      delete errors.endDate;
      break;
    }

    default:
      break;
  }

  logger.debug('Error handling: ', name, data, errors);
  return errors;
};
