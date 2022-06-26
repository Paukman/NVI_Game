import gql from 'graphql-tag';

const HOTEL_GROUP_LIST_QUERY = gql`
  query ($params: HotelGroupFilter, $pagination: PaginationAndSortingInput) {
    hotelGroupList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        groupName
      }
    }
  }
`;

const HOTEL_GROUP_GET_QUERY = gql`
  query ($id: ID!) {
    hotelGroupGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        groupName
      }
    }
  }
`;

// TODO:
const HOTEL_GROUP_CREATE_MUTATION = gql`
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

// TODO:
const HOTEL_GROUP_UPDATE_MUTATION = gql`
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

// TODO:
const HOTEL_GROUP_REMOVE_MUTATION = gql`
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

const hotelGroupQueries = {
  list: HOTEL_GROUP_LIST_QUERY,
  get: HOTEL_GROUP_GET_QUERY,
  create: HOTEL_GROUP_CREATE_MUTATION,
  udpate: HOTEL_GROUP_UPDATE_MUTATION,
  remove: HOTEL_GROUP_REMOVE_MUTATION,
};

export { hotelGroupQueries };
