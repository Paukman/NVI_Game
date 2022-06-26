import React, { useEffect, createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useCompanies, useDepartments } from '../graphql';
import { HotelContext, AppContext } from '../contexts';
import { usePurchaseOrderListing, usePurchaseOrderView, usePurchaseOrderAddEdit } from '../pages/PurchaseOrders/hooks';
import { useDictionary } from '../graphql/useDictionary';

export const PurchaseOrderContext = createContext();

const PurchaseOrderProvider = ({ children, purchaseOrderId = null, addEditMode }) => {
  PurchaseOrderProvider.propTypes = {
    children: PropTypes.node.isRequired,
    purchaseOrderId: PropTypes.string,
    addEditMode: PropTypes.string,
  };

  const { listCompanies, companies } = useCompanies();
  const { listDepartments, departments } = useDepartments();
  const { listDictionary, dictionaryItems } = useDictionary();
  const { hotels } = useContext(HotelContext);
  const { appPages } = useContext(AppContext);

  const purchaseOrderListing = usePurchaseOrderListing();
  const purchaseOrderView = usePurchaseOrderView(purchaseOrderId);
  const purchaseOrderAddEdit = usePurchaseOrderAddEdit(purchaseOrderId, addEditMode);

  useEffect(() => {
    // 2 is vendors
    listCompanies({
      params: {
        companyTypeId: 2,
        companyStatusId: 100,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
    // there is only one type
    listDepartments({ params: { departmentTypeId: 1 } });
    listDictionary({});

    purchaseOrderView.onChange('appPages', appPages);
    purchaseOrderListing.onChange('appPages', appPages);
    purchaseOrderAddEdit.updateLoadedData('appPages', appPages);
  }, []);

  // hotels are not immediattely available, have to do it this way...
  useMemo(() => {
    if (hotels?.length !== 0) {
      purchaseOrderView.onChange('hotels', hotels);
      purchaseOrderAddEdit.updateHotels(hotels);
    }
  }, [hotels]);

  useMemo(() => {
    if (companies?.length !== 0) {
      purchaseOrderListing.updateVendors(companies);
      purchaseOrderView.updateLoadedData('vendors', companies);
      purchaseOrderAddEdit.updateVendors(companies);
    }
  }, [companies]);

  useMemo(() => {
    if (dictionaryItems?.length !== 0) {
      purchaseOrderListing.updateLoadedData('dictionaryItems', dictionaryItems);
      purchaseOrderView.updateLoadedData('dictionaryItems', dictionaryItems);
      purchaseOrderAddEdit.updateLoadedData('dictionaryItems', dictionaryItems);
    }
  }, [dictionaryItems]);

  useMemo(() => {
    if (departments?.length !== 0) {
      purchaseOrderView.updateLoadedData('departments', departments);
      purchaseOrderAddEdit.updateDepartments(departments);
    }
  }, [departments]);

  return (
    <PurchaseOrderContext.Provider
      value={{
        listing: {
          state: purchaseOrderListing.listingState,
          onChange: purchaseOrderListing.onChange,
          listPurchaseOrders: purchaseOrderListing.listPurchaseOrders,
          reportRequested: purchaseOrderListing.reportRequested,
          onRequestSort: purchaseOrderListing.onRequestSort,
          filterOutResults: purchaseOrderListing.filterOutResults,
          onPurchaseOrderSelect: purchaseOrderListing.onPurchaseOrderSelect,
          onHandleDownload: purchaseOrderListing.onHandleDownload,
          onHandleMoreOptions: purchaseOrderListing.onHandleMoreOptions,
          allDataIsValid: purchaseOrderListing.allDataIsValid,
        },

        view: {
          viewState: purchaseOrderView.viewState,
          onMarkReceived: purchaseOrderView.onMarkReceived,
          onCreateDuplicate: purchaseOrderView.onCreateDuplicate,
          onPrint: purchaseOrderView.onPrint,
          onEdit: purchaseOrderView.onEdit,
          onClose: purchaseOrderView.onClose,
          goBack: purchaseOrderView.goBack,
        },

        addEdit: {
          addEditState: purchaseOrderAddEdit.addEditState,
          onSaveUpdatePurchaseOrder: purchaseOrderAddEdit.onSaveUpdatePurchaseOrder,
          onChangePOItem: purchaseOrderAddEdit.onChangePOItem,
          onChange: purchaseOrderAddEdit.onChange,
          addPoItem: purchaseOrderAddEdit.addPoItem,
          deletePOItem: purchaseOrderAddEdit.deletePOItem,
          updateTotals: purchaseOrderAddEdit.updateTotals,
          onShipToPropertyNameChange: purchaseOrderAddEdit.onShipToPropertyNameChange,
          onVendorChange: purchaseOrderAddEdit.onVendorChange,
          additonalLists: purchaseOrderAddEdit.additonalLists,
          onCancelPurchaseOrder: purchaseOrderAddEdit.onCancelPurchaseOrder,
          onSelectVendorAlternateAddress: purchaseOrderAddEdit.onSelectVendorAlternateAddress,
          onSelectHotelAlternateAddress: purchaseOrderAddEdit.onSelectHotelAlternateAddress,
          onCloseAlternateAddressDrawer: purchaseOrderAddEdit.onCloseAlternateAddressDrawer,
          onDateUpdate: purchaseOrderAddEdit.onDateUpdate,

          editAddress: purchaseOrderAddEdit.editAddress,
          deleteAddress: purchaseOrderAddEdit.deleteAddress,
          addNewAddress: purchaseOrderAddEdit.addNewAddress,
          closeDrawer: purchaseOrderAddEdit.closeDrawer,
          onSelectedAddress: purchaseOrderAddEdit.onSelectedAddress,
          onChangeAddressData: purchaseOrderAddEdit.onChangeAddressData,
          onCancelNewAddress: purchaseOrderAddEdit.onCancelNewAddress,
          onSaveNewAddress: purchaseOrderAddEdit.onSaveNewAddress,
          confirmDeleteAddress: purchaseOrderAddEdit.confirmDeleteAddress,
          cancelDeleteAddress: purchaseOrderAddEdit.cancelDeleteAddress,
          onCreateNewVendorAddress: purchaseOrderAddEdit.onCreateNewVendorAddress,
        },
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
};

export { PurchaseOrderProvider };
