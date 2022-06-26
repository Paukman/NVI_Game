import gql from 'graphql-tag';

const PNL_REPORT_CUSTOM_VIEW_LIST_QUERY = gql`
  query ($params: PnlReportCustomViewFilter, $pagination: PaginationAndSortingInput) {
    pnlReportCustomViewList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        viewName
        viewDescription
        statusId
        customViewGroups {
          pnlReportGroup {
            header
            footer
          }
        }
        permissions
      }
    }
  }
`;

const PNL_REPORT_CUSTOM_VIEW_GET_QUERY = gql`
  query ($id: ID) {
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
  }
`;

const PNL_REPORT_CUSTOM_VIEW_GETMANY_QUERY = gql`
  query ($id: [ID]) {
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
  }
`;

const PNL_REPORT_CUSTOM_VIEW_CREATE_MUTATION = gql`
  mutation ($params: PnlReportCustomViewInput) {
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
  }
`;

const PNL_REPORT_CUSTOM_VIEW_UPDATE_MUTATION = gql`
  mutation ($id: ID, $params: PnlReportCustomViewInput) {
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
  }
`;

const PNL_REPORT_CUSTOM_VIEW_REMOVE_MUTATION = gql`
  mutation ($id: ID) {
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
  }
`;

const PNL_REPORT_CUSTOM_VIEW_REMOVEMANY_MUTATION = gql`
  mutation ($id: [ID]) {
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
  }
`;

const pnlReportCustomViewQueries = {
  list: PNL_REPORT_CUSTOM_VIEW_LIST_QUERY,
  get: PNL_REPORT_CUSTOM_VIEW_GET_QUERY,
  getMany: PNL_REPORT_CUSTOM_VIEW_GETMANY_QUERY,
  create: PNL_REPORT_CUSTOM_VIEW_CREATE_MUTATION,
  update: PNL_REPORT_CUSTOM_VIEW_UPDATE_MUTATION,
  remove: PNL_REPORT_CUSTOM_VIEW_REMOVE_MUTATION,
  removeMany: PNL_REPORT_CUSTOM_VIEW_REMOVEMANY_MUTATION,
};

export { pnlReportCustomViewQueries };
