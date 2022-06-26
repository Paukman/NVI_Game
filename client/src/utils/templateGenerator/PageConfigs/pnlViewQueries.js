const config = {
  name: 'pnlReportCustomView',
  queries: [
    {
      name: `pnlReportCustomViewList`,
      method: 'list',
      query: `query($params: PnlReportCustomViewFilter, $pagination: PaginationAndSortingInput) {
            pnlReportCustomViewList(params: $params, pagination: $pagination) {
              code
              errors {
                name
                messages
              }
              data {
                viewName
                viewDescription
                statusId
                userCreated{
                  displayName
                }
                userUpdated{
                  displayName
                }
                organization {
                  companyName
                }
                permissions
              }
            }
          }`,
      message: 'fetching Custom View List',
    },
    {
      name: `pnlReportCustomViewGet`,
      method: 'get',
      query: `query($id: ID) {
        pnlReportCustomViewGet(id: $id) {
          code
          errors {
            name
            messages
          }
          data {
            viewName
            viewDescription
            statusId
          }
        }
      }`,
      message: 'getting Custom View',
    },
    {
      name: `pnlReportCustomViewGetMany`,
      method: 'getMany',
      query: `query($id: [ID]) {
        pnlReportCustomViewGetMany(id: $id) {
          code
          errors {
            name
            messages
          }
          data {
            viewName
            viewDescription
            statusId
          }
        }
      }`,
      message: 'getting Custom Views',
    },
    {
      name: `pnlReportCustomViewCreate`,
      method: 'create',
      mutation: `mutation($params: PnlReportCustomViewInput) {
        pnlReportCustomViewCreate(params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            viewName
            viewDescription
            statusId
          }
        }
      }`,
      message: 'creating Custom View',
    },
    {
      name: `pnlReportCustomViewUpdate`,
      method: 'update',
      mutation: `mutation($id: ID, $params: PnlReportCustomViewInput) {
        pnlReportCustomViewUpdate(id: $id, params: $params) {
          code
          errors {
            name
            messages
          }
          data {
            viewName
            viewDescription
            statusId
          }
        }
      }`,
      message: 'updating Custom View',
    },
    {
      name: `pnlReportCustomViewRemove`,
      method: 'remove',
      mutation: `mutation($id: ID) {
        pnlReportCustomViewRemove(id: $id) {
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
      message: 'removing Custom View',
    },
    {
      name: `pnlReportCustomViewRemoveMany`,
      method: 'removeMany',
      mutation: `mutation($id: [ID]) {
        pnlReportCustomViewRemoveMany(id: $id) {
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
      message: 'removing Custom Views',
    },
  ],
};

// templa

module.exports = {
  config,
};
