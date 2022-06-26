import { formatPrice, timestampToShortLocal, formatCurrency } from 'utils/formatHelpers';
import { stableSort, getComparator, direction } from 'utils/pageHelpers';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { zeroUUID, addEditMode } from './constants';
import { exportToXLSX } from 'utils/downloadHelpers';
import { getText } from 'utils/localesHelpers';
import { buildDownloadableFilename } from '../../utils/downloadHelpers';

dayjs.extend(localizedFormat);

export const getTotals = ({ purchaseOrderItems, taxPercentage, shippingAmount, taxAmount }) => {
  const subtotal = purchaseOrderItems.reduce((acc, currValue) => {
    return acc + (parseFloat(currValue?.total) || 0);
  }, 0);
  if (taxPercentage) {
    taxAmount = formatPrice(((subtotal + parseFloat(shippingAmount || 0)) * parseFloat(taxPercentage || 0)) / 100);
  } else {
    taxAmount = null;
  }
  const total = formatPrice(subtotal + parseFloat(taxAmount || 0) + parseFloat(shippingAmount || 0));
  return { subtotal: formatPrice(subtotal), taxAmount, total };
};

export const prepareParamsForPurchseOrderListQuery = (state) => {
  const vendorId = state?.vendorId === 'allVendors' || !state?.vendorId ? undefined : state?.vendorId;
  const hotelId = state?.hotelId === 'All' || !state?.hotelId ? undefined : state?.hotelId;
  const dateFrom = state?.fromDate ? dayjs(state.fromDate).format('YYYY-MM-DD') : undefined;
  const dateTo = state?.toDate ? dayjs(state.toDate).format('YYYY-MM-DD') : undefined;

  return {
    vendorId: vendorId,
    hotelId: hotelId,
    dateFrom: dateFrom,
    dateTo: dateTo,
  };
};

export const formatResultData = (purchaseOrders, state) => {
  const notSortedList = purchaseOrders.map((poItem) => {
    return {
      id: poItem?.id, // this is more for double checking...
      poId: poItem?.poNumber,
      propertyName: poItem?.hotel?.hotelName,
      poType:
        state?.dictionaryItems.find(
          (dictItem) =>
            dictItem.dictionaryType?.typeName === 'purchase-order-type' && dictItem?.value == poItem.poTypeId,
        )?.displayName || null,
      date: dayjs(Number(poItem?.date)).format('MM/DD/YYYY'),
      vendorId: state?.vendors.find((vendor) => vendor.id === poItem?.vendorId)?.companyName || null,
      total: formatCurrency(poItem?.total, 2),
      totalForSorting: poItem?.total,
      createdBy: poItem?.userCreated?.displayName,
      poReceivedAt: poItem?.poReceivedAt,
    };
  });

  const sortedList = stableSort(notSortedList, getComparator(direction.DESC, 'date'));
  return sortedList;
};

// use for hotels, vendors, department anything with id...
export const findObjectInArrayUsingId = (objects, id) => {
  if (!Array.isArray(objects) || !objects.length) {
    return null;
  }
  if (!id) {
    return null;
  }

  const object = objects.find((item) => {
    return item.id === id;
  });
  return object || null;
};

export const getPoTypeByName = (dictionaryItems, typeName) => {
  if (!Array.isArray(dictionaryItems) || !dictionaryItems.length) {
    return null;
  }
  if (!typeName && !id) {
    return null;
  }

  const poType = dictionaryItems.find((dictItem) => dictItem.dictionaryType?.typeName === typeName);
  return poType?.displayName || null;
};

export const buildPurchaseOrderAddress = (address) => {
  const formattedAddress =
    (address?.address1 ? `${address?.address1} ` : '') +
    (address?.address2 ? `${address?.address2} ` : '') +
    (address?.city?.cityName ? `${address?.city?.cityName} ` : '') +
    (address?.stateProvince?.stateProvinceName ? `${address?.stateProvince?.stateProvinceName} ` : '') +
    (address?.postalCode ? `${address?.postalCode} ` : '') +
    (address?.country?.countryName ? `${address?.country?.countryName} ` : '');

  return formattedAddress;
};

export const buildPurchaseOrderAddressFromHotel = (hotel) => {
  if (!hotel) {
    return '';
  }

  const formattedAddress =
    (hotel?.address1 ? `${hotel?.address1} ` : '') +
    //(hotel?.address2 ? `${hotel?.address2} ` : '') +
    (hotel?.city ? `${hotel?.city} ` : '') +
    (hotel?.state ? `${hotel?.state} ` : '') +
    (hotel?.postalCode ? `${hotel?.postalCode} ` : '') +
    (hotel?.country ? `${hotel?.country} ` : '');

  return formattedAddress;
};

export const createAddressObjectFromHotelAddress = (hotel) => {
  return {
    address1: hotel?.address1 || null,
    address2: hotel?.address2 || null,
    addressName: hotel?.hotelName,
    city: hotel?.city || null,
    contactName: null,
    country: null,
    countryId: hotel?.country || null,
    email: null,
    faxNumber: null,
    id: zeroUUID,
    notes: null,
    phoneNumber: null,
    postalCode: hotel?.postalCode || null,
    stateProvince: hotel?.state || null,
    formattedAddress: buildPurchaseOrderAddressFromHotel(hotel),
    notEditable: true,
  };
};

export const setPoReceived = (poReceivedAt) => {
  if (poReceivedAt) {
    return true;
  }
  return false;
};

export const prepareViewData = (data, state) => {
  if (!data) {
    return null;
  }
  if (data) {
    const modifiedViewData = {};
    // convert dates
    const date = timestampToShortLocal({ timestamp: data?.date });
    const requiredBy = timestampToShortLocal({ timestamp: data?.requiredBy });
    modifiedViewData['date'] = date;
    modifiedViewData['requiredBy'] = requiredBy;

    // new additions to the existing data. Use these is the page
    modifiedViewData['poType'] = getPoTypeByName(state?.dictionaryItems, 'purchase-order-type');
    modifiedViewData['vendorName'] = findObjectInArrayUsingId(state?.vendors, data?.vendorId)?.companyName;
    modifiedViewData['departmentName'] = findObjectInArrayUsingId(state?.departments, data?.departmentId);
    modifiedViewData['vendorAddressCalc'] = buildPurchaseOrderAddress(data?.vendorAddress);
    modifiedViewData['shipToAddressCalc'] =
      data?.shipToAddressId === zeroUUID
        ? buildPurchaseOrderAddressFromHotel(state.hotels?.find((obj) => obj.id === data.hotelId))
        : buildPurchaseOrderAddress(data?.shipToAddress);

    return modifiedViewData;
  }
};

export const checkProperties = (object) => {
  const { id, ...noIdObj } = object;
  const isEmpty = !Object.values(noIdObj).some((value) => {
    return value !== null && value !== '';
  });
  return isEmpty;
};

export const prepareParamsForPurchseOrderCreate = (data) => {
  // remove empty rows if any and then transform to numbers
  const purchaseOrderItems = data?.purchaseOrderItems
    ?.reduce((allItems, currItem) => {
      if (!checkProperties(currItem)) {
        allItems.push(currItem);
      }
      return allItems;
    }, [])
    .map((item) => {
      if (item?.unitPrice && item?.quantity) {
        return { ...item, unitPrice: Number(item.unitPrice), quantity: Number(item.quantity) };
      } else {
        return item;
      }
    })
    // scrap id even if we're updating, new one will assigned.
    // too complex to keep state for old and new Po items...
    .map(({ id, ...rest }) => rest);

  return {
    comment: data?.comment || '',
    date: data?.date ? dayjs(data?.date) : undefined,
    departmentId: data?.departmentId || undefined,
    fob: data?.fob || '',
    hotelId: data?.hotelId || undefined,
    poTypeId: Number(data?.poTypeId) || undefined,
    purchaseOrderItems: purchaseOrderItems,
    requiredBy: data?.requiredBy ? dayjs(data?.requiredBy) : undefined,
    shipToAddressId: data?.shipToAddressId || undefined,
    shipToAttention: data?.shipToAttention || undefined,
    shipVia: data?.shipVia || '',
    shippingAmount: Number(data?.shippingAmount) || 0,
    subtotal: Number(data?.subtotal?.toString().replace(/,/g, '')) || 0,
    taxAmount: Number(data?.taxAmount?.toString().replace(/,/g, '')) || 0,
    vendorId: data?.vendorId || undefined,
    vendorToAttention: data?.vendorToAttention || '',
    vendorAddressId: data?.vendorAddressId || undefined,
    taxPercentage: Number(data?.taxPercentage) || 0,
    terms: data?.terms || '',
  };
};

export const formatQueryErrors = (querryErrors) => {
  if (!querryErrors || (Array.isArray(querryErrors) && querryErrors.length === 0)) {
    return [];
  }

  let errors = {};
  (querryErrors || []).forEach((querryError) => {
    errors[querryError.name] = `${querryError.messages.join('. ')}`;
  });

  return errors;
};

export const getMappedDepartments = (departments) => {
  if (!departments || (Array.isArray(departments) && departments.length === 0)) {
    return null;
  }
  const departmentsMapped = departments.map((item) => {
    return {
      value: item?.id,
      label: item?.departmentName,
      name: item?.departmentName,
    };
  });
  return departmentsMapped;
};

export const getMappedVendors = (vendors) => {
  if (!vendors || (Array.isArray(vendors) && vendors.length === 0)) {
    return null;
  }
  const vendorsMapped = vendors.map((item) => {
    return {
      value: item?.id,
      label: item?.companyName,
      name: item?.companyName,
    };
  });
  return vendorsMapped;
};

// used both for hotels and vendors
export const getAttention = (locations, value) => {
  let attention = null;

  if (Array.isArray(locations) && locations.length > 0 && value) {
    const location = findObjectInArrayUsingId(locations, value);

    if (location) {
      attention = location?.contactName || location?.attention || null;
    }
  }

  return { attention };
};

export const updateDataForReceivedPO = (poReceivedData, state) => {
  let data = state.data;
  let listData = state.listData;

  // just modify your data, instead of fetching everything again
  // this is valid since it will return data for proper id and poItem.
  if (poReceivedData) {
    data = state.data.map((poItem) =>
      poItem?.poNumber == poReceivedData?.poNumber
        ? // have to put null, its valid return
          { ...poItem, poReceivedAt: poReceivedData?.poReceivedAt ? poReceivedData?.poReceivedAt : null }
        : poItem,
    );
    listData = state.listData.map((poItem) =>
      poItem?.poId == poReceivedData?.poNumber
        ? // have to put null, its valid return
          { ...poItem, poReceivedAt: poReceivedData?.poReceivedAt ? poReceivedData?.poReceivedAt : null }
        : poItem,
    );
  }

  return { data, listData };
};

export const downloadExcelFile = (value, appPages, hotelId, data, startDate, endDate) => {
  if (data?.length > 0) {
    const excelData = data.reduce((allPOs, currentPO) => {
      allPOs.push({
        [getText('po.id')]: `${currentPO?.poId}${currentPO?.poReceivedAt ? '    ✓' : ''}` || '',
        [getText('po.received')]: currentPO?.poReceivedAt ? dayjs.utc(currentPO.poReceivedAt).format('MM/DD/YYYY') : '',
        [getText('po.property')]: currentPO?.propertyName || '',
        [getText('po.type')]: currentPO?.poType || '',
        [getText('po.date')]: currentPO?.date || '',
        [getText('po.vendor')]: currentPO?.vendorId || '',
        [getText('po.total')]: currentPO?.total || '',
        [getText('po.createdBy')]: currentPO?.createdBy || '',
      });
      return allPOs;
    }, []);
    exportToXLSX(
      excelData,
      buildDownloadableFilename({
        hotelId,
        reportName: appPages.keys['purchase-orders']?.name,
        startDate,
        endDate,
      }),
      value == 'excel' ? 'xlsx' : value,
      '',
      { style: true, noTotalStyle: true },
    );
  }
  return null;
};

export const validateDates = ({ name, deliverBy, date, errors }) => {
  if (!name || !deliverBy || !date || !dayjs(deliverBy).isValid() || !dayjs(deliverBy).isValid()) {
    return { updatedErrors: errors };
  }
  const deliverByDate = dayjs(deliverBy).format('YYYY-MM-DD');
  const poDate = dayjs(date).format('YYYY-MM-DD');
  const updatedErrors = Object.assign(errors);

  if (dayjs(deliverByDate).isSame(poDate) || dayjs(poDate).isBefore(deliverByDate)) {
    delete updatedErrors.requiredBy;
    delete updatedErrors.date;
  }
  if (dayjs(deliverByDate).isBefore(poDate)) {
    updatedErrors[name] = 'Delivery date must be after PO date';
  }

  return { updatedErrors };
};

/**
 *
 * @param {this is hotel or vednor} deliveryLocations
 * @param {hotel or vendor id} locationId
 * @param {default addresses to be selected for each location} currentlyUsedAddresses
 * @returns currently selected address and other addresses for the alternate address drawer
 */
export const getCurrentAndOtherAddressesForDrawer = (deliveryLocations, locationId, currentlyUsedAddresses) => {
  let currentAddress = null;
  let otherAddresses = [];

  let allAddresses = [];

  // 1. get all addresses from hotel/vendor
  if (Array.isArray(deliveryLocations) && deliveryLocations.length > 0 && locationId) {
    const deliveryLocation = deliveryLocations.find((item) => item.id === locationId);

    if (deliveryLocation) {
      // if defaul addresshas id, use this one, if it doesn't use address from hotel,
      // its or or
      if (deliveryLocation?.defaultAddress?.id) {
        allAddresses.push({
          ...deliveryLocation.defaultAddress,
          formattedAddress: buildPurchaseOrderAddress(deliveryLocation.defaultAddress),
        });
      }
      //only for hotels, build address directly from hotel object, use uuid for id
      else if (deliveryLocation?.hotelName && !isNaN(deliveryLocation.id)) {
        allAddresses.push(createAddressObjectFromHotelAddress(deliveryLocation));
      }
      for (let i = 0; i < deliveryLocation?.addresses?.length; i++) {
        if (deliveryLocation.addresses[i]?.id !== deliveryLocation?.defaultAddress?.id) {
          allAddresses.push({
            ...deliveryLocation.addresses[i],
            formattedAddress: buildPurchaseOrderAddress(deliveryLocation.addresses[i]),
          });
        }
      }

      // 2. find selected address,
      const usedAddress = currentlyUsedAddresses?.find((obj) => obj.locationId === locationId);

      // 3. set current and other addresses for the drawer
      currentAddress = allAddresses.find((obj) => obj.id === usedAddress.addressId);
      otherAddresses = allAddresses.filter((obj) => obj.id !== usedAddress.addressId);
    }
  }
  return { currentAddress, otherAddresses };
};

export const addUpdateUsedAddress = (addressData, currentlyUsedAddresses) => {
  if (!addressData || !Array.isArray(currentlyUsedAddresses)) {
    return [];
  }
  let modifiedUsedAddresses = [];
  if (!currentlyUsedAddresses.length) {
    modifiedUsedAddresses.push(addressData);
  } else if (!currentlyUsedAddresses.find((obj) => obj.locationId === addressData?.locationId)) {
    modifiedUsedAddresses = cloneDeep(currentlyUsedAddresses);
    modifiedUsedAddresses.push(addressData);
  } else {
    modifiedUsedAddresses = currentlyUsedAddresses.map((obj) =>
      obj.locationId === addressData?.locationId ? addressData : obj,
    );
  }
  return modifiedUsedAddresses;
};

export const addUpdateUsedAddresses = (addressData, currentlyUsedAddresses) => {
  if (!addressData || !Array.isArray(addressData) || addressData?.length === 0) {
    return currentlyUsedAddresses;
  }
  if (!currentlyUsedAddresses || !Array.isArray(currentlyUsedAddresses)) {
    return [];
  }

  let modifiedUsedAddresses = cloneDeep(currentlyUsedAddresses);
  for (let i = 0; i < addressData.length; i++) {
    modifiedUsedAddresses = addUpdateUsedAddress(addressData[i], modifiedUsedAddresses);
  }

  return modifiedUsedAddresses;
};

export const prepareSelectedDefaultAddresses = (locations) => {
  const toBeSelectedAddresses = [];
  if (Array.isArray(locations) && locations.length > 0) {
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      let formattedAddress;
      let addressId;
      if (location?.defaultAddress?.id) {
        formattedAddress = buildPurchaseOrderAddress(location.defaultAddress);
        addressId = location?.defaultAddress.id;
      } else if (location?.hotelName && !isNaN(location.id)) {
        // only for hotel embbeded address, not for company
        formattedAddress = buildPurchaseOrderAddressFromHotel(location);
        addressId = zeroUUID;
      } else if (location?.addresses?.length > 0) {
        // use first address from a list of addresses
        formattedAddress = buildPurchaseOrderAddress(location.addresses[0]);
        addressId = location.addresses[0]?.id;
      }
      toBeSelectedAddresses.push({
        locationId: location.id,
        addressId: addressId,
        formattedAddress: formattedAddress,
      });
    }
  }
  return toBeSelectedAddresses;
};

// this will expand default and current addresses with formatted address,
export const prepareSingleAddressForDrawer = (address) => {
  const modifiedAddress = cloneDeep(address);
  modifiedAddress.formattedAddress = buildPurchaseOrderAddress(address);
  return modifiedAddress;
};

export const getDataFromCurrentlyUsedAddresses = ({ locationId, addressId, currentlyUsedAddresses }) => {
  if (!Array.isArray(currentlyUsedAddresses) || !currentlyUsedAddresses.length) {
    return null;
  }
  let usedAddress = null;
  if (locationId) {
    usedAddress = currentlyUsedAddresses?.find((obj) => obj.locationId === locationId);
  } else if (addressId) {
    usedAddress = currentlyUsedAddresses?.find((obj) => obj.addressId === addressId);
  }
  return {
    locationId: usedAddress?.locationId,
    addressId: usedAddress?.addressId,
    formattedAddress: usedAddress?.formattedAddress,
  };
};

export const findAddressInAlternateAddresses = (currentAddress, otherAddresses, id) => {
  let address = null;
  if (currentAddress.id === id) {
    address = currentAddress;
  } else {
    for (let i = 0; i < otherAddresses.length; i++) {
      if (otherAddresses[i].id === id) {
        address = otherAddresses[i];
      }
    }
  }
  return address;
};

export const modifyAddressForEditDrawer = (address) => {
  const modifiedAddress = cloneDeep(address);

  modifiedAddress.city = address.city?.cityName;
  modifiedAddress.cityId = address.city?.cityId;
  modifiedAddress.stateProvince = address?.stateProvince?.stateProvinceName;
  modifiedAddress.stateProvinceId = address?.stateProvince?.id;
  modifiedAddress.country = address?.country?.countryName;
  modifiedAddress.countryId = address?.country?.id;

  return modifiedAddress;
};

export const prepareDataForNewSelectedAddress = (id, state) => {
  let shipToAddressFormatted = state.data?.shipToAddressFormatted;
  let shipToAddressId = state.data?.shipToAddressId;
  let vendorAddressFormatted = state.data?.vendorAddressFormatted;
  let vendorAddressId = state.data?.vendorAddressId;

  const selectedAddress = state?.otherAddresses.find((obj) => obj.id === id);
  const isHotel = state.showHotelAddressDrawer && !state.showVendorAddressDrawer;
  let modifiedUsedAddresses = state.currentlyUsedAddresses;
  if (selectedAddress) {
    modifiedUsedAddresses = addUpdateUsedAddress(
      {
        formattedAddress: selectedAddress.formattedAddress,
        addressId: id,
        locationId: isHotel ? state.data?.hotelId : state.data?.vendorId,
      },
      state.currentlyUsedAddresses,
    );

    shipToAddressFormatted = isHotel ? selectedAddress.formattedAddress : state.data?.shipToAddressFormatted;
    shipToAddressId = isHotel ? id : state.data?.shipToAddressId;
    vendorAddressFormatted = !isHotel ? selectedAddress.formattedAddress : state.data?.vendorAddressFormatted;
    vendorAddressId = !isHotel ? id : state.data?.vendorAddressId;
  }

  return {
    modifiedUsedAddresses,
    shipToAddressFormatted,
    shipToAddressId,
    vendorAddressFormatted,
    vendorAddressId,
  };
};

export const prepareAddressDataForAddEdit = (state) => {
  const { addressData: address } = state;

  const hotelId = state.showHotelAddressDrawer ? state.data?.hotelId : null;
  const referenceId = state.showVendorAddressDrawer ? state.data?.vendorId : null;

  let countryId = null;
  if (address?.country?.toLowerCase() === 'ca' || address?.country?.toLowerCase() === 'canada') {
    countryId = 'CA';
  } else if (
    address?.country?.toLowerCase() === 'us' ||
    address?.country?.toLowerCase() === 'usa' ||
    address?.country?.toLowerCase() === 'united states'
  ) {
    countryId = 'US';
  }

  const graphQlAddress = {
    addressName: address?.addressName || null,
    addressTypeId: 2,
    hotelId: hotelId,
    referenceId: referenceId,
    countryId: countryId,
    postalCode: address?.postalCode,
    stateProvinceId: address?.stateProvinceId || null,
    stateProvince: address?.stateProvince || null,
    cityId: address?.cityId || null,
    city: address?.city || null,
    address1: address?.address1 || null,
    address2: address?.address2 || null,
    phoneNumber: address?.phoneNumber || null,
    faxNumber: address?.faxNumber || null,
    email: address?.email || null,
    contactName: address?.contactName || null,
    notes: address?.notes || null,
  };
  return graphQlAddress;
};

export const updateStateOnAddEditAddress = (addressData, state) => {
  let shipToAddressFormatted = state.data?.shipToAddressFormatted;
  let vendorAddressFormatted = state.data?.vendorAddressFormatted;
  let otherAddresses = cloneDeep(state.otherAddresses);
  let currentAddress = cloneDeep(state.currentAddress);
  let hotels = cloneDeep(state.hotels);
  let vendors = cloneDeep(state.vendors);
  let hotel = hotels?.find((item) => item.id === state.data?.hotelId);
  let vendor = vendors?.find((item) => item.id === state.data?.vendorId);
  let currentlyUsedAddresses = state.currentlyUsedAddresses;

  if (addressData) {
    const modifiedAddress = prepareSingleAddressForDrawer(addressData);

    if (state.addressEditMode === addEditMode.ADD) {
      // in ADD mode
      otherAddresses.push(modifiedAddress);
      if (modifiedAddress?.hotelId && !modifiedAddress?.referenceId) {
        hotel?.addresses.push(modifiedAddress);
      }
      if (!modifiedAddress?.hotelId && modifiedAddress?.referenceId) {
        // this is vendor
        vendor?.addresses.push(modifiedAddress);
      }
    } else {
      // in EDIT mode
      // 1. update otherAddresses or currentAddress used in drawer
      if (currentAddress.id === addressData?.id) {
        // updating current address
        currentAddress = modifiedAddress;
        // only if updating selected address, update used addresses as well.
        currentlyUsedAddresses = addUpdateUsedAddress(
          {
            formattedAddress: modifiedAddress.formattedAddress,
            addressId: modifiedAddress.id,
            locationId: modifiedAddress?.hotelId || modifiedAddress?.referenceId,
          },
          state.currentlyUsedAddresses,
        );
        //update shiping or vendor formatted address info for PO as well
        // addressId stays the same
        //update shiping info if needed
        shipToAddressFormatted = modifiedAddress?.hotelId ? modifiedAddress.formattedAddress : shipToAddressFormatted;
        vendorAddressFormatted = modifiedAddress?.referenceId
          ? modifiedAddress.formattedAddress
          : vendorAddressFormatted;
      } else {
        otherAddresses = otherAddresses.map((obj) => (obj.id === addressData?.id ? modifiedAddress : obj));
      }
      // 2. addresses in hotel/vendors
      if (modifiedAddress?.hotelId && !modifiedAddress?.referenceId) {
        // this is hotel, check default address first
        if (hotel?.defaultAddress?.id === addressData?.id) {
          hotel.defaultAddress = modifiedAddress;
        } else {
          // check if address is in other addresses
          hotel.addresses = hotel?.addresses?.map((obj) => (obj.id === addressData?.id ? modifiedAddress : obj));
        }
      }
      if (!modifiedAddress?.hotelId && modifiedAddress?.referenceId) {
        // this is vendor
        if (vendor?.defaultAddress?.id === addressData?.id) {
          vendor.defaultAddress = modifiedAddress;
        } else {
          vendor.addresses = vendor?.addresses?.map((obj) => (obj.id === addressData?.id ? modifiedAddress : obj));
        }
      }
    }
  }

  return {
    otherAddresses,
    currentAddress,
    hotels,
    vendors,
    currentlyUsedAddresses,
    shipToAddressFormatted,
    vendorAddressFormatted,
  };
};

export const foundAndRemoveAddressFromLocation = (id, state) => {
  let hotels = cloneDeep(state.hotels);
  let vendors = cloneDeep(state.vendors);
  let otherAddresses = cloneDeep(state.otherAddresses);

  for (let i = 0; i < state.hotels?.length; i++) {
    const hotelAddresses = hotels[i].addresses?.filter((obj) => obj.id !== id);
    hotels[i].addresses = [...hotelAddresses];
  }
  for (let i = 0; i < state.vendors?.length; i++) {
    const vendorAddresses = vendors[i].addresses?.filter((obj) => obj.id !== id);
    vendors[i].addresses = [...vendorAddresses];
  }

  otherAddresses = otherAddresses.filter((obj) => obj.id !== id);

  return { hotels, vendors, otherAddresses };
};
