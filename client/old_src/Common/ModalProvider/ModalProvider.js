import React, { createContext } from "react";
import { Modal } from "semantic-ui-react";
import PropTypes from "prop-types";
import useModal from "./useModal";

/**
 * @deprecated use antd modal instead
 */
export const ModalContext = createContext();

const renderModalHeader = modalState => {
  return (
    <Modal.Header className={modalState.headerClassName}>
      {modalState.modalHeader}
    </Modal.Header>
  );
};

const ModalComponent = props => {
  const {
    show,
    hide,
    closeOnDimmerClick,
    closeOnEscape,
    modalClassName,
    contentClassName,
    actionsClassName,
    headerClassName,
    size,
    content,
    modalHeader,
    actions
  } = props;
  ModalComponent.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func,
    closeOnDimmerClick: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    modalClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    actionsClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    size: PropTypes.string,
    content: PropTypes.element,
    modalHeader: PropTypes.element,
    actions: PropTypes.element
  };
  ModalComponent.defaultProps = {
    show: false,
    hide: () => null,
    closeOnDimmerClick: false,
    closeOnEscape: true,
    modalClassName: "",
    contentClassName: "",
    actionsClassName: "",
    headerClassName: "",
    size: "mini",
    content: null,
    modalHeader: null,
    actions: null
  };
  return (
    <Modal
      closeOnDimmerClick={closeOnDimmerClick}
      closeOnEscape={closeOnEscape}
      className={modalClassName}
      size={size || "mini"}
      open={show}
      onClose={hide}
    >
      {modalHeader &&
        renderModalHeader({
          headerClassName,
          modalHeader
        })}
      <Modal.Content className={contentClassName}>{content}</Modal.Content>
      {actions && (
        <Modal.Actions className={actionsClassName}>{actions}</Modal.Actions>
      )}
    </Modal>
  );
};

const ModalProvider = props => {
  const { show, hide, modalState } = useModal();
  ModalProvider.propTypes = {
    children: PropTypes.element.isRequired
  };
  const { children } = props;
  return (
    <ModalContext.Provider
      value={{ show, hide, modalComponent: ModalComponent }}
    >
      {children}
      <ModalComponent
        show={modalState.show}
        hide={hide}
        size={modalState.size}
        modalHeader={modalState.modalHeader}
        closeOnDimmerClick={modalState.closeOnDimmerClick}
        closeOnEscape={modalState.closeOnEscape}
        content={modalState.content}
        modalClassName={modalState.modalClassName}
        actionsClassName={modalState.actionsClassName}
        actions={modalState.actions}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
