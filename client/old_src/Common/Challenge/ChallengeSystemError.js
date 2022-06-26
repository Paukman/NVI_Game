import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DynamicButton } from "StyleGuide/Components";

const { Paragraph } = Typography;

const ChallengeSystemError = ({
  children,
  handleClick,
  loading = false,
  inApp = false
}) => {
  ChallengeSystemError.propTypes = {
    children: PropTypes.node,
    handleClick: PropTypes.func,
    loading: PropTypes.bool,
    inApp: PropTypes.bool
  };

  if (!children) {
    return null;
  }
  return (
    <>
      <div
        className="challenge-system-error"
        data-testid="challenge-system-error"
      >
        <ExclamationCircleOutlined className="challenge-system-error-icon" />
        <Paragraph className="text-align-left margin-bottom-0" strong>
          {children}
        </Paragraph>
      </div>
      {handleClick && (
        <DynamicButton
          secondary
          block={!inApp}
          blockBreakpoint="xs"
          onClick={handleClick}
          loading={loading}
          className="margin-top-14"
        >
          Try again
        </DynamicButton>
      )}
    </>
  );
};

export default ChallengeSystemError;
