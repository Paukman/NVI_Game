import qql from 'graphql-tag';

export const GET_DEFAULT_STR_REPORT = qql`
  query($params: StrReportDefaultInput) {
    strReportDefaultGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
        columnsCfg {
          weekNo
          days
        }
        sections {
          name
          items {
            name
            columnsData
            valueTypeId
            ignoreFormatSign
          }
        }
      }
    }
  }
`;
