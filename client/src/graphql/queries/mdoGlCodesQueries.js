import gql from 'graphql-tag';

const LIST_MDO_GL_CODES_QUERY = gql`
  query ($params: MdoGlCodeFilter, $pagination: PaginationAndSortingInput) {
    mdoGlCodeList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        parentId
        displayName
        path
        mdoGlCodeDepartmentId
      }
    }
  }
`;

const ADD_MDO_GL_CODE_MUTATION = gql`
  mutation ($params: MdoGlCodeInput) {
    mdoGlCodeCreate(params: $params) {
      code
      errors {
        messages
        name
      }
      data {
        id
        parentId
        displayName
        dataTypeId
        mdoGlCodeDepartmentId
      }
    }
  }
`;

const UPDATE_MDO_GL_CODE_MUTATION = gql`
  mutation mdoGlCodeUpdate($id: ID!, $params: MdoGlCodeInput) {
    mdoGlCodeUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        parentId
        dataTypeId
        mdoGlCodeDepartmentId
        displayName
        path
        accountType
        valueTypeId
        orderNo
      }
    }
  }
`;

const REMOVE_MDO_GL_CODE_MUTATION = gql`
  mutation mdoGlCodeRemove($id: ID!) {
    mdoGlCodeRemove(id: $id) {
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

const GET_MDO_GL_CODES_QUERY = gql`
  query mdoGlCodeGet($id: ID!) {
    mdoGlCodeGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        parentId
        displayName
        path
        dataTypeId
        valueTypeId
        accountType
        mdoGlCodeDepartmentId
      }
    }
  }
`;

const LIST_MDO_GL_CODE_DEPARTMENT_QUERY = gql`
  query mdoGlCodeDepartmentList($params: MdoGlCodeDepartmentFilter) {
    mdoGlCodeDepartmentList(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        aggregateCode
        departmentName
        orderNo
        departmentStatusId
      }
    }
  }
`;

const GET_MDO_GL_CODE_DEPARTMENT_QUERY = gql`
  query mdoGlCodeDepartmentGet($id: ID!) {
    mdoGlCodeDepartmentGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        aggregateCode
        departmentName
        orderNo
        departmentStatusId
      }
    }
  }
`;

const mdoGLCodesQueries = {
  list: LIST_MDO_GL_CODES_QUERY,
  get: GET_MDO_GL_CODES_QUERY,
  create: ADD_MDO_GL_CODE_MUTATION,
  update: UPDATE_MDO_GL_CODE_MUTATION,
  remove: REMOVE_MDO_GL_CODE_MUTATION,
  listDepartment: LIST_MDO_GL_CODE_DEPARTMENT_QUERY,
  getDepartment: GET_MDO_GL_CODE_DEPARTMENT_QUERY,
};

export { mdoGLCodesQueries };
