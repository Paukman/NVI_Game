export const columnNamesMapping = (subHeaders) => {
  let columnNamesMapping = {};
  subHeaders?.map((header) => {
    columnNamesMapping[header.field] = {
      name: header.field === 'description' ? 'Description' : header.headerName,
      format:
        header.field !== 'description' && header.field !== 'hmgGlCode' && header.field !== 'adjustmentNote'
          ? true
          : false,
    };
  });
  return columnNamesMapping;
};
