import { useState, useMemo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { usePurchaseOrder } from '../../../graphql';
import { prepareViewData, formatQueryErrors } from '../utils';
import { strReplace } from '../../../utils/formatHelpers';
import useIsMounted from '../../../hooks/useIsMounted';
import { addEditMode } from '../constants';

export const usePurchaseOrderView = (purchaseOrderId) => {
  const history = useHistory();
  const isMounted = useIsMounted();
  const {
    purchaseOrderGetState,
    purchaseOrderGet,
    purchaseOrderReceived,
    purchaseOrderReceivedMarkSet,
    porchaseOrderReceivedMarkSetLoading,
  } = usePurchaseOrder();

  const [viewState, updateViewState] = useState({
    vendors: [],
    vendorsMapped: [],
    hotels: [],
    hotelId: '',
    vendorId: '',
    data: null,
    errors: [],
    listDataSorting: [],
    dictionaryItems: [],
    departments: [],
    hotelAddress: '',
    vendorAddress: '',
    appPages: [],
  });

  useEffect(() => {
    if (purchaseOrderId) {
      purchaseOrderGet(purchaseOrderId);
    }
  }, [purchaseOrderId, purchaseOrderGet]);

  useEffect(() => {
    if (purchaseOrderGetState?.data || purchaseOrderGetState?.errors?.length) {
      const modifiedViewData = prepareViewData(purchaseOrderGetState.data, viewState);
      updateViewState((state) => ({
        ...state,
        data: { ...purchaseOrderGetState?.data, ...modifiedViewData },
        errors: formatQueryErrors(purchaseOrderGetState?.errors),
      }));
    }
  }, [purchaseOrderGetState]);

  // for marking received/active
  useMemo(() => {
    if (purchaseOrderReceived?.data || purchaseOrderReceived?.errors) {
      updateViewState((state) => ({
        ...state,
        data: {
          ...state.data,
          poReceivedAt:
            purchaseOrderReceived?.errors?.length === 0
              ? purchaseOrderReceived?.data?.poReceivedAt
              : state?.data?.poReceivedAt,
        },
        errors: [...purchaseOrderReceived?.errors],
      }));
    }
  }, [purchaseOrderReceived]);

  const onChange = (name, value) => {
    updateViewState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const updateLoadedData = useCallback((name, value) => {
    onChange(name, value);
  }, []);

  const onEdit = () => {
    history.push({
      pathname: strReplace(`${viewState.appPages.keys['purchase-orders-edit'].url}`, { id: viewState.data.id }),
      state: {
        addEditMode: addEditMode.EDIT,
      },
    });
  };

  const onMarkReceived = () => {
    purchaseOrderReceivedMarkSet({
      id: viewState.data.id,
      poReceived: viewState.data.poReceivedAt ? false : true,
    });
  };

  const goBack = useCallback(() => {
    history.push(viewState.appPages.keys['purchase-orders'].url);
  }, [history, viewState.appPages]);

  const onCreateDuplicate = () => {
    history.push({
      pathname: strReplace(`${viewState.appPages.keys['purchase-orders-edit'].url}`, { id: viewState.data.id }),
      state: {
        addEditMode: addEditMode.DUPLICATE,
      },
    });
  };

  return { viewState, onChange, updateLoadedData, onEdit, onMarkReceived, goBack, onCreateDuplicate };
};
