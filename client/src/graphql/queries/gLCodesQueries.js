import gql from 'graphql-tag';

const CODES_LIST_QUERY = gql`
  query ($params: HmgGlCodeFilter, $pagination: PaginationAndSortingInput) {
    hmgGlCodeList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_GET_QUERY = gql`
  query ($id: ID!) {
    hmgGlCodeGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_CREATE_MUTATION = gql`
  mutation ($params: HmgGlCodeInput!) {
    hmgGlCodeCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_UPDATE_MUTATION = gql`
  mutation ($id: ID!, $params: HmgGlCodeInput!) {
    hmgGlCodeUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_REMOVE_MUTATION = gql`
  mutation ($id: ID!) {
    hmgGlCodeRemove(id: $id) {
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

const CODES_MAPPING_MUTATION = gql`
  mutation ($params: HmgGlCodeMapInput!) {
    hmgGlCodeMap(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_SET_STATUS_MUTATION = gql`
  mutation ($params: HmgGlCodeSetStatusInput) {
    hmgGlCodeSetStatus(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        statusId
      }
    }
  }
`;

const CODES_SET_STATUS_ALL_MUTATION = gql`
  mutation ($params: HmgGlCodeSetStatusAllInput!) {
    hmgGlCodeSetStatusAll(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_LIST_MDO_QUERY = gql`
  query ($params: HmgGlCodeListMdoStatusInput) {
    hmgGlCodeListMdoStatus(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        mdoGlCode
        statusId
      }
    }
  }
`;

const CODES_COPY_MUTATION = gql`
  mutation ($params: HmgGlCodeCopyMappingInput!) {
    hmgGlCodeCopyMapping(params: $params) {
      code
      errors {
        name
        messages
      }
    }
  }
`;

export const HMG_GL_CODE_IMPORT_MUTATION = gql`
  mutation ($params: [HmgGlCodeInput!]) {
    hmgGlCodeCreateMany(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hmgGlCode
      }
    }
  }
`;

const gLCodesQueries = {
  list: CODES_LIST_QUERY,
  get: CODES_GET_QUERY,
  create: CODES_CREATE_MUTATION,
  update: CODES_UPDATE_MUTATION,
  remove: CODES_REMOVE_MUTATION,
  mapping: CODES_MAPPING_MUTATION,
  setStatus: CODES_SET_STATUS_MUTATION,
  setStatusAll: CODES_SET_STATUS_ALL_MUTATION,
  listMdo: CODES_LIST_MDO_QUERY,
  copy: CODES_COPY_MUTATION,
  importHmg: HMG_GL_CODE_IMPORT_MUTATION,
};

export { gLCodesQueries };
