import gql from 'graphql-tag';

const CUSTOM_TABLE_ROW_COLUMN_CFG_LIST_QUERY = gql`
  query ($params: CustomTableRowColumnCfgFilter, $pagination: PaginationAndSortingInput) {
    customTableRowColumnCfgList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        customTableTypeId
        dataSourceId
        orderNo
        thisIsRow
        name
        inputTypeId
        allowedValues
        defaultValue
      }
    }
  }
`;

const customTableRowColumnCfgQueries = {
  list: CUSTOM_TABLE_ROW_COLUMN_CFG_LIST_QUERY,
};

export { customTableRowColumnCfgQueries };
