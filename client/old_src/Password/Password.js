import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouteMatch, useHistory } from "react-router-dom";
import PromptProvider from "Common/PromptProvider";
import ResetPassword from "./ResetPassword";
import SecurityChallangePage from "./SecurityChallange";

const BASE_PATH = "/password";

export const SubView = ({ sectionName }) => {
  switch (sectionName) {
    case "reset-password":
      return <ResetPassword />;
    case "security":
      return <SecurityChallangePage />;
    default: {
      return null;
    }
  }
};

// React.memo is used to prevent re-rendering. It will render the compnent only if the sectionName has changed.
// React.memo does shallow comparison and the props should be flat
const MemoView = React.memo(props => {
  MemoView.propTypes = {
    sectionName: PropTypes.string.isRequired
  };
  const { sectionName } = props;
  return (
    <PromptProvider>
      <SubView sectionName={sectionName} />
    </PromptProvider>
  );
});

const Password = ({ isTemp }) => {
  Password.propTypes = {
    isTemp: PropTypes.bool.isRequired
  };
  const history = useHistory();
  const match = useRouteMatch(`${BASE_PATH}/:sectionName`);

  useEffect(() => {
    if (!isTemp) {
      history.push("/overview");
    }
  }, [history, isTemp]);

  if (match) {
    return <MemoView sectionName={match.params.sectionName} />;
  }
  return null;
};

export default Password;
