const config = {
  name: 'CustomTable',
  queries: [
    {
      name: `customTableList`,
      method: 'list',
      query: `query ($params: CustomTableFilter, $pagination: PaginationAndSortingInput) {
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
          }`,
      message: 'fetching Custom Table List',
    },
    {
      name: `customTableUpdate`,
      method: 'update',
      mutation: `mutation ($id: ID!, $params: CustomTableInput) {
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
          }`,
      message: 'fetching Custom Table List',
    },
  ],
};

module.exports = {
  config,
};
