import React from "react";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import { Button as StyledButton } from "StyleGuide/Components";
import "./styles.scss";

// TODO - functionality should be pushed up a layer
const Buttons = ({
  id,
  type,
  response,
  prevTab,
  editButton,
  handleSubmit,
  className,
  buttonNames
}) => {
  Buttons.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    response: PropTypes.shape({
      data: PropTypes.shape({}),
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.shape({})
    }).isRequired,
    prevTab: PropTypes.func,
    editButton: PropTypes.func,
    handleSubmit: PropTypes.func,
    className: PropTypes.string,
    buttonNames: PropTypes.shape({})
  };

  Buttons.defaultProps = {
    prevTab: () => {},
    editButton: () => {},
    handleSubmit: {},
    className: "",
    buttonNames: {}
  };

  const send = buttonNames && buttonNames.send ? buttonNames.send : "Send";
  const edit = buttonNames && buttonNames.edit ? buttonNames.edit : "Edit";
  const cancel =
    buttonNames && buttonNames.cancel ? buttonNames.cancel : "Cancel";
  const sendAnother =
    buttonNames && buttonNames.sendAnother
      ? buttonNames.sendAnother
      : "Send another transfer";

  const blueBorderButton = className
    ? `blue-border-button ${className}`
    : "blue-border-button";

  return (
    <div className="button-container" id={id}>
      {type === "review" && (
        <>
          <div className="primary-button">
            <StyledButton
              primary
              block
              onClick={handleSubmit}
              id={`${id}-send`}
              loading={response.isLoading}
            >
              {response.isLoading ? null : send}
            </StyledButton>
          </div>
          <div className="bordered-button">
            <StyledButton
              block
              onClick={editButton}
              unclickable={response.isLoading}
              secondary
            >
              {edit}
            </StyledButton>
          </div>
          <div className="text-button">
            <StyledButton
              block
              onClick={prevTab}
              unclickable={response.isLoading}
              text
            >
              {cancel}
            </StyledButton>
          </div>
        </>
      )}

      {type === "complete" && (
        <Button
          className={blueBorderButton}
          id={`${id}-send-another-transfer`}
          onClick={prevTab}
          aria-label="Send another transfer"
        >
          {sendAnother}
        </Button>
      )}
    </div>
  );
};

export default Buttons;
