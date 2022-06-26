import gql from 'graphql-tag';

const CUSTOM_TABLE_LIST_QUERY = gql`
  query ($params: CustomTableFilter, $pagination: PaginationAndSortingInput) {
    customTableList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        userId
        customTableKey
        customTableTypeId
        tableName
        tableDescription
        valueDecimals
        enableCompareTo
        valueDateOffsetType
        customDate
      }
    }
  }
`;

const CUSTOM_TABLE_UPDATE_MUTATION = gql`
  mutation ($id: ID!, $params: CustomTableInput) {
    customTableUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        userId
        customTableTypeId
        tableName
        tableDescription
        valueDecimals
        enableCompareTo
        valueDateOffsetType
        customDate
      }
    }
  }
`;

const customTableQueries = {
  list: CUSTOM_TABLE_LIST_QUERY,
  update: CUSTOM_TABLE_UPDATE_MUTATION,
};

export { customTableQueries };
