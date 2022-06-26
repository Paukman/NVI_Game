import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';
import { buildErrors } from '../utils/apiHelpers';

export const KPI_LIST_QUERY = gql`
  query ($params: KpiFilter, $pagination: PaginationAndSortingInput) {
    kpiList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
        permissions
      }
    }
  }
`;

export const KPI_GET_QUERY = gql`
  query ($id: ID) {
    kpiGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
        permissions
      }
    }
  }
`;

export const KPI_SHARE_GET_QUERY = gql`
  query ($id: ID) {
    kpiShareGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          username
          displayName
        }
        organizations {
          id
          companyName
        }
        permissions
      }
    }
  }
`;

export const KPI_TEST_FORMULA_QUERY = gql`
  query ($params: KpiTestInput) {
    kpiTestFormula(params: $params) {
      code
      errors {
        name
        messages
      }
      data
    }
  }
`;

export const KPI_KPI_CALCULATE_QUERY = gql`
  query ($params: KpiCalculateInput) {
    kpiCalculate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        kpiId
        kpiName
        date
        period
        startDate
        endDate
        hotelId
        value {
          title
          date
          hotelId
          priority
          value
          valueTypeId
          values
          valueTypeIds
          hotel {
            hotelName
          }
          isTotal
          errorMsg
        }
      }
    }
  }
`;

export const KPI_CREATE_MUTATION = gql`
  mutation ($params: KpiInput) {
    kpiCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
      }
    }
  }
`;

export const KPI_UPDATE_MUTATION = gql`
  mutation ($id: ID, $params: KpiInput) {
    kpiUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
      }
    }
  }
`;

export const KPI_REMOVE_MUTATION = gql`
  mutation ($id: ID) {
    kpiRemove(id: $id) {
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

export const KPI_SHARE_SET_MUTATION = gql`
  mutation ($params: KpiShareInput) {
    kpiShareSet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
      }
    }
  }
`;

export const KPI_MAKE_PRIVATE_MUTATION = gql`
  mutation ($id: [ID]) {
    kpiMakePrivate(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
      }
    }
  }
`;

export const KPI_MAKE_GLOBAL_MUTATION = gql`
  mutation ($id: [ID]) {
    kpiMakeGlobal(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        organizations {
          id
          companyName
        }
      }
    }
  }
`;

export const KPI_DUPLICATE_MUTATION = gql`
  mutation ($params: KpiDuplicateInput) {
    kpiDuplicate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        kpiStatusId
        kpiCategoryId
        kpiDataTypeId
        kpiName
        kpiDescription
        kpiFormula
        valueTypeId
        aggregator
        createdBy
        createdAt
        updatedAt
        userCreated {
          username
          displayName
        }
      }
    }
  }
`;

export const useKpi = () => {
  const [kpis, setKpis] = useState({ data: [], ...buildErrors() });
  const [kpi, setKpi] = useState({ data: null, ...buildErrors() });
  const [kpiFormulaTest, setKpiFormulaTest] = useState({ data: null, ...buildErrors() });
  const [kpiCalculation, setKpiCalculation] = useState({ data: null, ...buildErrors() });

  const [queryKpiList, { loading: kpisLoading }] = useLazyQuery(KPI_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.kpiList || {};

      const data = Array.isArray(result.data) ? result.data : [];

      setKpis({
        data,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying KPIs list:', response);

      setKpis({
        data: [],
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying KPIs list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryKpiGet, { loading: kpiLoading }] = useLazyQuery(KPI_GET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.kpiGet || {};

      const data = Array.isArray(result.data) ? result.data : [];

      setKpi({
        data: data[0] || null,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying KPI:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying KPI. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryKpiShareGet, { loading: kpiShareGetting }] = useLazyQuery(KPI_SHARE_GET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.kpiShareGet || {};

      const data = Array.isArray(result.data) ? result.data : [];

      setKpi({
        data: data[0] || null,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying KPI share status:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying KPI share status. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryKpiTestFormula, { loading: kpiTestingFormula }] = useLazyQuery(KPI_TEST_FORMULA_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.kpiTestFormula || {};

      setKpi({
        data: result.data,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when testing KPI formula:', response);

      setKpi({
        data: [],
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when testing KPI formula. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryKpiCalculate, { loading: kpiCalculating }] = useLazyQuery(KPI_KPI_CALCULATE_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response?.kpiCalculate || {};

      setKpiCalculation({
        data: Array.isArray(result.data) ? result.data[0] : null,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when calculating KPI formula:', response);

      setKpiCalculation({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when calculating KPI formula. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiCreate, { loading: kpiCreating }] = useMutation(KPI_CREATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiCreate || {};
      const newItem = result.data?.[0] || null;

      if (result.code === 0) {
        setKpis({
          data: [newItem, ...kpis.data],
          ...buildErrors(),
        });
      }

      setKpi({
        data: newItem,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when creating KPI:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when creating KPI. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiUpdate, { loading: kpiUpdating }] = useMutation(KPI_UPDATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiUpdate || {};
      const updItem = result.data?.[0] || null;

      if (result.code === 0) {
        // Update KPI in existing list if any
        kpis.data.forEach((item, idx) => {
          if (item.id === updItem.id) {
            kpis.data[idx] = { ...updItem };
          }
        });

        setKpis({
          data: [...kpis.data],
          ...buildErrors(),
        });
      }

      setKpi({
        data: updItem,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when updating KPI:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when updating KPI. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiRemove, { loading: kpiRemoving }] = useMutation(KPI_REMOVE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiRemove || {};
      const updItem = result.data?.[0] || null;

      if (result.code === 0) {
        // Remove KPI from existing list if any
        const data = kpis.data.filter((item) => item.id !== updItem?.id);

        setKpis({
          data: [...data],
          ...buildErrors(),
        });
      }

      setKpi({
        data: updItem,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when removing a KPI:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when removing a KPI. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiMakePrivate, { loading: kpiMakingPrivate }] = useMutation(KPI_MAKE_PRIVATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiMakePrivate || {};
      const updItem = result.data?.[0] || null;

      if (result.code === 0) {
        // Update KPI in existing list if any
        kpis.data.forEach((item, idx) => {
          if (item.id === updItem.id) {
            kpis.data[idx] = { ...updItem };
          }
        });

        setKpis({
          data: [...kpis.data],
          ...buildErrors(),
        });
      }

      setKpi({
        data: updItem,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when making a KPI private:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when making a KPI private. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiMakeGlobal, { loading: kpiMakingGlobal }] = useMutation(KPI_MAKE_GLOBAL_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiMakeGlobal || {};
      const updItem = result.data?.[0] || null;

      if (result.code === 0) {
        // Update KPI in existing list if any
        kpis.data.forEach((item, idx) => {
          if (item.id === updItem.id) {
            kpis.data[idx] = { ...updItem };
          }
        });

        setKpis({
          data: [...kpis.data],
          ...buildErrors(),
        });
      }

      setKpi({
        data: updItem,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when making a KPI global:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when making a KPI global. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiShareSet, { loading: kpiShareSetting }] = useMutation(KPI_SHARE_SET_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiShareSet || {};
      const updItem = result.data?.[0] || null;

      if (result.code === 0) {
        // Update KPI in existing list if any
        kpis.data.forEach((item, idx) => {
          if (item.id === updItem.id) {
            kpis.data[idx] = { ...updItem };
          }
        });

        setKpis({
          data: [...kpis.data],
          ...buildErrors(),
        });
      }

      setKpi({
        data: updItem,
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when sharing a KPI:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when sharing a KPI. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [mutationKpiDuplicate, { loading: kpiDuplicating }] = useMutation(KPI_DUPLICATE_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.kpiDuplicate || {};
      const updItem = result.data?.[0] || null;

      if (result.code === 0) {
        if (updItem) {
          setKpis({
            data: [updItem, ...kpis.data],
            errors: [],
          });
        }
      }

      setKpi({
        data: updItem,
        errors: Array.isArray(result.errors) ? result.errors : [],
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when duplicating a KPI:', response);

      setKpi({
        data: null,
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when duplicating a KPI. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const kpiList = useCallback(
    (params) => {
      queryKpiList({ variables: params });
    },
    [queryKpiList],
  );

  const kpiGet = useCallback(
    (id) => {
      queryKpiGet({ variables: { id } });
    },
    [queryKpiGet],
  );

  const kpiShareGet = useCallback(
    (id) => {
      queryKpiShareGet({ variables: { id } });
    },
    [queryKpiShareGet],
  );

  const kpiTestFormula = useCallback(
    (params) => {
      queryKpiTestFormula({ variables: { params } });
    },
    [queryKpiTestFormula],
  );

  const kpiCalculate = useCallback(
    (params) => {
      queryKpiCalculate({ variables: { params } });
    },
    [queryKpiCalculate],
  );

  const kpiCreate = useCallback(
    (params) => {
      mutationKpiCreate({ variables: { params } });
    },
    [mutationKpiCreate],
  );

  const kpiUpdate = useCallback(
    (variables) => {
      mutationKpiUpdate({ variables });
    },
    [mutationKpiUpdate],
  );

  const kpiRemove = useCallback(
    (id) => {
      mutationKpiRemove({ variables: { id } });
    },
    [mutationKpiRemove],
  );

  const kpiMakePrivate = useCallback(
    (id) => {
      mutationKpiMakePrivate({ variables: { id } });
    },
    [mutationKpiMakePrivate],
  );

  const kpiMakeGlobal = useCallback(
    (id) => {
      mutationKpiMakeGlobal({ variables: { id } });
    },
    [mutationKpiMakeGlobal],
  );

  const kpiShareSet = useCallback(
    (params) => {
      mutationKpiShareSet({ variables: { params } });
    },
    [mutationKpiShareSet],
  );

  const kpiDuplicate = useCallback(
    (params) => {
      mutationKpiDuplicate({ variables: { params } });
    },
    [mutationKpiDuplicate],
  );

  return {
    kpiList,
    kpiGet,
    kpiShareGet,
    kpiTestFormula,
    kpiCalculate,
    kpiCreate,
    kpiUpdate,
    kpiRemove,
    kpiMakePrivate,
    kpiMakeGlobal,
    kpiShareSet,
    kpiDuplicate,
    kpis,
    kpisLoading,
    kpi,
    kpiLoading,
    kpiTestingFormula,
    kpiShareGetting,
    kpiCreating,
    kpiUpdating,
    kpiRemoving,
    kpiMakingPrivate,
    kpiMakingGlobal,
    kpiShareSetting,
    kpiDuplicating,
    kpiCalculation,
    kpiCalculating,
  };
};
