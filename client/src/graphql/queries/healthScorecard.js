import gql from 'graphql-tag';

const HEALTH_SCOREBOARD_GET_QUERY = gql`
  query ($params: HealthScoreboardInput) {
    healthScoreboardGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
        period
        columnsCfg {
          title
        }
        items {
          hotelId
          hotel {
            hotelName
          }
          columnsData
        }
      }
    }
  }
`;

const HEALTH_SCORECARD_MANUAL_ENTRY_LIST_QUERY = gql`
  query ($params: HealthScoreCardManualEntryFilter, $pagination: PaginationAndSortingInput) {
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
        hotel {
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
        reportSettingDisplayName
      }
    }
  }
`;

const HEALTH_SCORECARD_MANUAL_ENTRY_GET_QUERY = gql`
  query ($id: ID) {
    healthScoreCardManualEntryGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        year
        hotelId
        hotel {
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

const HEALTH_SCORECARD_MANUAL_ENTRY_GET_MANY_QUERY = gql`
  query ($id: [ID]) {
    healthScoreCardManualEntryGetMany(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        year
        hotelId
        hotel {
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

const HEALTH_SCORECARD_MANUAL_ENTRY_SET_MUTATION = gql`
  mutation ($params: HealthScoreCardManualEntrySetInput) {
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
        hotel {
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

const HEALTH_SCORECARD_MANUAL_ENTRY_CREATE_MUTATION = gql`
  mutation ($params: HealthScoreCardManualEntrySingleInput) {
    healthScoreCardManualEntryCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        year
        hotel {
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

const HEALTH_SCORECARD_MANUAL_ENTRY_CREATE_MANY_MUTATION = gql`
  mutation ($params: [HealthScoreCardManualEntrySingleInput]) {
    healthScoreCardManualEntryCreateMany(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        year
        hotelId
        hotel {
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

const HEALTH_SCORECARD_MANUAL_ENTRY_UPDATE_MUTATION = gql`
  mutation ($id: ID, $params: HealthScoreCardManualEntrySingleInput) {
    healthScoreCardManualEntryUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        year
        hotelId
        hotel {
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

const HEALTH_SCORECARD_MANUAL_ENTRY_REMOVE_MUTATION = gql`
  mutation ($id: ID) {
    healthScoreCardManualEntryRemove(id: $id) {
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

const HEALTH_SCORECARD_SVP_EVP_LIST_QUERY = gql`
  query ($params: HealthScoreCardSvpEvpFilter, $pagination: PaginationAndSortingInput) {
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
const HEALTH_SCORECARD_SVP_EVP_GET_QUERY = gql`
  query ($id: ID) {
    healthScoreCardSvpEvpGet(id: $id) {
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

const HEALTH_SCORECARD_SVP_EVP_GET_MANY_QUERY = gql`
  query ($id: [ID]) {
    healthScoreCardSvpEvpGetMany(id: $id) {
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

const HEALTH_SCORECARD_SVP_EVP_SET_MUTATION = gql`
  mutation ($params: HealthScoreCardSvpEvpSetInput) {
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

const HEALTH_SCORECARD_SVP_EVP_CREATE_MUTATION = gql`
  mutation ($params: HealthScoreCardSvpEvpSetInput) {
    healthScoreCardSvpEvpCreate(params: $params) {
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

const HEALTH_SCORECARD_SVP_EVP_UPDATE_MUTATION = gql`
  mutation ($id: ID, $params: HealthScoreCardSvpEvpSetInput) {
    healthScoreCardSvpEvpUpdate(id: $id, params: $params) {
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

const HEALTH_SCORECARD_SVP_EVP_REMOVE_MUTATION = gql`
  mutation ($id: ID) {
    healthScoreCardSvpEvpRemove(id: $id) {
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

const healthScoreBoardQueries = {
  get: HEALTH_SCOREBOARD_GET_QUERY,
};
const healthScorecardQueries = {
  list: HEALTH_SCORECARD_MANUAL_ENTRY_LIST_QUERY,
  get: HEALTH_SCORECARD_MANUAL_ENTRY_GET_QUERY,
  getMany: HEALTH_SCORECARD_MANUAL_ENTRY_GET_MANY_QUERY,
  set: HEALTH_SCORECARD_MANUAL_ENTRY_SET_MUTATION,
  create: HEALTH_SCORECARD_MANUAL_ENTRY_CREATE_MUTATION,
  createMany: HEALTH_SCORECARD_MANUAL_ENTRY_CREATE_MANY_MUTATION,
  update: HEALTH_SCORECARD_MANUAL_ENTRY_UPDATE_MUTATION,
  remove: HEALTH_SCORECARD_MANUAL_ENTRY_REMOVE_MUTATION,
};

const healthScorecardSVPEVPQueries = {
  list: HEALTH_SCORECARD_SVP_EVP_LIST_QUERY,
  get: HEALTH_SCORECARD_SVP_EVP_GET_QUERY,
  getMany: HEALTH_SCORECARD_SVP_EVP_GET_MANY_QUERY,
  set: HEALTH_SCORECARD_SVP_EVP_SET_MUTATION,
  create: HEALTH_SCORECARD_SVP_EVP_CREATE_MUTATION,
  update: HEALTH_SCORECARD_SVP_EVP_UPDATE_MUTATION,
  remove: HEALTH_SCORECARD_SVP_EVP_REMOVE_MUTATION,
};

export { healthScoreBoardQueries, healthScorecardQueries, healthScorecardSVPEVPQueries };
