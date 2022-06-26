import React, { useContext } from "react";
import PropTypes from "prop-types";
import InteracUserProfile from "../../InteracUserProfile";
import LoadingProfile from "../../InteracUserProfile/LoadingProfile";
import { FulfillERequestContext } from "./FulfillERequestProvider";
import FulfillRequest from "./FulfillRequest";

const FulfillERequest = ({ id }) => {
  FulfillERequest.propTypes = {
    id: PropTypes.string
  };
  const { userProfile } = useContext(FulfillERequestContext);

  const { profile, goNext } = userProfile;

  if (profile.loading) {
    return <LoadingProfile />;
  }
  if (profile.render) {
    return (
      <InteracUserProfile
        next={() => {
          goNext();
        }}
      />
    );
  }

  return <FulfillRequest id={id} />;
};

export default FulfillERequest;
