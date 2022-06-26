const config = {
  name: 'DashboardComments',
  queries: [
    {
      name: `dashboardCommentList`,
      method: 'list',
      query: `query($params: DashboardCommentFilter, $pagination: PaginationAndSortingInput) {
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
            kpis{
              id
              kpiName
            }
            users {
              id
              username
            }
            parentCommentId
            startDate
            endDate
            hasReplies
            commentStatusId
            userCreated {
              id
              username
            }
            permissions
          }
        }
      }`,
      message: 'fetching Dashboard Comment List',
    },
    {
      name: `dashboardCommentCreate`,
      method: 'create',
      mutation: `mutation($params: DashboardCommentInput) {
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
      }`,
      message: 'creating Dashboard Comment',
    },
    {
      name: `dashboardCommentUpdate`,
      method: 'update',
      mutation: `mutation($id: ID, $params: DashboardCommentInput) {
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
      }`,
      message: 'updating Dashboard Comment',
    },
    {
      name: `dashboardCommentRemove`,
      method: 'remove',
      mutation: `mutation($id: ID) {
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
      }`,
      message: 'removing Dashboard Comment',
    },
    {
      name: `dashboardCommentStatusSet`,
      method: 'setStatus',
      mutation: `mutation($id: ID, $params: DashboardCommentStatusInput) {
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
      }`,
      message: 'setting Dashboard Comment status',
    },
  ],
};

module.exports = {
  config,
};
