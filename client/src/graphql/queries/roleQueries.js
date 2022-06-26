import gql from 'graphql-tag';

const ROLE_LIST_QUERY = gql`
  query($params: RoleFilter, $pagination: PaginationAndSortingInput) {
    roleList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        roleName
      }
    }
  }
`;

const ROLE_GET_QUERY = gql`
  query($id: ID!) {
    roleGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        roleName
      }
    }
  }
`;

const roleQueries = {
  list: ROLE_LIST_QUERY,
  get: ROLE_GET_QUERY,
};

export { roleQueries };
