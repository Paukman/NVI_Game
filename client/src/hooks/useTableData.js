import { useCallback, useState, useMemo } from 'react';
import logger from 'utils/logger';

export const useTableData = () => {
  const [tableData, setTabledata] = useState([]);
  const [groupTableData, setGroupTabledata] = useState({ groupData: [], isGroupedByProperty: false });

  const onRequestTableData = useCallback(
    (value) => {
      logger.debug('Table value updated with value ', value);
      setTabledata(value);
    },
    [tableData],
  );

  const onGetGroupData = (groupData) => { 
    setGroupTabledata({ ...groupTableData,...groupData });
  };

  return { onRequestTableData, onGetGroupData, tableData, groupTableData };
};

export const useGetTableHeaders = (columnsCfg, paramHeaders) => {
  const mappedHeaders = useMemo(
    () =>
      columnsCfg?.map((column) => {
        const { title, subColumns } = column || {};
        return {
          title,
          spanLength: subColumns?.length ?? 1,
        };
      }),
    [columnsCfg],
  );

  const tableHeaders = useCallback(() => {
    const headers = [{ span: 1, single: true }];
    mappedHeaders?.forEach((header) => {
      headers.push({
        span: header.spanLength,
        content: header.title,
      });
    });
    return headers;
  }, [mappedHeaders]);

  const subHeader = [];
  const span = [];
  let count = 1;
  (paramHeaders ?? tableHeaders()).forEach((item) => {
    subHeader.push(item?.content ? item?.content : '');
    if (item?.single) {
      span.push([count, count]);
      count++;
    } else {
      span.push([count, count + item?.span - 1]);
      count += item?.span;
    }
  });

  return { subHeader, span };
};
