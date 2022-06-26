export const columnNamesMapping = (subHeaders) => {
  let columnNamesMapping = {};
  subHeaders?.map((header) => {
    columnNamesMapping[header.field] = {
      name: header.field === 'description' || header.field === 'total' ? header.headerName : header.headerName,
      format: header.field !== 'description' ? true : false,
    };
  });
  return columnNamesMapping;
};
