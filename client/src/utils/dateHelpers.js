const dayjs = require('dayjs');
const dayjsPluginUTC = require('dayjs-plugin-utc');
const { padStart, range } = require('lodash');
dayjs.extend(dayjsPluginUTC.default);

const dateTimeFormats = {
  dateOnly: 'YYYY-MM-DD',
  usDateFormat: 'MM/DD/YYYY',
};

const PERIOD_TYPES = {
  CURRENT: 'CURRENT', // Selected Date
  WTD: 'WTD', // Week To Date
  MTD: 'MTD', // Month To Date
  QTD: 'QTD', // Quarter To Date
  YTM: 'YTM', // Year To Month
  YTD: 'YTD', // Year To Date
  TTM: 'TTM', // Tailing Twelve Months
  L3M: 'L3M', // Last 3 Months - does not go beyound year of provided date
  L6M: 'L6M', // Last 6 Months - does not go beyound year of provided date
  R6M: 'R6M', // Rolling 6 Months
  R12M: 'R12M', // Rolling 12 Months
  L12M: 'L12M', // Rolling 12 Months same as R12M
  WAVE1: 'WAVE1', // Jan 1 - Jun 30
  WAVE2: 'WAVE2', // Jul 1 - Dec 31
  MONTH: 'MONTH', // 1 - 30/31
  QUARTER: 'QUARTER', // Full Quarter for provided date
  YEAR: 'YEAR', // Jan 1 - Dec 31
  L7DAYS: 'L7DAYS',
  L15DAYS: 'L15DAYS',
  L30DAYS: 'L30DAYS',
  L60DAYS: 'L60DAYS',
  L90DAYS: 'L90DAYS',
  L28DAYS: 'L28DAYS',
  WEEK: 'WEEK', // 7 days sun-sat based on provided day
};

const OFFSET_TYPES = {
  THIS_YEAR: 'THIS_YEAR', // This Year
  LAST_YEAR: 'LAST_YEAR', // Last Year
  CUSTOM_YEAR: 'CUSTOM_YEAR', // Custom Year
  THIS_MONTH: 'THIS_MONTH', // This Month
  LAST_MONTH: 'LAST_MONTH', // Last Month
  MONTH_BEFOR_PM: 'MONTH_BEFOR_PM', // Month Before Previous Month
  NEXT_MONTH: 'NEXT_MONTH', // Next Month
  MONTH_AFTER_NM: 'MONTH_AFTER_NM', // Month After Next Month
  CUSTOM_MONTH: 'CUSTOM_MONTH', // Custom Month
};

const PERIOD_TYPES_NAMES = Object.keys(PERIOD_TYPES);
const OFFSET_TYPES_NAMES = Object.keys(OFFSET_TYPES);

class DateTimeHelpers {

  dateWithoutTimestamp(dateRaw){
    const date = new Date(dateRaw)
    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    
    return `${year}-${month}-${day}`;
  }
  
  dbFormat(date, opt = {}) {
    let date2use = date;

    if (date2use instanceof Date === false) {
      date2use = dayjs(date2use).toDate();
    }

    const tmp = dayjs()
      .year(date2use.getFullYear())
      .month(date2use.getMonth())
      .date(date2use.getDate())
      .hour(date2use.getHours())
      .minute(date2use.getMinutes())
      .second(date2use.getSeconds());

    if (opt?.dateOnly === false) {
      return tmp.format();
    } else {
      return tmp.format('YYYY-MM-DD');
    }
  }

  checkToday(date) {
    return dayjs(date).isToday();
  }

  // get today's date (without time) in YYYY-MM-DD format
  getTodaysDateAsString() {
    const dttm = new Date();
    return dayjs(dttm).format(dateTimeFormats.dateOnly);
  }

  dbUtcNow() {
    return dayjs.utc().format();
  }

  getMonthsBetweenDates(startDate, endDate) {
    const startDttm = dayjs(startDate).toDate();
    const endDttm = dayjs(endDate).toDate();

    const { year: startYear, month: startMonth } = this.getYearMonthDay(startDttm);
    const { year: endYear, month: endMonth } = this.getYearMonthDay(endDttm);

    let startYearMonths = [];
    let endYearMonths = [];

    if (endYear != startYear) {
      startYearMonths = range(startMonth - 1, 12);
      endYearMonths = range(0, endMonth);
    } else {
      startYearMonths = range(startMonth - 1, endMonth);
    }

    return { startYear, startYearMonths, endYear, endYearMonths };
  }

  getYearMonthDay(dateStr, raw) {
    let dttm = '';
    if (raw) {
      dttm = dayjs(dateStr).utcOffset(null, true).toDate();
    } else {
      dttm = dateStr;
    }

    return {
      year: dttm.getUTCFullYear(),
      month: dttm.getUTCMonth() + 1,
      day: dttm.getUTCDate(),
    };
  }

  createTodayStartPeriod() {
    return this.createStartPeriod(this.getYearMonthDay(new Date()));
  }

  createStartPeriod({ year, month, day, dateStr, date }) {
    if (dateStr) {
      const dttm = dayjs(dateStr).utcOffset(null, true).toDate();
      const ymd = this.getYearMonthDay(dttm);
      year = ymd.year;
      month = ymd.month;
      day = ymd.day;
    } else if (date instanceof Date) {
      const ymd = this.getYearMonthDay(date);
      year = ymd.year;
      month = ymd.month;
      day = ymd.day;
    }

    return new Date(`${year}-${padStart(month, 2, '0')}-${padStart(day, 2, '0')}T00:00:00.000Z`);
  }

  createEndPeriod({ year, month, day, dateStr, date }) {
    if (dateStr) {
      const dttm = dayjs(dateStr).utcOffset(null, true).toDate();
      const ymd = this.getYearMonthDay(dttm);
      year = ymd.year;
      month = ymd.month;
      day = ymd.day;
    } else if (date instanceof Date) {
      const ymd = this.getYearMonthDay(date);
      year = ymd.year;
      month = ymd.month;
      day = ymd.day;
    }

    return new Date(`${year}-${padStart(month, 2, '0')}-${padStart(day, 2, '0')}T23:59:59.999Z`);
  }

  /**
   * Creates a perdio from start datetime to end datetime accroding to specified period and provided date.
   * @param {string} periodType One of values from PERIOD_TYPES
   * @param {string} selectedDate a date in the YYYY-MM-DD format
   * @returns {object} returns an object { startDate, endDate }
   */
  createPeriod(periodType, selectedDate, opt) {
    const period2chk = (periodType || '').toUpperCase();

    if (!PERIOD_TYPES[period2chk]) {
      return null;
    }

    if (!opt) {
      opt = {};
    }

    // const dttm = dayjs(selectedDate);
    const dttm = dayjs(selectedDate).utcOffset(null, true);
    const today = this.getYearMonthDay(dttm.toDate());
    const period = {
      startDate: null,
      endDate: null,
    };

    switch (period2chk) {
      default:
      case PERIOD_TYPES.CURRENT:
        period.startDate = this.createStartPeriod(today);
        period.endDate = this.createEndPeriod(today);
        break;

      case PERIOD_TYPES.WTD:
        {
          const weekStart = dttm.startOf('week');
          period.startDate = this.createStartPeriod(this.getYearMonthDay(weekStart.toDate()));
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.MTD:
        period.startDate = this.createStartPeriod({ ...today, day: 1 });
        period.endDate = this.createEndPeriod(today);
        break;

      case PERIOD_TYPES.QTD:
        {
          const qMonth = 3 * (Math.ceil(+today.month / 3) - 1) + 1;
          period.startDate = this.createStartPeriod({ ...today, month: qMonth, day: 1 });
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.YTD:
        period.startDate = this.createStartPeriod({ ...today, month: 1, day: 1 });
        period.endDate = this.createEndPeriod(today);
        break;

      case PERIOD_TYPES.YTM:
        {
          period.startDate = this.createStartPeriod({ ...today, month: 1, day: 1 });
          const tmpDate = new Date(today.year, +today.month, 0);
          period.endDate = this.createEndPeriod({ ...today, day: tmpDate.getDate() });
        }
        break;

      case PERIOD_TYPES.MONTH:
        {
          const tmpDate = new Date(today.year, +today.month, 0);
          period.startDate = this.createStartPeriod({ ...today, day: 1 });
          period.endDate = this.createEndPeriod({ ...today, day: tmpDate.getDate() });
        }
        break;

      case PERIOD_TYPES.QUARTER:
        {
          const qMonthStart = 3 * (Math.ceil(+today.month / 3) - 1) + 1;
          period.startDate = this.createStartPeriod({ ...today, month: qMonthStart, day: 1 });
          const in3Months = dayjs(period.startDate).add(3, 'month').add(-1, 'day').toDate();
          period.endDate = this.createEndPeriod(this.getYearMonthDay(in3Months));
        }
        break;

      case PERIOD_TYPES.YEAR:
        period.startDate = this.createStartPeriod({ ...today, month: 1, day: 1 });
        period.endDate = this.createEndPeriod({ ...today, month: 12, day: 31 });
        break;

      case PERIOD_TYPES.WAVE1:
        period.startDate = this.createStartPeriod({ ...today, month: 1, day: 1 });
        period.endDate = this.createEndPeriod({ ...today, month: 6, day: 30 });
        break;

      case PERIOD_TYPES.WAVE2:
        period.startDate = this.createStartPeriod({ ...today, month: 7, day: 1 });
        period.endDate = this.createEndPeriod({ ...today, month: 12, day: 31 });
        break;

      case PERIOD_TYPES.L3M:
        {
          // Last 3 Months - always within a current year
          const l3m = this.getYearMonthDay(dttm.add(-2, 'months').toDate());
          period.startDate =
            today.month >= 3 ? this.createStartPeriod(l3m) : this.createStartPeriod({ ...today, month: 1, day: 1 });
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L6M:
        {
          // Last 6 Months - always within a current year
          const l6m = this.getYearMonthDay(dttm.add(-5, 'months').toDate());
          period.startDate =
            today.month >= 6 ? this.createStartPeriod(l6m) : this.createStartPeriod({ ...today, month: 1, day: 1 });
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.R6M:
        {
          // Rolling 6 Months - can go in a year before
          const r6m = this.getYearMonthDay(dttm.add(-5, 'months').toDate());

          period.startDate = this.createStartPeriod(r6m);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.TTM:
        {
          const startPeriod = dttm.add(-12, 'month').startOf('month').toDate();
          const endPeriod = dayjs(startPeriod).add(12, 'month').add(-1, 'day').toDate();

          period.startDate = this.createStartPeriod(this.getYearMonthDay(startPeriod));
          period.endDate = this.createEndPeriod(this.getYearMonthDay(endPeriod));
        }
        break;

      case PERIOD_TYPES.R12M: // current month and last 11 months
      case PERIOD_TYPES.L12M:
        {
          // Rolling 12 Months - can go in a year before
          const r12m = this.getYearMonthDay(dttm.add(-11, 'months').toDate());
          period.startDate = this.createStartPeriod(r12m);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L7DAYS:
        {
          // Last 7 days - always within a current year
          const l7d = this.getYearMonthDay(dttm.add(-6, 'day').toDate());
          period.startDate = this.createStartPeriod(l7d);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L15DAYS:
        {
          // Last 15 days - always within a current year
          const l15d = this.getYearMonthDay(dttm.add(-14, 'day').toDate());
          period.startDate = this.createStartPeriod(l15d);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L30DAYS:
        {
          // Last 30 days - always within a current year
          const l30d = this.getYearMonthDay(dttm.add(-29, 'day').toDate());
          period.startDate = this.createStartPeriod(l30d);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L60DAYS:
        {
          // Last 60 days - always within a current year
          const l60d = this.getYearMonthDay(dttm.add(-59, 'day').toDate());
          period.startDate = this.createStartPeriod(l60d);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L90DAYS:
        {
          // Last 90 days - always within a current year
          const l90d = this.getYearMonthDay(dttm.add(-89, 'day').toDate());
          period.startDate = this.createStartPeriod(l90d);
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.WEEK:
        {
          const weekStart = dttm.startOf('week');
          const weekEnd = dttm.endOf('week');
          period.startDate = this.createStartPeriod(this.getYearMonthDay(weekStart.toDate()));
          period.endDate = this.createEndPeriod(this.getYearMonthDay(weekEnd.toDate()));
        }
        break;

      case PERIOD_TYPES.L28DAYS:
        {
          // Last 28 days
          const l28d = this.getYearMonthDay(dttm.add(-27, 'day').toDate());
          period.startDate = this.createStartPeriod(l28d);
          period.endDate = this.createEndPeriod(today);
        }
        break;
    }

    return opt.format
      ? {
          startDate: this.dbFormat(period.startDate, opt),
          endDate: this.dbFormat(period.endDate, opt),
        }
      : period;
  }

  createRangePeriod(startDate, endDate) {
    const period = {
      startDate: this.createStartPeriod(this.getYearMonthDay(dayjs(startDate).toDate())),
      endDate: this.createEndPeriod(this.getYearMonthDay(dayjs(endDate).toDate())),
    };

    return period;
  }

  createRangePeriodLastYear(startDate, endDate) {
    const start = this.getYearMonthDay(dayjs(startDate).toDate());
    const end = this.getYearMonthDay(dayjs(endDate).toDate());

    const period = {
      startDate: this.createStartPeriod({ ...start, year: start.year - 1 }),
      endDate: this.createEndPeriod({ ...end, year: end.year - 1 }),
    };

    return period;
  }

  /**
   * Creates perdiod for specified year
   * @param {number} year A year to create a period for
   */
  createYearPeriod(year, opt) {
    if (!opt) {
      opt = {};
    }

    const period = {
      startDate: new Date(`${year}-01-01T00:00:00.000Z`),
      endDate: new Date(`${year}-12-31T23:59:59.999Z`),
    };

    return opt.format
      ? {
          startDate: this.dbFormat(period.startDate),
          endDate: this.dbFormat(period.endDate),
        }
      : period;
  }

  /**
   * Returns month name on its number.
   * @param {number} monthNo 0 based month number
   */
  getMonthName(monthNo) {
    const dttm = new Date();

    dttm.setDate(1);
    dttm.setMonth(monthNo);

    return monthNo >= 0 && monthNo < 12
      ? dttm.toLocaleString('default', { month: 'short' })
      : `Invalid Month ${monthNo}`;
  }

  createPeriodFromStartAndEnd(toDateStr, fromDateStr) {
    const startDate = this.createStartPeriod({ dateStr: fromDateStr });
    const endDate = this.createEndPeriod({ dateStr: toDateStr });

    return { startDate, endDate };
  }

  buildDatesArray({ startDate, endDate }) {
    let dStart = dayjs(startDate);
    const dEnd = dayjs(endDate);
    const days = [];

    while (dStart.isBefore(dEnd) || dStart.isSame(dEnd, 'day')) {
      days.push(this.createStartPeriod(this.getYearMonthDay(dStart.toDate())));
      dStart = dStart.add(1, 'day');
    }

    return days;
  }

  getSameDayLastYear(dttm) {
    const date = new Date(dttm);
    date.setFullYear(date.getFullYear() - 1);
    const diff = dttm.getDay() - date.getDay();
    date.setDate(date.getDate() + diff);

    return date;
  }

  getDateWithAddedIntervalInDays(params) {
    const { date, interval } = params || {};
    const dateWithIntervalStr = dayjs(date).add(interval, 'day').format(dateTimeFormats.dateOnly);
    return this.createStartPeriod({ dateStr: dateWithIntervalStr });
  }

  // add or substract interval and get output as date
  getDateWithIntervalInDays(params) {
    const { date, interval, opt } = params;
    const { format, dateOnlyFormat } = opt || {};
    let dateWithIntervalTemp = undefined;
    let dateWithInterval = undefined;

    if (isNaN(interval)) {
      throw new Error('Interval to add / subtract is not a number.');
    }

    if (interval > 0) {
      const add = interval;
      dateWithIntervalTemp = dayjs.utc(date).utcOffset(null, true).add(add, 'day');
    }

    if (interval < 0) {
      const subtract = Math.abs(interval);
      dateWithIntervalTemp = dayjs.utc(date).utcOffset(null, true).subtract(subtract, 'day');
    }

    dateWithInterval = dateWithIntervalTemp.toDate();

    if (format) {
      dateWithInterval = this.dbFormat(dateWithIntervalTemp.toDate());
    }

    if (dateOnlyFormat) {
      dateWithInterval = dateWithIntervalTemp.format(dateTimeFormats.dateOnly);
    }

    return dateWithInterval;
  }

  getDateAsDateOnlyFormattedStr(date) {
    return dayjs(date).format(dateTimeFormats.dateOnly);
  }

  getStartAndEndDatesWithAddedIntervalInMonths(params) {
    const { dateStr, interval } = params || {};
    const dateWithAddedInterval = dayjs(dateStr).add(interval, 'month');

    const startDateStr = dateWithAddedInterval.startOf('month').format(dateTimeFormats.dateOnly);
    const startDate = this.createStartPeriod({ dateStr: startDateStr });

    const endDateStr = dateWithAddedInterval.endOf('month').format(dateTimeFormats.dateOnly);
    const endDate = this.createEndPeriod({ dateStr: endDateStr });

    return { startDate, endDate };
  }

  // Warning: This method intentionally get the enddate int the format of '2021-05-01T00:00:00.000Z' (for equal operations)
  getStartAndEndDatesWithSubtractIntervalInMonths(params) {
    const { dateStr, interval, opt } = params || {};
    const { format, dateOnlyFormat } = opt || {};

    let dateWithInterval;
    if (interval > 0) {
      dateWithInterval = dayjs(dateStr).add(interval, 'month');
    } else {
      dateWithInterval = dayjs(dateStr).subtract(Math.abs(interval), 'month');
    }

    const startDateStr = dateWithInterval.startOf('month').format(dateTimeFormats.dateOnly);
    const startDate = this.createStartPeriod({ dateStr: startDateStr });

    const endDateStr = dateWithInterval.endOf('month').format(dateTimeFormats.dateOnly);
    const endDate = this.createStartPeriod({ dateStr: endDateStr });

    let startAndEndOfMonth = { startDate, endDate };

    if (format) {
      startAndEndOfMonth = { startDate: this.dbFormat(startDate), endDate: this.dbFormat(endDate) };
    }

    if (dateOnlyFormat) {
      startAndEndOfMonth = {
        startDate: dayjs(startDate).format(dateTimeFormats.dateOnly),
        endDate: dayjs(endDate).format(dateTimeFormats.dateOnly),
      };
    }

    return startAndEndOfMonth;
  }

  getYearsAndMonthsBetweenDates(args) {
    const { startDate, endDate } = args;
    const monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const startDttm = dayjs.utc(startDate).utcOffset(null, true).toDate();
    const endDttm = dayjs.utc(endDate).utcOffset(null, true).toDate();

    const { year: startYear, month: startMonth } = this.getYearMonthDay(startDttm);
    const { year: endYear, month: endMonth } = this.getYearMonthDay(endDttm);

    const allYearsAndMonths = {};

    // months if the start year and the end year is the same
    if (startYear == endYear) {
      allYearsAndMonths[startYear] = range(startMonth - 1, endMonth).reduce((acc, curr) => {
        acc[monthsList[curr]] = monthsList[curr];
        return acc;
      }, {});

      return allYearsAndMonths;
    }

    //if start year and end year is not the same build for all years
    // months for start year
    allYearsAndMonths[startYear] = range(startMonth - 1, 12).reduce((acc, curr) => {
      acc[monthsList[curr]] = monthsList[curr];
      return acc;
    }, {});

    // all months for mid years
    const reformedMonthsList = monthsList.reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {});
    if (endYear - startYear > 1) {
      range(startYear + 1, endYear).forEach((year) => {
        allYearsAndMonths[year] = reformedMonthsList;
      });
    }

    // months for end year
    allYearsAndMonths[endYear] = range(0, endMonth).reduce((acc, curr) => {
      acc[monthsList[curr]] = monthsList[curr];
      return acc;
    }, {});

    return allYearsAndMonths;
  }

  getYearMonthDayFromDateStr(dateStr) {
    const dttm = dayjs.utc(dateStr).utcOffset(null, true).toDate();
    return this.getYearMonthDay(dttm);
  }

  getAllDatesWithinRange(params) {
    const { startDate, endDate } = params;
    const end = dayjs(endDate).utc();
    const allDates = [];

    for (let current = dayjs(startDate).utc(); current.isBefore(end); current = current.add(1, 'day')) {
      const currDate = this.createStartPeriod({ date: current.toDate() });
      allDates.push(currDate);
    }

    return allDates;
  }

  transformAllDatesToStringDateOnlyFormat(params) {
    const transfromedDates = params.map((date) => dayjs(date).utc().format(dateTimeFormats.dateOnly));
    return transfromedDates;
  }

  setYearToPeriod({ period, year, format }) {
    if (!period) {
      return period;
    }

    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);

    startDate.setUTCFullYear(year);
    endDate.setUTCFullYear(year);

    return format
      ? {
          startDate: this.dbFormat(startDate),
          endDate: this.dbFormat(endDate),
        }
      : {
          startDate,
          endDate,
        };
  }

  applyOffsetByType({ dateStr, customDate, offsetType, debug, opt }) {
    if (OFFSET_TYPES_NAMES.indexOf(offsetType) === -1) {
      return dateStr;
    }

    if (!opt) {
      opt = {};
    }

    const dttm = dayjs(this.dbFormat(dateStr, { dateOnly: true }));

    let resultDate = null;

    // TODO: Need to deal with the month last day for times when
    // we go from one month to another it may happen that the new
    // month has less days than original one so need adjustment of
    // the day

    switch (offsetType) {
      default:
        resultDate = dttm;
        break;

      case OFFSET_TYPES.LAST_YEAR:
        resultDate = dttm
          .year(dttm.year() - 1)
          .month(dttm.month())
          .date(dttm.date());
        break;

      case OFFSET_TYPES.LAST_MONTH:
        resultDate = dttm.add(-1, 'month');
        break;

      case OFFSET_TYPES.MONTH_BEFOR_PM:
        resultDate = dttm.add(-2, 'month');
        break;

      case OFFSET_TYPES.NEXT_MONTH:
        resultDate = dttm.add(1, 'month');
        break;

      case OFFSET_TYPES.MONTH_AFTER_NM:
        resultDate = dttm.add(2, 'month');
        break;

      case OFFSET_TYPES.CUSTOM_YEAR:
        {
          const cdttm = dayjs(this.dbFormat(customDate, { dateOnly: true }));
          resultDate = dttm.year(cdttm.year()).month(dttm.month()).date(dttm.date());
        }
        break;
    }

    return opt.format
      ? this.dbFormat(resultDate.toDate(), opt)
      : new Date(`${this.dbFormat(resultDate.toDate())}T00:00:00.000Z`, opt);
  }

  /**
   * Checks if the passed date is after today's date and if yes then returns today's date otherwise returns passed
   * @param args: consists of mandatory endDate and optional opt parameter.
   *              endDate is to compare with today date opt contains a flag to ask the result to be formatted
   * @returns Modified (corrected) or unmodified (passed) end date
   */
  correctEndDate(args) {
    const { endDate, format } = args;
    let correctedDate;

    const today = this.dbUtcNow();
    const endDateIsAfterToday = dayjs(endDate).isAfter(dayjs(today));

    if (endDateIsAfterToday) {
      const endPeriodForToday = this.createEndPeriod({ dateStr: today });
      correctedDate = dayjs(endPeriodForToday).toDate();
    } else {
      correctedDate = dayjs(endDate).toDate();
    }

    if (format) {
      correctedDate = this.dbFormat(correctedDate);
    }

    return correctedDate;
  }

  /**
   * Gets a day in a month from the current date
   * @param currentDate current date
   * @returns return date
   */
  getDayInMonth(currentDate) {
    const dt = new Date(currentDate);
    return dt.getUTCDate();
  }

  /**
   * Gets number of week from the current date
   */
  getNumberOfWeek(currentDate) {
    const date = new Date(currentDate);
    const firstDayOfYear = new Date(date.getUTCFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}

/**
 * Supported periods
 */

DateTimeHelpers.PeriodTypes = PERIOD_TYPES;
DateTimeHelpers.offsetTypes = OFFSET_TYPES;

export { DateTimeHelpers, PERIOD_TYPES, PERIOD_TYPES_NAMES, OFFSET_TYPES_NAMES };
