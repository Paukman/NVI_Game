import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

import { mapArrayBy } from 'mdo-react-components';

export const LIST_DEPARTMENTS_QUERY = gql`
  query($params: DepartmentFilter) {
    departmentList(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        departmentTypeId
        departmentCode
        departmentName
        createdBy
        updatedBy
        createdAt
        userCreated {
          displayName
        }
        userUpdated {
          displayName
        }
        updatedAt
        permissions
        organization {
          companyName
        }
      }
    }
  }
`;

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState(null);
  const [departmentsMap, setDepartmentsMap] = useState(null);

  const [queryListDepartments, { loading: loadingList }] = useLazyQuery(LIST_DEPARTMENTS_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      try {
        const data = newData.departmentList.data || [];

        const departmentsMap = mapArrayBy(data, 'id');
        setDepartments(data);
        setDepartmentsMap(departmentsMap);
      } catch (ex) {
        console.log(ex);
      }
    },
  });

  const [queryGetDepartment, { loading: loadingItem }] = useLazyQuery(LIST_DEPARTMENTS_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      setDepartment(newCodes);
    },
  });

  const listDepartments = useCallback(
    (params) => {
      queryListDepartments({ variables: params });
    },
    [queryListDepartments],
  );

  const getDepartment = useCallback(
    (id) => {
      queryGetDepartment(id);
    },
    [queryGetDepartment],
  );

  return {
    listDepartments,
    getDepartment,
    loadingList,
    loadingItem,
    departments,
    departmentsMap,
    department,
  };
};
