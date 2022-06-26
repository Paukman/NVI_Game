import qql from 'graphql-tag';

export const GET_HEALTH_SCORECARD_MANUAL_ENTRY_LIST = qql`
query($params: HealthScoreCardManualEntryFilter, $pagination: PaginationAndSortingInput) {
    healthScoreCardManualEntryList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
      id
      year
      hotelId
      hotel{
        hotelName
      }
      reportSettingId
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec
      total
      permissions
      reportSetting{
        id
        reportName
        displayName
        }
      }
    }
  }
`;

export const GET_SVP_EVP_VALUES = qql`
query($params: HealthScoreCardSvpEvpFilter, $pagination: PaginationAndSortingInput) {
  healthScoreCardSvpEvpList(params: $params, pagination: $pagination) {
    code
    errors {
      name
      messages
    }
    data {
    id
    hotelId
    svpFullName
    evpFullName
    permissions
    }
  }
}
`;

export const SET_HEALTH_SCORECARD_MANUAL_ENTRY = qql`
mutation($params: HealthScoreCardManualEntrySetInput) {
  healthScoreCardManualEntrySet(params: $params) {
    code
    errors {
      name
      messages
    }
    data {
    id
    year
    hotelId
    hotel{
      hotelName
    }
    reportSettingId
    jan
    feb
    mar
    apr
    may
    jun
    jul
    aug
    sep
    oct
    nov
    dec
    total
    }
  }
}
`;

export const SET_SVP_EVP_HEALTH_SCORECARD_MANUAL_ENTRY = qql`
mutation($params: HealthScoreCardSvpEvpSetInput) {
  healthScoreCardSvpEvpSet(params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      id
      hotelId
      svpFullName
      evpFullName
    }
  }
}
`;
