import qql from 'graphql-tag';

export const PO_CREATE_MUTATION = qql` 
  mutation($params: PurchaseOrderInput) {
    purchaseOrderCreate(params: $params) {
      code
      errors {
        name  
        messages
      }
      data {
        id
        orgId
        hotelId
        date
        poTypeId
        poReceivedAt
        poNumber
        departmentId
        vendorId
        vendorAddressId
        shipToAddressId
        shipToAttention
        fob
        shipVia
        requiredBy
        subtotal
        shippingAmount
        taxPercentage
        taxAmount
        total
        comment
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
        purchaseOrderItems {
          id
          itemNumber
          itemDescription
          hmgGlCode
          unitOfMeasure
          unitPrice
          quantity
          total

        }
      }
    }
  }
`;

export const PO_LIST_QUERY = qql` 
  query($params: PurchaseOrderFilter) {
    purchaseOrderList(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        date
        poTypeId
        poReceivedAt
        poNumber
        departmentId
        vendorId
        vendorAddressId
        shipToAddressId
        shipToAttention
        vendorToAttention
        fob
        shipVia
        terms
        requiredBy
        subtotal
        shippingAmount
        taxPercentage
        taxAmount
        total
        comment
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
        hotel {
          hotelName
        }
      }
    }
  }
`;
export const PO_QUERY_GET = qql` 
  query($id: ID) {
    purchaseOrderGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        date
        poTypeId
        poReceivedAt
        poNumber
        departmentId
        vendorId
        vendorAddressId
        shipToAddressId
        shipToAttention
        vendorToAttention
        fob
        shipVia
        terms
        requiredBy
        subtotal
        shippingAmount
        taxPercentage
        taxAmount
        total
        comment
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
        hotel {
          hotelName
          defaultAddress {
            address1
            address2
            postalCode
            country {
              id
              countryName
            }
            stateProvince {
              stateProvinceName
            }
            city {
              id
              cityName
            }
          }
        }
        vendor {
          id
          companyName
        }
        vendorAddress {
          address1
          address2
          postalCode
          country {
            id
            countryName
          }
          stateProvince {
            stateProvinceName
          }
          city {
            id
            cityName
          }
        }
        shipToAddress {
          address1
          address2
          postalCode
          country {
            id
            countryName
          }
          stateProvince {
            stateProvinceName
          }
          city {
            id
            cityName
          }
        }
        purchaseOrderItems {
          id
          itemNumber
          itemDescription
          hmgGlCode
          unitOfMeasure
          unitPrice
          quantity
          total
        }
      }
    }
  }
`;

export const PO_RECEIVED_MARK_SET_MUTATION = qql` 
  mutation($params: PurchaseOrderReceivedMarkInput) {
    purchaseOrderReceivedMarkSet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        poReceivedAt
        poNumber
      }
    }
  }
`;

export const PO_UPDATE_MUTATION = qql`
  mutation ($id: ID, $params: PurchaseOrderInput) {
    purchaseOrderUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        orgId
        hotelId
        date
        poTypeId
        poReceivedAt
        poNumber
        departmentId
        vendorId
        vendorAddressId
        shipToAddressId
        shipToAttention
        vendorToAttention
        fob
        shipVia
        terms
        requiredBy
        subtotal
        shippingAmount
        taxPercentage
        taxAmount
        total
        comment
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
        purchaseOrderItems {
          id
          itemNumber
          itemDescription
          hmgGlCode
          unitOfMeasure
          unitPrice
          quantity
          total

        }
      }
    }
  }
`;
