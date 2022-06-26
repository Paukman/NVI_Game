import gql from 'graphql-tag';

const PERMISSIONS_LIST_QUERY = gql`
  query PermissionsList($params: PermissionsFilter) {
    permissionsList(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        permissionEntities {
          permissionEntityId
          references {
            referenceId
            permissionTypeIds
          }
        }
      }
    }
  }
`;

const permissionsQueries = {
  list: PERMISSIONS_LIST_QUERY,
};

export { permissionsQueries };
