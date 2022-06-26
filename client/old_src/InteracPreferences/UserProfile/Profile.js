import React, { useContext } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { Skeleton } from "antd";
import NoProfile from "./NoProfile";
import ViewProfile from "./ViewProfile";
import ProfileTitle from "./ProfileTitle";

import { InteracPreferencesContext } from "../InteracPrefProvider";

import "./styles.scss";
import EditProfile from "./EditProfile";
import { BASE_PATH_PROFILE } from "../constants";

export const ProfileSubView = ({ match }) => {
  const history = useHistory();

  const handleOnCancel = edit => {
    if (edit) {
      history.push(`${BASE_PATH_PROFILE}/view-profile`);
    } else {
      history.push(`${BASE_PATH_PROFILE}/no-profile`);
    }
  };

  const handleOnEditOrCreate = mode => {
    if (mode === "edit") {
      history.push(`${BASE_PATH_PROFILE}/edit-profile`);
    } else {
      history.push(`${BASE_PATH_PROFILE}/create-profile`);
    }
  };

  switch (match.params.sectionName) {
    case "edit-profile":
      return (
        <EditProfile
          handleCancel={handleOnCancel}
          profileTitle={<ProfileTitle />}
          edit
        />
      );
    case "create-profile":
      return (
        <EditProfile
          handleCancel={handleOnCancel}
          profileTitle={<ProfileTitle />}
        />
      );
    case "view-profile":
      return (
        <ViewProfile
          profileHeader="Profile"
          profileTitle={<ProfileTitle />}
          handleOnEditProfile={handleOnEditOrCreate}
        />
      );
    case "no-profile":
      return (
        <NoProfile
          handleOnCreateProfile={handleOnEditOrCreate}
          profileHeader="Profile"
          profileTitle={<ProfileTitle />}
        />
      );

    default: {
      return null;
    }
  }
};

export const ProfilePage = () => {
  const match = useRouteMatch(`${BASE_PATH_PROFILE}/:sectionName`);
  if (!match) return null;
  return <ProfileSubView match={match} />;
};

const Profile = () => {
  const { userProfile } = useContext(InteracPreferencesContext);
  const { profileState } = userProfile; // ATTODO clean hook and reducer
  const { loading } = profileState;

  if (loading) {
    return (
      <div className="margin-left-60 margin-top-30 padding-right-60">
        <Skeleton active round paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return <ProfilePage />;
};

export default Profile;
