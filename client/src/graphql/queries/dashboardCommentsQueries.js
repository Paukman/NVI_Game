import gql from 'graphql-tag';

const DASHBOARD_COMMENTS_LIST_QUERY = gql`
  query ($params: DashboardCommentFilter, $pagination: PaginationAndSortingInput) {
    dashboardCommentList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        message
        hotelId
        dashboardId
        kpis {
          id
          kpiName
        }
        users {
          id
          username
        }
        hotel {
          hotelName
          id
        }
        parentCommentId
        startDate
        endDate
        hasReplies
        commentStatusId
        permissions
        createdBy
        updatedBy
        createdAt
        updatedAt
        userCreated {
          id
          username
        }
        userUpdated {
          id
          username
        }
      }
    }
  }
`;

const DASHBOARD_COMMENTS_CREATE_MUTATION = gql`
  mutation ($params: DashboardCommentInput) {
    dashboardCommentCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        message
        dashboardId
        parentCommentId
        startDate
        endDate
        userCreated {
          id
          username
        }
        permissions
      }
    }
  }
`;

const DASHBOARD_COMMENTS_UPDATE_MUTATION = gql`
  mutation ($id: ID, $params: DashboardCommentInput) {
    dashboardCommentUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        message
        dashboardId
        parentCommentId
        startDate
        endDate
        userCreated {
          id
          username
        }
        permissions
      }
    }
  }
`;

const DASHBOARD_COMMENTS_REMOVE_MUTATION = gql`
  mutation ($id: ID) {
    dashboardCommentRemove(id: $id) {
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

const DASHBOARD_COMMENTS_SETSTATUS_MUTATION = gql`
  mutation ($id: ID, $params: DashboardCommentStatusInput) {
    dashboardCommentStatusSet(id: $id, params: $params) {
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

const dashboardCommentsQueries = {
  list: DASHBOARD_COMMENTS_LIST_QUERY,
  create: DASHBOARD_COMMENTS_CREATE_MUTATION,
  update: DASHBOARD_COMMENTS_UPDATE_MUTATION,
  remove: DASHBOARD_COMMENTS_REMOVE_MUTATION,
  setStatus: DASHBOARD_COMMENTS_SETSTATUS_MUTATION,
};

export { dashboardCommentsQueries };
