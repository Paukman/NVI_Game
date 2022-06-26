const config = {
  name: 'GLCodes',
  queries: [
    {
      name: `hmgGlCodeList`,
      method: 'list',
      query: `query($params: HmgGlCodeFilter, $pagination: PaginationAndSortingInput) {
            hmgGlCodeList(params: $params, pagination: $pagination) {
              code
              errors {
                name
                messages
              }
              data {
                id
                hotelId
                hmgGlCode
                displayName
                mdoGlCode
                statusId
              }
            }
          }`,
      message: 'fetching GL Code List',
    },
    {
      name: `hmgGlCodeGet`,
      method: 'get',
      query: `query($id: ID!) {
        hmgGlCodeGet(id: $id) {
          code
          errors {
            name
            messages
          }
          data {
            id
            hotelId
            hmgGlCode
            displayName
            mdoGlCode
            statusId
          }
        }
      }`,
      message: 'getting GL Code',
    },
    {
      name: `hmgGlCodeCreate`,
      method: 'create',
      mutation: `mutation($params: HmgGlCodeInput!) {
        hmgGlCodeCreate(params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            id
            hotelId
            hmgGlCode
            displayName
            mdoGlCode
            statusId
          }
        }
      }`,
      message: 'creating GL Code',
    },
    {
      name: `hmgGlCodeUpdate`,
      method: 'update',
      mutation: `mutation($id: ID!, $params: HmgGlCodeInput!) {
        hmgGlCodeUpdate(id: $id, params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            id
            hotelId
            hmgGlCode
            displayName
            mdoGlCode
            statusId
          }
        }
      }`,
      message: 'updating Custom View',
    },
    {
      name: `hmgGlCodeRemove`,
      method: 'remove',
      mutation: `mutation($id: ID!) {
        hmgGlCodeRemove(id: $id) {
          code
          errors {
            name
            messages
          }
          data {
            id
          }
        }
      }`,
      message: 'removing GL Code',
    },
    {
      name: `hmgGlCodeMap`,
      method: 'mapping',
      mutation: `mutation($params: HmgGlCodeMapInput!) {
        hmgGlCodeMap(params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            id
            hotelId
            hmgGlCode
            displayName
            mdoGlCode
            statusId
          }
        }
      }`,
      message: 'mapping GL Code',
    },
    {
      name: `hmgGlCodeSetStatus`,
      method: 'setStatus',
      mutation: `mutation($params: HmgGlCodeSetStatusInput) {
            hmgGlCodeSetStatus(params: $params) {
              code
              errors {
                name
                messages
              }
              data {
                hotelId
                statusId
              }
            }
          }`,
      message: 'setting GL Code Status',
    },
    {
      name: `hmgGlCodeSetStatusAll`,
      method: 'setStatusAll',
      mutation: `mutation($params: HmgGlCodeSetStatusAllInput!) {
        hmgGlCodeSetStatusAll(params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            mdoGlCode
            statusId
          }
        }
      }`,
      message: 'setting All GL Code Statuses',
    },
    {
      name: `hmgGlCodeListMdoStatus`,
      method: 'listMdo',
      query: `query($params: HmgGlCodeListMdoStatusInput) {
        hmgGlCodeListMdoStatus(params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            mdoGlCode
            statusId
          }
        }
      }`,
      message: 'listing MDO status',
    },
    {
      name: `hmgGlCodeCopyMapping`,
      method: 'copy',
      mutation: `mutation($params: HmgGlCodeCopyMappingInput!) {
        hmgGlCodeCopyMapping(params: $params) {
          code
          errors {
            name
            messages
          }
        }
      }`,
      message: 'copying mapping',
    },
  ],
};

// templa

module.exports = {
  config,
};
