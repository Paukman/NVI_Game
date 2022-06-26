import gql from 'graphql-tag';

const PNL_COMMISIONS_LIST_QUERY = gql`
  query ($params: PnlCommissionFilter, $pagination: PaginationAndSortingInput) {
    pnlCommissionList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        description
        formula
        commissionPercentage
      }
    }
  }
`;

const PNL_COMMISIONS_GET_QUERY = gql`
  query ($id: ID) {
    pnlCommissionGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        description
        formula
        commissionPercentage
      }
    }
  }
`;

const PNL_COMMISIONS_GET_MANY_QUERY = gql`
  query ($id: [ID]) {
    pnlCommissionGetMany(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        description
        formula
        commissionPercentage
      }
    }
  }
`;

const PNL_COMMISIONS_CREATE_MUTATION = gql`
  mutation ($params: HotelClientAccountInput) {
    pnlCommissionCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        description
        formula
        commissionPercentage
      }
    }
  }
`;

const PNL_COMMISIONS_UPDATE_MUTATION = gql`
  mutation ($id: ID, $params: HotelClientAccountInput) {
    pnlCommissionUpdate(id: $id, params: $params) {
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

const PNL_COMMISIONS_REMOVE_MUTATION = gql`
  mutation ($id: ID) {
    pnlCommissionRemove(id: $id) {
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

const PNL_COMMISIONS_REMOVE_MANY_MUTATION = gql`
  mutation ($id: [ID]) {
    pnlCommissionRemoveMany(id: $id) {
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

const PNL_COMMISIONS_CALCULATE = gql`
  query ($params: PnlCommissionCalculateInput) {
    pnlCommissionCalculate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        date
        startDate
        endDate
        period
        items {
          id
          amount
          commissionAmount
          valueTypeId
        }
      }
    }
  }
`;

const pnlComissionCalculatorQueries = {
  list: PNL_COMMISIONS_LIST_QUERY,
  get: PNL_COMMISIONS_GET_QUERY,
  getMany: PNL_COMMISIONS_GET_MANY_QUERY,
  create: PNL_COMMISIONS_CREATE_MUTATION,
  update: PNL_COMMISIONS_UPDATE_MUTATION,
  remove: PNL_COMMISIONS_REMOVE_MUTATION,
  removeMany: PNL_COMMISIONS_REMOVE_MANY_MUTATION,
  calcCommissions: PNL_COMMISIONS_CALCULATE,
};

export { pnlComissionCalculatorQueries };
