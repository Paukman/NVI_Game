import React from "react";
import PropTypes from "prop-types";

const NoProfile = props => {
  NoProfile.propTypes = {
    handleOnCreateProfile: PropTypes.func.isRequired,
    profileHeader: PropTypes.string.isRequired,
    profileTitle: PropTypes.shape({}).isRequired
  };

  const { handleOnCreateProfile, profileHeader, profileTitle } = props;

  const handleCreate = () => {
    handleOnCreateProfile("create");
  };

  return (
    <div className="mt-6 margin-interac-profile">
      <div className="ui grid">
        <div className="row">
          <div className="fifteen wide column">
            <div className="interac-profile-title">
              <h3
                className="interac-profile-header"
                data-testid="interac-profile-header"
              >
                {profileHeader}
              </h3>
              <div className="ui divider" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column nmt-3" data-testid="header-interac-profile">
            {profileTitle}
          </div>
        </div>
        <div className="row mt-3">
          <div className="fifteen wide column">
            <button
              type="button"
              className="ui button interac-btn float-right interac-centered-btn-create primary create mb-8"
              onClick={handleCreate}
              aria-label="Create interac profile"
            >
              Create profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoProfile;
