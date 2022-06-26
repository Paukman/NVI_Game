import React from "react";
import { useRouteMatch } from "react-router-dom";
import ManageContacts from "ManageContacts/ManageContacts";
import ManageContactsProvider from "ManageContacts/ManageContactsProvider";
import InteracPreferences from "InteracPreferences";
import InteracPreferencesPage from "InteracPreferences/InteracPreferencesPage";
import ContactUs from "ContactUs";
import PrivacyAndSecurity from "PrivacyAndSecurity";

const BASE_PATH = "/more";

export const SubView = ({ match }) => {
  switch (match.params.sectionName) {
    case "manage-contacts":
      return (
        <ManageContactsProvider>
          <ManageContacts />
        </ManageContactsProvider>
      );
    case "interac-preferences":
      return (
        <InteracPreferences>
          <InteracPreferencesPage />
        </InteracPreferences>
      );
    case "contact-us":
      return <ContactUs />;
    case "privacy-and-security":
      return <PrivacyAndSecurity />;
    default: {
      return null;
    }
  }
};

const More = () => {
  const match = useRouteMatch(`${BASE_PATH}/:sectionName`);
  if (!match) return null;
  return <SubView match={match} />;
};

export default More;
