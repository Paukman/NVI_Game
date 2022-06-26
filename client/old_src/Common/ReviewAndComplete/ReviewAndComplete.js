import React, { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { Form } from "semantic-ui-react";
// TODO - alerts should be moved to a global level, like our popups
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import Buttons from "Common/ReviewButtons";
import AlertModal from "Common/AlertModal";
import "Common/ReviewAndComplete/styles.scss";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import "./styles.scss";
import DataStore from "utils/store";
import { ACCOUNTS_OVERVIEW_ALL_ACCOUNTS } from "utils/store/storeSchema";
import { manualApiSend } from "api";
import { MessageContext } from "StyleGuide/Components";
import { PromptContext } from "Common/PromptProvider";

const ReviewAndComplete = ({
  id,
  type,
  prevTab,
  editButton,
  nextTab,
  labelData,
  dataToPost,
  toURL,
  config,
  className,
  buttonNames,
  failureAlert,
  failureOptions,
  errorCrossReference,
  onConfirmAnalytics,
  onSuccessAnalytics,
  onFailureAnalytics
}) => {
  ReviewAndComplete.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    prevTab: PropTypes.func,
    editButton: PropTypes.func,
    nextTab: PropTypes.func,
    labelData: PropTypes.shape({}).isRequired,
    dataToPost: PropTypes.shape({}),
    toURL: PropTypes.string,
    config: PropTypes.shape({}),
    className: PropTypes.string,
    buttonNames: PropTypes.shape({}),
    failureAlert: PropTypes.func,
    failureOptions: PropTypes.shape({}),
    errorCrossReference: PropTypes.func,
    onConfirmAnalytics: PropTypes.func,
    onSuccessAnalytics: PropTypes.func,
    onFailureAnalytics: PropTypes.func
  };

  ReviewAndComplete.defaultProps = {
    id: "",
    prevTab: () => {},
    editButton: () => {},
    nextTab: () => {},
    dataToPost: {},
    toURL: "/",
    config: {},
    className: "",
    buttonNames: {},
    failureAlert: () => {},
    failureOptions: {},
    errorCrossReference: () => {},
    onConfirmAnalytics: () => {},
    onSuccessAnalytics: () => {},
    onFailureAnalytics: () => {}
  };

  const [userResponse, setUserResponse] = useState({
    data: null,
    isLoading: false,
    error: null
  });
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const [isShowing, setIsShowing] = useState(false);
  const { onCommit } = useContext(PromptContext);
  const { post } = useApiWithRSA();

  const handleFormSubmit = useCallback(async () => {
    onConfirmAnalytics();
    setUserResponse({ data: null, isLoading: true, error: null });
    try {
      let result;
      if (config.isRSA) {
        result = await post(config.url, dataToPost);
        if (config.key) {
          config.key.forEach(k => {
            DataStore.del(k);
          });
        }
      } else {
        result = await manualApiSend({
          verb: "POST",
          url: config.url,
          data: dataToPost,
          config: config.data,
          keys: config.key
        });
      }
      // clear the cache for accounts overview
      DataStore.del(ACCOUNTS_OVERVIEW_ALL_ACCOUNTS);

      onSuccessAnalytics();
      setUserResponse({ data: result.data, isLoading: false, error: null });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: config.renderMessage
      });
      nextTab();
    } catch (error) {
      setUserResponse({ data: null, isLoading: false, error });
      if (error) {
        onFailureAnalytics();
        setIsShowing(true);
      }
    }
  }, [config, dataToPost]);

  const handleCancel = () => {
    onCommit();
    prevTab();
  };

  return (
    <>
      <Form className="review-form" id={`${id}-form`}>
        <LabelDetails id={`${id}-label-details`} labelData={labelData} />
        <Buttons
          id={`${id}-buttons`}
          type={type}
          response={userResponse}
          prevTab={handleCancel}
          editButton={editButton}
          nextTab={nextTab}
          handleSubmit={handleFormSubmit}
          toURL={toURL}
          className={className}
          buttonNames={buttonNames}
        />
      </Form>
      {isShowing && type === "review" && (
        <AlertModal
          id="a-transfer"
          alertMessage={{
            ...failureAlert({
              ...failureOptions,
              reason: errorCrossReference(userResponse.error)
            }),
            buttons: [{ buttonName: "OK", onClick: () => setIsShowing(false) }]
          }}
          isShowing={isShowing}
        />
      )}
    </>
  );
};

export default ReviewAndComplete;
