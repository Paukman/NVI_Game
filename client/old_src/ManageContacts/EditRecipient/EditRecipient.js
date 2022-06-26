/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */ // need to disable it globally
import React, { useState, useContext } from "react";
import useForm from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Divider } from "semantic-ui-react";
import personIcon from "assets/icons/Person/person.svg";
import emailIcon from "assets/icons/Email/email.svg";
import cross from "assets/icons/Cross/cross.svg";
import AlertModal from "Common/AlertModal";
import { menageContacts, modeName } from "globalConstants";
import { Button } from "StyleGuide/Components";
import { emailSanitizerOnBlurAndKeyDown } from "utils";
import SecurityComponent from "./SecurityComponent";
import { ManageContactsContext } from "../ManageContactsProvider";
import {
  createValidateUniqueEmail,
  createValidateUniqueName,
  validationRulesEmail,
  validationRulesName,
  errorMessages
} from "../utils";

// TODO use global styles
import "Common/ReviewButtons/styles.scss";
import "./styles.scss";

const EditRecipient = () => {
  const { page, recipient, contactsInfo } = useContext(ManageContactsContext);
  const {
    setPageName,
    isAlertShowing,
    setIsAlertShowing,
    alertError,
    mode,
    updatePage
  } = page;
  const { contacts, contactsData } = contactsInfo;
  const {
    recipientToHandle,
    setRecipientToHandle,
    getTransferType,
    setShowAutodeposit,
    onSubmit,
    onAddSubmit,
    isPosting
  } = recipient;

  const { register, getValues, handleSubmit, errors } = useForm({
    mode: "onBlur"
  });

  const history = useHistory();

  const [isCreateFirstPage, setIsCreateFirstPage] = useState(true);

  const handleCrossClick = async () => {
    if (
      mode === modeName.CREATE_MODE ||
      contacts.pageToReturnTo === menageContacts.RECIPIENTS
    ) {
      updatePage(menageContacts.RECIPIENTS);
      await setPageName(menageContacts.RECIPIENTS);

      history.push("/more/manage-contacts/recipients");
    } else {
      await setPageName(menageContacts.RECIPIENT_DETAILS);
    }
  };
  // update recipient
  const handleOnSubmit = async data => {
    onSubmit(data); // will not submit the form when there are errors
  };

  const handleNextSubmit = async data => {
    await setRecipientToHandle({
      aliasName: data.name,
      notificationPreference: [
        {
          notificationHandle: data.email
        }
      ]
    });
    setIsCreateFirstPage(false);
  };

  // add recipient
  const handleOnAddSubmit = async data => {
    onAddSubmit(data); // will not submit the form when there are errors
  };

  const renderAlertModal = () => {
    return (
      <AlertModal
        key={alert.id}
        id="manage-contact"
        alertMessage={alertError}
        isShowing={isAlertShowing}
        setIsShowing={setIsAlertShowing}
      />
    );
  };

  const renderNameAndEmail = () => {
    return (
      <>
        <div className="edit-label">
          <div className="form-icon">
            <img src={personIcon} alt="Recipient name" />
          </div>
          <div className="form-inputs input-spacing">
            <label className="form-label" htmlFor="edit-recipient-name">
              Recipient name
            </label>
            <input
              className={`ui input full-width-input ${
                errors.name ? "has-errors" : ""
              }`}
              name="name"
              id="edit-recipient-name"
              data-testid="edit-recipient-name"
              ref={register({
                validate: {
                  ...validationRulesName,
                  isUniqueName: createValidateUniqueName(
                    contactsData?.recipients,
                    recipientToHandle
                  )
                }
              })}
              defaultValue={
                mode === modeName.CREATE_MODE ? "" : recipientToHandle.aliasName
              }
              maxLength="80"
            />
            <p className="error">
              {errors.name ? errorMessages[errors.name.type] : ""}
            </p>
          </div>
        </div>
        <div className="edit-label">
          <div className="form-icon">
            <img src={emailIcon} alt="Recipient email" />
          </div>
          <div className="form-inputs input-spacing">
            <label className="form-label" htmlFor="edit-recipient-email">
              Recipient email
            </label>
            <input
              className={`ui input full-width-input ${
                errors.email ? "has-errors" : ""
              }`}
              name="email"
              id="edit-recipient-email"
              data-testid="edit-recipient-email"
              ref={register({
                validate: {
                  isUniqueEmail: createValidateUniqueEmail(
                    contactsData?.recipients,
                    recipientToHandle
                  ),
                  isValidEmail: async value => {
                    const isValid = await validationRulesEmail(
                      value,
                      getTransferType,
                      setShowAutodeposit
                    );
                    return isValid;
                  }
                }
              })}
              {...emailSanitizerOnBlurAndKeyDown}
              defaultValue={
                mode === modeName.CREATE_MODE
                  ? ""
                  : recipientToHandle.notificationPreference[0]
                      .notificationHandle
              }
              maxLength="64"
            />
            <p className="error">
              {errors.email ? errorMessages[errors.email.type] : ""}
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderSecurityAndSave = () => {
    return (
      <>
        <SecurityComponent
          register={register}
          errors={errors}
          getValues={getValues}
        />
        <div className="button-container">
          <Button
            loading={isPosting || contacts.isCheckingForAutodeposit}
            block
            primary
            htmlType="submit"
            data-testid="button-add-recipient"
          >
            {isPosting
              ? null
              : mode === modeName.CREATE_MODE
              ? "Add recipient"
              : "Save"}
          </Button>
        </div>
      </>
    );
  };

  const renderEditModeComponents = () => {
    return (
      <form
        className="rebank-form edit-recipient-form"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        {renderNameAndEmail()}
        {renderSecurityAndSave()}
      </form>
    );
  };

  const renderCreateFirstPage = () => {
    return (
      <form
        className="rebank-form edit-recipient-form"
        onSubmit={handleSubmit(handleNextSubmit)}
      >
        {renderNameAndEmail()}
        <div className="button-container">
          <Button
            htmlType="submit"
            primary
            block
            data-testid="button-recipient-next"
          >
            Next
          </Button>
        </div>
      </form>
    );
  };

  const renderCreateLastPage = () => {
    return (
      <form
        className="rebank-form edit-recipient-form"
        onSubmit={handleSubmit(handleOnAddSubmit)}
      >
        {renderSecurityAndSave()}
      </form>
    );
  };

  const renderCreateModeComponents = () => {
    return (
      <>
        {isCreateFirstPage ? renderCreateFirstPage() : renderCreateLastPage()}
      </>
    );
  };

  return (
    <>
      <div className="manage-contacts-container">
        <div className="manage-contacts-header">
          <h3>
            {mode === modeName.CREATE_MODE ? "Add recipient" : "Edit recipient"}
          </h3>
          <input
            type="image"
            className="manage-contacts-cross"
            src={cross}
            alt="Close recipient edit"
            onClick={() => handleCrossClick()}
          />
        </div>
        <Divider className="manage-contacts-divider recipients-divider" />
        {alertError && renderAlertModal()}
        {mode === modeName.CREATE_MODE
          ? renderCreateModeComponents()
          : renderEditModeComponents()}
      </div>
    </>
  );
};

export default EditRecipient;
