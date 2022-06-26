import gql from 'graphql-tag';

const DASHBOARD_WIDGET_LIST_QUERY = gql`
  query($params: DashboardWidgetFilter, $pagination: PaginationAndSortingInput) {
    dashboardWidgetList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        dashboardId
        orderNo
        widgetId
        widgetTypeId
        width
        height
        defaultPeriod
        defaultPriority
        widgetGroupKey
        widgetName
        widgetShortName
        alwaysFirst
        movable
        hasWrapper
        canChangePeriod
        canChangePriority
        statusId
        createdBy
        createdAt
        updatedAt
        permissions
      }
    }
  }
`;

const DASHBOARD_WIDGET_GET_QUERY = gql`
  query($id: ID) {
    dashboardWidgetGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        dashboardId
        orderNo
        widgetId
        widgetTypeId
        width
        height
        defaultPeriod
        defaultPriority
        widgetGroupKey
        widgetName
        widgetShortName
        alwaysFirst
        movable
        hasWrapper
        canChangePeriod
        canChangePriority
        createdBy
        createdAt
        updatedAt
        permissions
      }
    }
  }
`;

const DASHBOARD_WIDGET_SET_ORDER_MUTATION = gql`
  mutation($params: DashboardWidgetOrderInput) {
    dashboardWidgetSetOrder(params: $params) {
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

const DASHBOARD_WIDGET_CREATE_MUTATION = gql`
  mutation($params: DashboardWidgetInput) {
    dashboardWidgetCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        dashboardId
        orderNo
        widgetId
        widgetTypeId
        width
        height
        defaultPeriod
        defaultPriority
        widgetGroupKey
        widgetName
        widgetShortName
        alwaysFirst
        movable
        hasWrapper
        canChangePeriod
        canChangePriority
        createdBy
        createdAt
        updatedAt
        permissions
        userCreated {
          displayName
        }
      }
    }
  }
`;

const DASHBOARD_WIDGET_UPDATE_MUTATION = gql`
  mutation($id: ID, $params: DashboardWidgetInput) {
    dashboardWidgetUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        dashboardId
        orderNo
        widgetId
        widgetTypeId
        width
        height
        defaultPeriod
        defaultPriority
        widgetGroupKey
        widgetName
        widgetShortName
        alwaysFirst
        movable
        hasWrapper
        canChangePeriod
        canChangePriority
        createdBy
        createdAt
        updatedAt
        permissions
        userCreated {
          displayName
        }
      }
    }
  }
`;

const DASHBOARD_WIDGET_REMOVE_MUTATION = gql`
  mutation($id: ID) {
    dashboardWidgetRemove(id: $id) {
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

const DASHBOARD_WIDGET_TOGGLE_MUTATION = gql`
  mutation($params: DashboardWidgetToggleInput) {
    dashboardWidgetSetToggle(params: $params) {
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

const dashboardWidgetQueries = {
  list: DASHBOARD_WIDGET_LIST_QUERY,
  get: DASHBOARD_WIDGET_GET_QUERY,
  setOrder: DASHBOARD_WIDGET_SET_ORDER_MUTATION,
  create: DASHBOARD_WIDGET_CREATE_MUTATION,
  udpate: DASHBOARD_WIDGET_UPDATE_MUTATION,
  remove: DASHBOARD_WIDGET_REMOVE_MUTATION,
  status: DASHBOARD_WIDGET_TOGGLE_MUTATION,
};

export { dashboardWidgetQueries };
