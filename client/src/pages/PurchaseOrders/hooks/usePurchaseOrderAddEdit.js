import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';

import { numberFilter, strReplace, timestampToShortLocal } from '../../../utils/formatHelpers';

import {
  getTotals,
  prepareParamsForPurchseOrderCreate,
  formatQueryErrors,
  getAttention,
  validateDates,
  getCurrentAndOtherAddressesForDrawer,
  prepareSelectedDefaultAddresses,
  addUpdateUsedAddresses,
  getDataFromCurrentlyUsedAddresses,
  getMappedDepartments,
  getMappedVendors,
  findAddressInAlternateAddresses,
  modifyAddressForEditDrawer,
  prepareDataForNewSelectedAddress,
  prepareAddressDataForAddEdit,
  updateStateOnAddEditAddress,
  foundAndRemoveAddressFromLocation,
} from '../utils';
import { useAddress, usePurchaseOrder } from '../../../graphql';
import { addEditMode, addressEditMode } from '../constants';
import { ToastContext } from '../../../components/Toast';
import { getText } from '../../../utils/localesHelpers';

export const usePurchaseOrderAddEdit = (purchaseOrderId, mode, purchaseOrderAddresses) => {
  const { purchaseOrder, purchaseOrderCreate, purchaseOrderUpdate, purchaseOrderGetState, purchaseOrderGet } =
    usePurchaseOrder();
  const { addressCreate, addressUpdate, addressRemove, address, addressRemoved } = useAddress();
  const { showToast } = useContext(ToastContext);
  const history = useHistory();

  const defaultData = {
    requiredBy: new Date(),
    date: new Date(),
    // dummies just to show 3 empty po items
    purchaseOrderItems: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }],

    // these addresses are calculated from the objects
    shipToAddressFormatted: null,
    vendorAddressFormatted: null,
  };

  const [addEditState, updateAddEditState] = useState({
    vendors: [],
    vendorsMapped: [],
    hotels: [],
    data: defaultData,
    errors: {},
    dictionaryItems: [],
    departments: [],
    departmentsMapped: [],
    appPages: [],
    addEditMode: addEditMode.ADD,

    showHotelAddressDrawer: false,
    showVendorAddressDrawer: false,
    currentAddress: null,
    otherAddresses: [],
    showNewAddressForm: false,
    addressData: null, // used for new address
    addressEditMode: addressEditMode.ADD,
    showDeleteAddressModal: false,
    currentlyUsedAddresses: [],
    showDeleteAddressDialog: false,
    addressToDelete: null, // temp address id between delete confirm dialog
    newAddressErrors: {},
  });

  useEffect(() => {
    if (purchaseOrderId) {
      purchaseOrderGet(purchaseOrderId);
    }
  }, [purchaseOrderId, purchaseOrderGet]);

  // get po on create
  useMemo(() => {
    if (purchaseOrder?.data && !purchaseOrder?.errors.length) {
      let message = `${getText('po.successCreatePO')} ${purchaseOrder?.data?.poNumber}.`;
      if (addEditState.addEditMode === addEditMode.EDIT) {
        message = `${getText('po.successUpdatePO')} ${purchaseOrder?.data?.poNumber}.`;
      }
      showToast({ message: message });
      history.push(
        strReplace(`${addEditState.appPages.keys['purchase-orders-view'].url}`, { id: purchaseOrder.data.id }),
      );
    } else if (!purchaseOrder?.data && purchaseOrder?.errors.length)
      updateAddEditState((state) => ({
        ...state,
        errors: formatQueryErrors(purchaseOrder.errors),
      }));
  }, [purchaseOrder]);

  const onCancelPurchaseOrder = () => {
    history.goBack();
  };

  const updateTotals = (name, value) => {
    const filtered = numberFilter(value);
    const taxPercentage = name === 'taxPercentage' ? filtered : addEditState.data.taxPercentage;
    const shippingAmount = name === 'shippingAmount' ? filtered : addEditState.data.shippingAmount;

    const { subtotal, taxAmount, total } = getTotals({
      purchaseOrderItems: addEditState.data.purchaseOrderItems,
      taxPercentage,
      shippingAmount,
      taxAmount: name === 'taxAmount' ? filtered : addEditState.data.taxAmount,
    });
    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        subtotal: subtotal,
        taxAmount: taxAmount,
        total: total,
        taxPercentage: taxPercentage,
        shippingAmount: shippingAmount,
      },
    }));
  };

  const onChange = (name, value) => {
    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        [name]: value,
      },
    }));
  };

  const addPoItem = () => {
    const newPoItems = [...addEditState.data.purchaseOrderItems, { id: 'id' + Math.random().toString(16).slice(2) }];
    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        purchaseOrderItems: [...newPoItems],
      },
    }));
  };

  const deletePOItem = (id) => {
    let newPoItems;
    if (addEditState.data.purchaseOrderItems.length === 1) {
      // just clean all the fields
      newPoItems = [{ id: addEditState.data.purchaseOrderItems[0].id }];
    } else {
      newPoItems = addEditState.data.purchaseOrderItems.filter((item) => item.id !== id);
    }

    //have to update totals
    const { subtotal, taxAmount, total } = getTotals({
      purchaseOrderItems: newPoItems,
      taxPercentage: addEditState.data.taxPercentage,
      shippingAmount: addEditState.data.shippingAmount,
      taxAmount: addEditState.data.taxAmount,
    });

    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        purchaseOrderItems: newPoItems,
        subtotal: subtotal,
        taxAmount: taxAmount,
        total: total,
      },
    }));
  };

  const updatePOItem = (name, id, value) => {
    let newPoItems = [...addEditState.data.purchaseOrderItems];
    let poItemIndex = newPoItems.findIndex((item) => item.id === id);
    let { subtotal, taxAmount, total } = addEditState.data;
    if (poItemIndex >= 0) {
      if (name === 'unitPrice' || name === 'quantity') {
        const filtered = numberFilter(value);
        value = filtered;

        // we need this so update now
        newPoItems[poItemIndex][name] = value;

        const poItemTotal =
          parseFloat(newPoItems[poItemIndex].quantity) * parseFloat(newPoItems[poItemIndex].unitPrice);
        newPoItems[poItemIndex].total = poItemTotal ? parseFloat(poItemTotal.toFixed(2)) : null;

        ({ subtotal, taxAmount, total } = getTotals({
          purchaseOrderItems: newPoItems,
          taxPercentage: addEditState.data.taxPercentage,
          shippingAmount: addEditState.data.shippingAmount,
          taxAmount: addEditState.data.taxAmount,
        }));
      }

      newPoItems[poItemIndex][name] = value;
    }

    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        purchaseOrderItems: newPoItems,
        subtotal: subtotal,
        taxAmount: taxAmount,
        total: total,
      },
    }));
  };

  const onChangePOItem = (nameWithID, value) => {
    const id = nameWithID.slice(nameWithID.lastIndexOf('_') + 1);
    const name = nameWithID.substring(0, nameWithID.indexOf('_'));
    updatePOItem(name, id, value);
  };

  const updateHotelData = async (_, value, hotels) => {
    const { attention } = getAttention(hotels, value);
    const { addressId, formattedAddress } = getDataFromCurrentlyUsedAddresses({
      locationId: value,
      currentlyUsedAddresses: addEditState.currentlyUsedAddresses,
    });

    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        hotelId: value,
        shipToAddressFormatted: formattedAddress,
        shipToAttention: attention,
        shipToAddressId: addressId,
      },
    }));
  };

  const onShipToPropertyNameChange = (name, value) => {
    updateHotelData(name, value, addEditState.hotels);
  };

  const updateVendorData = (_, value, vendors) => {
    const { attention } = getAttention(vendors, value);
    const { addressId, formattedAddress } = getDataFromCurrentlyUsedAddresses({
      locationId: value,
      currentlyUsedAddresses: addEditState.currentlyUsedAddresses,
    });

    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        vendorId: value,
        vendorAddressFormatted: formattedAddress,
        vendorToAttention: attention,
        vendorAddressId: addressId,
      },
    }));
  };

  const onVendorChange = (name, value) => {
    updateVendorData(name, value, addEditState.vendors);
  };

  const onSaveUpdatePurchaseOrder = () => {
    const params = prepareParamsForPurchseOrderCreate(addEditState.data);
    if (addEditState.addEditMode === addEditMode.ADD || addEditState.addEditMode === addEditMode.DUPLICATE) {
      purchaseOrderCreate(params);
    } else if (addEditState.addEditMode === addEditMode.EDIT) {
      return purchaseOrderUpdate(addEditState.data?.id, params);
    }
  };

  const updateVendors = (vendors) => {
    const vendorsMapped = getMappedVendors(vendors);
    const selectedVendorAddresses = prepareSelectedDefaultAddresses(vendors);
    const currentlyUsedAddresses = addUpdateUsedAddresses(selectedVendorAddresses, addEditState.currentlyUsedAddresses);
    updateAddEditState((state) => ({
      ...state,
      vendors: [...vendors],
      vendorsMapped: vendorsMapped,
      currentlyUsedAddresses: currentlyUsedAddresses,
    }));
  };

  const updateHotels = (hotels) => {
    const selectedHotelAddresses = prepareSelectedDefaultAddresses(hotels);
    const currentlyUsedAddresses = addUpdateUsedAddresses(selectedHotelAddresses, addEditState.currentlyUsedAddresses);

    updateAddEditState((state) => ({
      ...state,
      hotels: [...hotels],
      currentlyUsedAddresses: currentlyUsedAddresses,
    }));
  };

  const updateDepartments = (departments) => {
    const departmentsMapped = getMappedDepartments(departments);
    updateAddEditState((state) => ({
      ...state,
      departments: [...departments],
      departmentsMapped: departmentsMapped,
    }));
  };

  const updateLoadedData = useCallback((name, value) => {
    updateAddEditState((state) => ({
      ...state,
      [name]: value,
    }));
  }, []);

  const hotelsAndVendorsAvailable = addEditState.vendors.length > 0 && addEditState.hotels.length > 0;

  useEffect(() => {
    if ((purchaseOrderGetState?.data || purchaseOrderGetState?.errors?.length) && hotelsAndVendorsAvailable) {
      const poEditData = cloneDeep(purchaseOrderGetState.data);
      // have to convert the dates
      poEditData['date'] = timestampToShortLocal({ timestamp: poEditData?.date });
      poEditData['requiredBy'] = timestampToShortLocal({ timestamp: poEditData?.requiredBy });
      updateAddEditState((state) => ({
        ...state,
        data: poEditData,
        errors: formatQueryErrors(purchaseOrderGetState?.errors),
        addEditMode: mode,
      }));
      if (purchaseOrderGetState?.data && hotelsAndVendorsAvailable) {
        onVendorChange('vendorId', purchaseOrderGetState.data?.vendorId);
        onShipToPropertyNameChange('hotelId', purchaseOrderGetState.data?.hotelId);
      }
    }
  }, [purchaseOrderGetState.data, purchaseOrderGetState.errors, hotelsAndVendorsAvailable]);

  const onDateUpdate = (name, value) => {
    const { updatedErrors } = validateDates({
      name: name,
      deliverBy: name === 'requiredBy' ? value : addEditState.data?.requiredBy,
      date: name === 'date' ? value : addEditState.data?.date,
      errors: addEditState.errors,
    });

    updateAddEditState((state) => ({
      ...state,
      data: {
        ...state.data,
        [name]: value,
      },
      errors: updatedErrors,
    }));
  };

  const onSelectHotelAlternateAddress = () => {
    const { currentAddress, otherAddresses } = getCurrentAndOtherAddressesForDrawer(
      addEditState.hotels,
      addEditState.data.hotelId,
      addEditState.currentlyUsedAddresses,
    );
    updateAddEditState((state) => ({
      ...state,
      showHotelAddressDrawer: true,
      currentAddress: currentAddress,
      otherAddresses: otherAddresses,
    }));
  };

  const onSelectVendorAlternateAddress = () => {
    const { currentAddress, otherAddresses } = getCurrentAndOtherAddressesForDrawer(
      addEditState.vendors,
      addEditState.data.vendorId,
      addEditState.currentlyUsedAddresses,
    );

    updateAddEditState((state) => ({
      ...state,
      showVendorAddressDrawer: true,
      currentAddress: currentAddress,
      otherAddresses: otherAddresses,
    }));
  };

  const onCreateNewVendorAddress = () => {
    const { currentAddress, otherAddresses } = getCurrentAndOtherAddressesForDrawer(
      addEditState.vendors,
      addEditState.data.vendorId,
      addEditState.currentlyUsedAddresses,
    );

    updateAddEditState((state) => ({
      ...state,
      showVendorAddressDrawer: true,
      showNewAddressForm: true,
      currentAddress: currentAddress,
      otherAddresses: otherAddresses,
    }));
  };

  const editAddress = ({ id }) => {
    const address = findAddressInAlternateAddresses(addEditState.currentAddress, addEditState.otherAddresses, id);
    let modifiedAddress = null;
    if (address) {
      modifiedAddress = modifyAddressForEditDrawer(address);
    }

    updateAddEditState((state) => ({
      ...state,
      showNewAddressForm: true,
      addressData: modifiedAddress,
      addressEditMode: addressEditMode.EDIT,
    }));
  };

  useEffect(() => {
    if (addressRemoved?.data || addressRemoved?.errors?.length) {
      if (addressRemoved?.data || !addressRemoved?.errors?.length) {
        const { hotels, vendors, otherAddresses } = foundAndRemoveAddressFromLocation(
          addressRemoved.data?.id,
          addEditState,
        );

        updateAddEditState((state) => ({
          ...state,
          hotels: hotels,
          vendors: vendors,
          otherAddresses: otherAddresses,
        }));
      }
      if (addressRemoved?.errors?.length) {
        //show error modal;
      }
    }
  }, [addressRemoved.data, addressRemoved.errors]);

  const addNewAddress = () => {
    updateAddEditState((state) => ({
      ...state,
      showNewAddressForm: true,
      addressEditMode: addressEditMode.ADD,
    }));
  };

  const closeDrawer = () => {
    updateAddEditState((state) => ({
      ...state,
      showHotelAddressDrawer: false,
      showVendorAddressDrawer: false,
      showNewAddressForm: false,
      currentAddress: null,
      otherAddresses: [],
      addressData: null,
    }));
  };

  const onSelectedAddress = ({ id }) => {
    const selectData = prepareDataForNewSelectedAddress(id, addEditState);

    // update state
    updateAddEditState((state) => ({
      ...state,
      showHotelAddressDrawer: false,
      showVendorAddressDrawer: false,
      showNewAddressForm: false,
      currentlyUsedAddresses: selectData.modifiedUsedAddresses,
      data: {
        ...state.data,
        shipToAddressFormatted: selectData.shipToAddressFormatted,
        shipToAddressId: selectData.shipToAddressId,
        vendorAddressFormatted: selectData.vendorAddressFormatted,
        vendorAddressId: selectData.vendorAddressId,
      },
    }));
  };

  const onChangeAddressData = (name, value) => {
    updateAddEditState((state) => ({
      ...state,
      addressData: {
        ...state.addressData,
        [name]: value,
      },
    }));
  };

  const onCancelNewAddress = () => {
    updateAddEditState((state) => ({
      ...state,
      showNewAddressForm: false,
      addressData: null,
      newAddressErrors: {},
    }));
  };

  useEffect(() => {
    if (address?.data || address?.errors?.length) {
      if (address?.data && !address?.errors?.length) {
        const updateData = updateStateOnAddEditAddress(address.data, addEditState);

        updateAddEditState((state) => ({
          ...state,
          errors: formatQueryErrors(address?.errors), // stay on form if errors, just display modal or inline errors
          showNewAddressForm: false,
          addressData: null,
          otherAddresses: updateData.otherAddresses,
          currentAddress: updateData.currentAddress,
          hotels: updateData.hotels,
          vendors: updateData.vendors,
          currentlyUsedAddresses: updateData.currentlyUsedAddresses,
          data: {
            ...state.data,
            shipToAddressFormatted: updateData.shipToAddressFormatted,
            vendorAddressFormatted: updateData.vendorAddressFormatted,
          },
        }));
      } else if (address?.errors?.length > 0) {
        //on errors
        updateAddEditState((state) => ({
          ...state,
          newAddressErrors: formatQueryErrors(address?.errors), // stay on form if errors, just display modal or inline errors
        }));
      }
    }
  }, [address.data, address.errors]);

  //const onSaveNewAddress = (values) => {
  //  console.log(values);
  //};

  const onSaveNewAddress = ({ id }) => {
    const params = prepareAddressDataForAddEdit(addEditState);
    if (addEditState.addressEditMode === addressEditMode.ADD) {
      addressCreate(params);
    } else if (addEditState.addressEditMode === addressEditMode.EDIT) {
      addressUpdate(addEditState.addressData?.id, params);
    }
  };

  const confirmDeleteAddress = () => {
    addressRemove(addEditState.addressToDelete);
    updateAddEditState((state) => ({
      ...state,
      showDeleteAddressDialog: false,
      addressToDelete: null,
    }));
  };
  const cancelDeleteAddress = () => {
    updateAddEditState((state) => ({
      ...state,
      showDeleteAddressDialog: false,
      addressToDelete: null,
    }));
  };

  const deleteAddress = ({ id }) => {
    updateAddEditState((state) => ({
      ...state,
      showDeleteAddressDialog: true,
      addressToDelete: id,
    }));
  };

  return {
    addEditState,
    onSaveUpdatePurchaseOrder,
    onChange,
    onChangePOItem,
    addPoItem,
    deletePOItem,
    updateTotals,
    onShipToPropertyNameChange,
    onVendorChange,
    onCancelPurchaseOrder,
    updateVendors,
    updateLoadedData,
    updateDepartments,
    updateHotels,
    onDateUpdate,
    onSelectVendorAlternateAddress,
    onSelectHotelAlternateAddress,

    editAddress,
    deleteAddress,
    addNewAddress,
    closeDrawer,
    onSelectedAddress,
    onChangeAddressData,
    onCancelNewAddress,
    onSaveNewAddress,
    confirmDeleteAddress,
    cancelDeleteAddress,
    onCreateNewVendorAddress,
  };
};
