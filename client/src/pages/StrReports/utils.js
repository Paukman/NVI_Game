import dayjs from 'dayjs';
import { mapStrDefaultReportColumns } from './constants';
import { getText } from 'utils/localesHelpers';
import { colors, formatValue } from 'mdo-react-components';
export const getHotelName = (hotelId, hotels) => {
  const hotelName = hotels[hotelId].hotelName;
  return hotelName;
};

export const PrepareDataForDefaultSTRReport = (data) => {
  const subHeaderDates = [];
  const fourWeeksHeader = [{ span: 1, single: true }];
  const fiftyTwoWeeksHeader = [{ span: 1, single: true, borderRight: `1px solid ${colors.mediumGray}` }];
  const borderIndexes = [];
  data.columnsCfg?.forEach((obj, index) => {
    const temp = borderIndexes[index - 1] || 0;
    borderIndexes.push(obj.days.length + temp);

    obj.days?.forEach((day) => {
      subHeaderDates.push(dayjs(day).format('ddd - M/D'));
    });
    fourWeeksHeader.push({
      content: `${getText('strReports.week')} ${(index + 1).toString()}`,
      span: obj.days?.length,
    });
    fiftyTwoWeeksHeader.push({
      content: `${getText('strReports.week')} ${obj?.weekNo?.toString()}`,
      span: obj.days?.length,
    });
  });

  const listingData = [];

  data.sections?.forEach((section) => {
    // section header
    const sectionRow = {
      title: getText(`strReports.${section.name}`),
      hasHorizontalTopBorder: true,
      removeBottomBorder: true,
      id: getText(`strReports.${section.name}`),
    };
    listingData.push(sectionRow);

    // data
    section.items?.forEach((item, index) => {
      const singleDisplayRow = { title: getText(`strReports.${item.name}`), id: `${section.name}_${item.name}` };
      subHeaderDates.forEach((date, i) => {
        singleDisplayRow[date] = formatValue({
          value: item.columnsData?.[i],
          valueTypeId: item.valueTypeId,
          noValueStr: '',
          valueDecimals: 2,
          displaySize: 'as-is',
          ignoreFormatSign: item.ignoreFormatSign,
        });
      });
      listingData.push(singleDisplayRow);
    });
  });

  const subHeaders = mapStrDefaultReportColumns(subHeaderDates, borderIndexes);
  const headers = {
    fourWeeksHeader,
    fiftyTwoWeeksHeader,
  };

  return { subHeaders, listingData, headers };
};
