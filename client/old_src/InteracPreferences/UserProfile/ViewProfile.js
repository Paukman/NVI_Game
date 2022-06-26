import React, { useContext } from "react";

import PropTypes from "prop-types";
import personIcon from "assets/icons/Person/person.svg";
import emailIcon from "assets/icons/Email/email.svg";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import "./styles.scss";

const ViewProfile = props => {
  ViewProfile.propTypes = {
    profileHeader: PropTypes.string.isRequired,
    profileTitle: PropTypes.shape({}).isRequired,
    handleOnEditProfile: PropTypes.func.isRequired
  };
  const { profileHeader, profileTitle, handleOnEditProfile } = props;

  const { userProfile } = useContext(InteracPreferencesContext);
  const { profileState } = userProfile;
  const { name, email } = profileState;

  const handleEdit = () => {
    handleOnEditProfile("edit");
  };

  return (
    <div className="mt-6 margin-interac-profile">
      <div className="ui grid">
        <div className="row">
          <div className="fifteen wide column">
            <div className="interac-profile-title">
              <div>
                <h3
                  className="interac-profile-header"
                  data-testid="header-interac-profile"
                >
                  {profileHeader}
                </h3>
              </div>
              <div className="ui divider" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column nmt-3">{profileTitle}</div>
        </div>
        <div className="row">
          <div className="fifteen wide column">
            <form className="ui form inline-form">
              <div className="mb-3">
                <div className="ui form inline-form label-div pl-6">Name</div>
                <div className="ui form inline-form-field">
                  <img
                    alt="person-profile-edit"
                    src={personIcon}
                    className="nmt-5"
                  />
                  <div className="ui form inline-form-field form-field">
                    {name}
                  </div>
                </div>
              </div>
              <div>
                <div className="ui form inline-form label-div pl-6">Email</div>
                <div className="ui form inline-form-field">
                  <img
                    alt="person-profile-edit"
                    src={emailIcon}
                    className="nmt-5"
                  />
                  <div className="ui form inline-form-field form-field">
                    {email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEdit}
                className="ui button interac-btn float-right interac-centered-btn secondary mt-5"
                aria-label="Edit interac profile"
              >
                Edit
              </button>
            </form>
          </div>
          <div className="one wide column" />
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
