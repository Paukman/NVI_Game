import gql from 'graphql-tag';

const USER_LIST_QUERY = gql`
  query ($params: UserFilter, $pagination: PaginationAndSortingInput) {
    userList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        roleId
        username
        avatarUrl
        firstName
        lastName
        gender
        email
        businessPhoneNumber
        homePhoneNumber
        cellPhoneNumber
        altPhoneNumber
        faxNumber
        country
        state
        city
        postalCode
        address1
        address2
        organization {
          companyName
        }
      }
    }
  }
`;

const USER_GET_QUERY = gql`
  query ($id: ID!) {
    userGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        roleId
        username
        avatarUrl
        firstName
        lastName
        gender
        email
        businessPhoneNumber
        homePhoneNumber
        cellPhoneNumber
        altPhoneNumber
        faxNumber
        country
        state
        city
        postalCode
        address1
        address2
        organization {
          companyName
        }
      }
    }
  }
`;

const USER_CREATE_MUTATION = gql`
  mutation ($params: UserInput) {
    userCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        roleId
        username
        avatarUrl
        firstName
        lastName
        gender
        email
        businessPhoneNumber
        homePhoneNumber
        cellPhoneNumber
        altPhoneNumber
        faxNumber
        country
        state
        city
        postalCode
        address1
        address2
      }
    }
  }
`;

const USER_UPDATE_MUTATION = gql`
  mutation ($id: ID!, $params: UserInput) {
    userUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        orgId
        roleId
        username
        avatarUrl
        firstName
        lastName
        gender
        email
        businessPhoneNumber
        homePhoneNumber
        cellPhoneNumber
        altPhoneNumber
        faxNumber
        country
        state
        city
        postalCode
        address1
        address2
      }
    }
  }
`;

const USER_REMOVE_MUTATION = gql`
  mutation ($id: ID!) {
    userRemove(id: $id) {
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

const userQueries = {
  list: USER_LIST_QUERY,
  get: USER_GET_QUERY,
  create: USER_CREATE_MUTATION,
  udpate: USER_UPDATE_MUTATION,
  remove: USER_REMOVE_MUTATION,
};

export { userQueries };
