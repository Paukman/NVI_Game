import gql from 'graphql-tag';

const MISSING_DATA_GET_QUERY = gql`
  query ($params: MissingDataParams) {
    missingDataGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        reportName
        hotelIds
        startDate
        endDate
        period
        date
        reportMissingDates {
          hotelId
          details {
            detailsType
            displayName
            missingDates
          }
        }
      }
    }
  }
`;

const missingDatesQueries = {
  get: MISSING_DATA_GET_QUERY,
};

export { missingDatesQueries };
