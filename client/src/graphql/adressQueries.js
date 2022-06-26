import qql from 'graphql-tag';

export const LIST_ADDRESSES_QUERY = qql`
  query ($params: AddressFilter, $pagination: PaginationAndSortingInput) {
    addressList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        addressTypeId
        hotelId
        referenceId
        countryId
        postalCode
        stateProvinceId
        cityId
        address1
        address2
        contactName
        notes
        country {
          countryName
        }
        stateProvince {
          stateProvinceName
        }
        city {
          cityName
        }
      }
    }
  }
`;

export const ADDRESS_UPDATE_QUERY = qql`
mutation($id: ID, $params: AddressInput) {
    addressUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        addressName
        addressTypeId
        hotelId
        referenceId
        countryId
        postalCode
        stateProvinceId
        cityId
        address1
        address2
        phoneNumber
        faxNumber
        email
        contactName
        notes
        country {
          countryName
        }
        stateProvince {
          stateProvinceName
        }
        city {
          cityName
        }
        createdBy
        updatedBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        userUpdated {
          displayName
        }
        organization {
          companyName
        }
        permissions
      }
    }
  }
  `;

export const ADDRESS_CREATE_MUTATION = qql`
  mutation($params: AddressInput) {
    addressCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        addressName
        addressTypeId
        hotelId
        referenceId
        countryId
        postalCode
        stateProvinceId
        cityId
        address1
        address2
        phoneNumber
        faxNumber
        email
        contactName
        notes
        country {
          countryName
        }
        stateProvince {
          stateProvinceName
        }
        city {
          cityName
        }
        createdBy
        updatedBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        userUpdated {
          displayName
        }
        organization {
          companyName
        }
        permissions
      }
    }
  }
  `;

export const ADDRESS_REMOVE_MUTATION = qql`
  mutation($id: ID) {
    addressRemove(id: $id) {
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
