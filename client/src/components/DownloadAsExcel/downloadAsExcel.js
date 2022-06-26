import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import ReactExport from 'react-export-excel';
import logger from '../../utils/logger';

import { HiddenButton } from './styled';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const headerStyle = [
  { fill: { patternType: 'solid', bgColor: { rgb: '#3b6cb4' } } },
  { font: { color: { rgb: 'FFFEFEFE' } } },
];

const DownloadAsExcel = forwardRef((props, ref) => {
  const { data, headers, fileName, sheetName } = props || {};
  const [data2use, setData2Use] = useState({
    items: [],
    headers: [],
  });
  const [headers2Use, setHeaders2Use] = useState([]);

  useEffect(() => {
    let tmpHeaders = headers;
    if (!Array.isArray(headers) || headers.length === 0) {
      tmpHeaders = Object.keys(data[0]).reduce((acc, item) => {
        acc.push({
          accessor: item,
          title: item,
        });
        return acc;
      }, []);
    }

    setHeaders2Use(tmpHeaders);

    if (Array.isArray(data)) {
      const renderers = tmpHeaders.filter((header) => typeof header.onRender === 'function');
      if (renderers.length > 0) {
        setData2Use({
          items: cloneDeep(data).map((item) => {
            renderers.forEach((renderer) => {
              item[renderer.accessor] = renderer.onRender(item);
            });
            return item;
          }),
          headers: tmpHeaders,
        });
      } else {
        setData2Use({
          items: data,
          headers: tmpHeaders,
        });
      }
    }
  }, [data, headers]);

  if (!Array.isArray(data)) {
    logger.error(`The DownloadAsExcel expected to get an array in the 'data' but got: `, data);
  }

  return (
    <ExcelFile filename={fileName} element={<HiddenButton ref={ref} />}>
      <ExcelSheet data={data2use.items} name={sheetName}>
        {data2use.headers.map((item) => {
          return <ExcelColumn key={item.accessor} label={item.title} value={item.accessor} style={headerStyle} />;
        })}
      </ExcelSheet>
    </ExcelFile>
  );
});

DownloadAsExcel.displayName = 'DownloadAsExcel';

DownloadAsExcel.propTypes = {
  fileName: PropTypes.string.isRequired,
  sheetName: PropTypes.string,
  data: PropTypes.array,
  headers: PropTypes.array,
};

DownloadAsExcel.defaultProps = {
  sheetName: 'Data',
};

export { DownloadAsExcel };
