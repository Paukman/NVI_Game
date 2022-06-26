import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { MessageContext } from "StyleGuide/Components";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { ModalContext } from "Common/ModalProvider";

import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import { etransfersBaseUrl } from "api";
import { requestETransferErrors } from "utils/MessageCatalog";

import useErrorModal from "utils/hooks/useErrorModal";
import Details from "./Details";
import FulfillRequestForm from "./FulfillRequestForm";
import useFulfillRequestDetail from "./useFulfillRequest";
import LoadingProfile from "../../InteracUserProfile/LoadingProfile";

import { transformData } from "./transform";

const FulfillRequest = ({ id }) => {
  FulfillRequest.propTypes = {
    id: PropTypes.string.isRequired
  };

  const {
    fulfillRequest,
    alertError,
    formData,
    fulfilled,
    postData,
    showForm,
    setAlertError,
    setFulfilled,
    setPostData
  } = useFulfillRequestDetail(id);

  const { modalComponent } = useContext(ModalContext);
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { post } = useApiWithRSA();
  const [saving, setSaving] = useState(false);
  const { showErrorModal } = useErrorModal();

  const submitForm = async data => {
    setSaving(true);
    const fromAccount = formData.withdrawalAccounts.find(
      acct => acct.id === data.from
    );
    if (!fromAccount) {
      return;
    }
    try {
      await post(
        `${etransfersBaseUrl}/`,
        transformData(id, fulfillRequest.data.value, formData, data)
      );

      setPostData({
        message: data.message,
        from: fromAccount
      });
      setFulfilled(true);
      showMessage({
        type: "success",
        top: snackbarTop,
        content: requestETransferErrors.MSG_RBET_071()
      });
    } catch (err) {
      showErrorModal(
        requestETransferErrors.MSG_RBET_014_TITLE,
        requestETransferErrors.MSG_RBET_014
      );
    } finally {
      setSaving(false);
    }
  };

  if (alertError) {
    return (
      <>
        {modalComponent({
          show: true,
          content: alertError?.errorMessage,
          actions: (
            <button
              type="button"
              className="ui button basic"
              onClick={() => {
                setAlertError(null);
              }}
            >
              OK
            </button>
          )
        })}
      </>
    );
  }

  if (!showForm && !fulfilled) {
    return <LoadingProfile />;
  }

  return (
    <>
      {showForm && fulfillRequest.data && !fulfilled && (
        <FulfillRequestForm
          requestData={fulfillRequest.data.value}
          eTransferData={formData}
          submitForm={submitForm}
          setFulfilled={setFulfilled}
          saving={saving}
        />
      )}
      {fulfilled && (
        <Details requestData={fulfillRequest.data.value} postData={postData} />
      )}
    </>
  );
};

export default FulfillRequest;
