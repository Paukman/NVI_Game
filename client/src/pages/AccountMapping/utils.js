import dayjs from 'dayjs';
import { mapAccountMappingSalesColumns, pageState } from './constants';
import { getText } from 'utils/localesHelpers';
import { exportToXLSX } from 'utils/downloadHelpers';
import { buildDownloadableFilename } from '../../utils/downloadHelpers';

export const prepareDataForAccountMappingSales = (data) => {
  let listData = [];
  let subHeaders = [];
  let headers = []

  // add more conditions here if needed
  if (Array.isArray(data) && data?.length) {
    /***
     * This is just an example how it could be done.
     * Prepare your data for listing based on your input. 
    */

    /*
    data.sections?.forEach((section) => {
      // section header
      const sectionRow = {
        title: getText(`strReports.${section.name}`),
        hasHorizontalTopBorder: true,
        removeBottomBorder: true,
        id: getText(`strReports.${section.name}`),
      };
      listData.push(sectionRow);
 
      // data
      section.items?.forEach((item, index) => {
        const singleDisplayRow = { title: getText(`strReports.${item.name}`), id: `${section.name}_${item.name}` };
        subHeaderDates.forEach((date, i) => {
          if (section.name === 'revPar' && (item.name === 'myProperty' || item.name === 'compSet')) {
            // exceptions on calculations, these are not percentages, so no need to multiply by 100
            singleDisplayRow[date] = item.columnsData?.[i].toFixed(2);
          } else {
            singleDisplayRow[date] = Number(item.columnsData?.[i] * 100).toFixed(2);
          }
        });
        listData.push(singleDisplayRow);
      });
    });
    */

    // map your data here for recursive table
    subHeaders = mapAccountMappingSalesColumns(subHeaderDates);

    //create your headers if needed
    headers = []
  }
  return { subHeaders, listData, headers };
};

export const downloadExcelFile = (value, state) => {
  if (state?.listData?.length > 0) {
    let excelData = [];
  }

  /**
   * create your own excel mapping here 
   * This is just an example
   *  
   * */
  return null;
};

