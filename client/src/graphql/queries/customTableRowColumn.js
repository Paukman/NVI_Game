import gql from 'graphql-tag';

const CUSTOM_TABLE_ROW_COLUMN_GET_QUERY = gql`
  query ($id: ID!) {
    customTableRowColumnGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        customTableId
        orderNo
        thisIsRow
        name
        dataSourceId
        hotelId
        brandId
        priority
        description
        hotelGroupId
        mdoGlCode
        kpiId
        period
        valueTypeId
        valueDataType
        valueDateOffsetType
        budgetForecastNumber
        aggregator
        formula
        valueFormat
        valueDecimals
        displaySize
        customDate
        rowColumnKey
      }
    }
  }
`;

const CUSTOM_TABLE_ROW_COLUMN_CREATE_MUTATION = gql`
  mutation ($params: CustomTableRowColumnInput) {
    customTableRowColumnCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        customTableId
        orderNo
        thisIsRow
        name
        dataSourceId
        hotelId
        brandId
        priority
        description
        hotelGroupId
        mdoGlCode
        kpiId
        period
        valueTypeId
        valueDataType
        valueDateOffsetType
        budgetForecastNumber
        aggregator
        formula
        valueFormat
        valueDecimals
        displaySize
        customDate
        rowColumnKey
      }
    }
  }
`;

// TODO:
const CUSTOM_TABLE_ROW_COLUMN_UPDATE_MUTATION = gql`
  mutation ($id: ID!, $params: CustomTableRowColumnInput) {
    customTableRowColumnUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        customTableId
        orderNo
        thisIsRow
        name
        dataSourceId
        hotelId
        brandId
        priority
        description
        hotelGroupId
        mdoGlCode
        kpiId
        period
        valueTypeId
        valueDataType
        valueDateOffsetType
        budgetForecastNumber
        aggregator
        formula
        valueFormat
        valueDecimals
        displaySize
        customDate
        rowColumnKey
      }
    }
  }
`;

// TODO:
const CUSTOM_TABLE_ROW_COLUMN_REMOVE_MUTATION = gql`
  mutation ($id: ID!) {
    customTableRowColumnRemove(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
      }
    }
  }
`;

const CUSTOM_TABLE_ROW_COLUMN_SET_ORDER_MUTATION = gql`
  mutation ($params: CustomTableColumnOrderInput) {
    customTableRowColumnSetOrder(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
      }
    }
  }
`;

const customTableRowColumnQueries = {
  get: CUSTOM_TABLE_ROW_COLUMN_GET_QUERY,
  create: CUSTOM_TABLE_ROW_COLUMN_CREATE_MUTATION,
  update: CUSTOM_TABLE_ROW_COLUMN_UPDATE_MUTATION,
  remove: CUSTOM_TABLE_ROW_COLUMN_REMOVE_MUTATION,
  setOrder: CUSTOM_TABLE_ROW_COLUMN_SET_ORDER_MUTATION,
};

export { customTableRowColumnQueries };
