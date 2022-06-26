/* eslint-disable jsx-a11y/label-has-associated-control */ // need to disable it globally
import React, { useContext } from "react";
import PropTypes from "prop-types";
import useForm from "react-hook-form";
import personIcon from "assets/icons/Person/person.svg";
import crossIcon from "assets/icons/Cross/cross.svg";
import emailIcon from "assets/icons/Email/email.svg";
import { Button } from "StyleGuide/Components";
import { emailSanitizerOnBlurAndKeyDown } from "utils";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import {
  validationRulesEmail,
  validationRulesName,
  errorMessages
} from "../utils";

const EditProfile = props => {
  EditProfile.propTypes = {
    handleCancel: PropTypes.func.isRequired,
    profileTitle: PropTypes.shape({}).isRequired,
    edit: PropTypes.bool
  };
  EditProfile.defaultProps = {
    edit: false
  };
  const { userProfile } = useContext(InteracPreferencesContext);
  const { onSubmitUpdate, onSubmitCreate, profileState } = userProfile;
  const { editProfile, saving } = profileState;

  const { register, handleSubmit, errors } = useForm({ mode: "onSubmit" }); // validates on change. no need to have onChange listener
  const { handleCancel, profileTitle, edit } = props;

  const handleOnSubmit = data => {
    // will not submit the form when there are errors
    if (edit) {
      onSubmitUpdate(data);
    } else {
      onSubmitCreate(data);
    }
  };
  const title = edit ? `Edit profile` : `Create profile`;

  return (
    <div className="mt-6 margin-interac-profile">
      <div className="ui grid">
        <div className="row">
          <div className="fifteen wide column">
            <h3
              className="interac-profile-header"
              data-testid="interac-profile-create-header"
            >
              {title}
            </h3>
            <button
              type="button"
              className="close-btn float-right no-outline close-btn-margin-interac-profile"
              onClick={() => {
                handleCancel(edit);
              }}
            >
              <img src={crossIcon} alt="edit-profile-cancel" />
            </button>
            <div className="ui divider" />
          </div>
        </div>
        <div className="row">
          <div className="column nmt-3">{profileTitle}</div>
        </div>
        <div className="row nmt-1">
          <div className="fifteen wide column">
            <form className="ui form inline-form">
              <div className="mb-4">
                <label htmlFor="edit-profile-name" className="pl-6">
                  Name
                </label>
                <div className="ui form inline-form-field">
                  <img alt="person-profile-edit" src={personIcon} />
                  <input
                    name="name"
                    ref={register({ validate: validationRulesName })}
                    defaultValue={editProfile.name}
                    id="edit-profile-name"
                    maxLength="80"
                    className={errors.name && "ui form inline-form input-error"}
                  />
                </div>
                <p className="ui form inline-form error-message">
                  {errors.name && errorMessages[errors.name.type]}
                </p>
              </div>
              <div>
                <label htmlFor="edit-profile-email" className="pl-6">
                  Email
                </label>
                <div className="ui form inline-form-field">
                  <img alt="email-profile-edit" src={emailIcon} />
                  <input
                    name="email"
                    ref={register({
                      validate: validationRulesEmail
                    })}
                    id="edit-profile-email"
                    {...emailSanitizerOnBlurAndKeyDown}
                    defaultValue={editProfile.email}
                    maxLength="60"
                    className={
                      errors.email && "ui form inline-form input-error"
                    }
                  />
                </div>
                <p className="ui form inline-form error-message">
                  {errors.email && errorMessages[errors.email.type]}
                </p>
              </div>
              <div className="button-container">
                <div className="primary-button">
                  <Button
                    primary
                    block
                    onClick={handleSubmit(handleOnSubmit)}
                    loading={saving}
                  >
                    {saving ? null : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="one wide column" />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
