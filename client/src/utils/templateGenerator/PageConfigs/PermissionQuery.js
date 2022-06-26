const config = {
  name: 'Permissions',
  queries: [
    {
      name: `permissionsList`,
      method: 'list',
      query: `query PermissionsList ($params: PermissionItemFilter, $pagination: PaginationAndSortingInput) {
            permissionsList(params: $params, pagination: $pagination)  {
              code
              errors {
                name
                messages
              }
              data {
                id
                appId
                orgId
                roleId
                permissionEntityId
                referenceId
                statusId
              }
            }
          }`,
      message: 'fetching Permission List',
    },
  ],
};

module.exports = {
  config,
};
