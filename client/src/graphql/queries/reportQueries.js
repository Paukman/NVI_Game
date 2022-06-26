import gql from 'graphql-tag';

const REPORT_LIST_QUERY = gql`
  query($params: ReportParams, $pagination: PaginationAndSortingInput) {
    reportList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        reportName
        reportDescription
        iconName
        imageUrl
        appPageKey
        appSettingCodePrefix
        fileNamePrefix
        graphqlQuery
        parentIdName
        orderNo
        reportStatusId
        reportFilters {
          filterComponent
          filterParamName
          valueTypeId
          filterLabel
          filterOptions
          componentAttributes
          isVisible
          defaultValue
          orderNo
          filterStatusId
        }
        appPage {
          pagePath
          pageToggles {
            toggleName
            toggleIcon
            toggleTooltip
            referToPageKey
            orderNo
            toggleStatusId
          }
        }
      }
    }
  }
`;

const REPORT_GET_QUERY = gql`
  query($id: ID!) {
    reportGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        reportName
        reportDescription
        iconName
        imageUrl
        appPageKey
        appSettingCodePrefix
        fileNamePrefix
        graphqlQuery
        parentIdName
        orderNo
        reportStatusId
        reportFilters {
          filterComponent
          filterParamName
          valueTypeId
          filterLabel
          filterOptions
          componentAttributes
          isVisible
          defaultValue
          orderNo
          filterStatusId
        }
        appPage {
          pagePath
          pageToggles {
            toggleName
            toggleIcon
            toggleTooltip
            referToPageKey
            orderNo
            toggleStatusId
          }
        }
      }
    }
  }
`;

const REPORT_GET_MANY_QUERY = gql`
  query($id: [ID!]) {
    reportGetMany(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        reportName
        reportDescription
        iconName
        imageUrl
        appPageKey
        appSettingCodePrefix
        fileNamePrefix
        graphqlQuery
        parentIdName
        orderNo
        reportStatusId
        reportFilters {
          filterComponent
          filterParamName
          valueTypeId
          filterLabel
          filterOptions
          componentAttributes
          isVisible
          defaultValue
          orderNo
          filterStatusId
        }
        appPage {
          pagePath
          pageToggles {
            toggleName
            toggleIcon
            toggleTooltip
            referToPageKey
            orderNo
            toggleStatusId
          }
        }
      }
    }
  }
`;

const reportQueries = {
  list: REPORT_LIST_QUERY,
  get: REPORT_GET_QUERY,
  getMany: REPORT_GET_MANY_QUERY,
};

export { reportQueries };
