import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

import "./styles.scss";

/**
 * @deprecated Use antd modal instead
 */
const AlertModal = ({ id, alertMessage, isShowing }) => {
  AlertModal.propTypes = {
    id: PropTypes.string.isRequired,
    alertMessage: PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      // TODO: errorMessage as react element forces, then, all Message catalog strings to be wrapped!
      errorMessage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      id: PropTypes.string,
      buttons: PropTypes.arrayOf(
        PropTypes.shape({
          buttonName: PropTypes.string,
          url: PropTypes.string
        })
      ).isRequired
    }),
    isShowing: PropTypes.bool.isRequired
  };
  AlertModal.defaultProps = {
    alertMessage: {
      errorMessage: ""
    }
  };

  const idModal = `${id}-modal-${alertMessage.id}`;
  const getModalHeight = (title, message) => {
    if (!title || !message) {
      return "";
    }
    if (title.length > 30 && message.length > 30) {
      return "height-200";
    }
    if (title.length > 30 || message.length > 30) {
      return "height-180";
    }
    return "";
  };

  const renderButtons = buttonsList => {
    return buttonsList.map((item, index) => {
      const key = item.buttonName ? item.buttonName : index;
      return (
        <Button
          as={item.url ? Link : null}
          to={item.url}
          basic
          id={`${idModal}-button-${index}`}
          data-testid={`${idModal}-button-${index}`}
          key={key}
          onClick={item.onClick}
        >
          {item.buttonName}
        </Button>
      );
    });
  };

  return (
    <Modal
      id={idModal}
      className={getModalHeight(alertMessage.title, alertMessage.errorMessage)}
      size="mini"
      open={isShowing}
    >
      <Modal.Content id={`${idModal}-content`}>
        <h4 id={`${idModal}-title`}>{alertMessage.title}</h4>
        <div id={`${idModal}-error-message`}>{alertMessage.errorMessage}</div>
      </Modal.Content>
      <Modal.Actions id={`${idModal}-button-container`}>
        {renderButtons(alertMessage.buttons)}
      </Modal.Actions>
    </Modal>
  );
};

export default AlertModal;
