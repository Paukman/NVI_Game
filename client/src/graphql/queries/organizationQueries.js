import gql from 'graphql-tag';

const ORGANIZATION_LIST_QUERY = gql`
  query ($params: OrganizationFilter, $pagination: PaginationAndSortingInput) {
    organizationList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        companyName
        email
        phoneNumber
        country
        state
        city
        address_1
        address_2
      }
    }
  }
`;

const ORGANIZATION_GET_QUERY = gql`
  query ($id: ID!) {
    organizationGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        companyName
        email
        phoneNumber
        country
        state
        city
        address_1
        address_2
      }
    }
  }
`;

const ORGANIZATION_CREATE_MUTATION = gql`
  mutation ($params: OrganizationInput) {
    organizationCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        orgId
        companyName
        email
        phoneNumber
        country
        state
        city
        address_1
        address_2
      }
    }
  }
`;

const ORGANIZATION_UPDATE_MUTATION = gql`
  mutation ($id: ID!, $params: OrganizationInput) {
    organizationUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        companyName
        email
        phoneNumber
        country
        state
        city
        address_1
        address_2
      }
    }
  }
`;

const ORGANIZATION_REMOVE_MUTATION = gql`
  mutation ($id: ID!) {
    organizationRemove(id: $id) {
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

const organizationQueries = {
  list: ORGANIZATION_LIST_QUERY,
  get: ORGANIZATION_GET_QUERY,
  create: ORGANIZATION_CREATE_MUTATION,
  udpate: ORGANIZATION_UPDATE_MUTATION,
  remove: ORGANIZATION_REMOVE_MUTATION,
};

export { organizationQueries };
