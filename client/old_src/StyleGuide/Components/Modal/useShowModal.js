import React, { useRef } from "react";
import PropTypes from "prop-types";
import { message, Modal } from "antd";

const Content = ({ children, className = "" }) => {
  Content.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  return (
    <div className={className} data-testid="ant-modal-content">
      <span>{children}</span>
    </div>
  );
};

const useShowModal = () => {
  const [modal, contextHolder] = Modal.useModal();
  const onCloseRef = useRef();
  const show = ({
    type = "info",
    content = null,
    title = "",
    keyboard = false,
    okButton = null,
    cancelButton = null
  }) => {
    const sharedModalProps = {
      content: <Content type={type}>{content}</Content>,
      title,
      keyboard, // required to disable esc for confirm & info
      autoFocusButton: null,
      centered: true,
      icon: null,
      okText: okButton?.text || "OK",
      okButtonProps: {
        className: "ant-btn-link md-link",
        "data-testid": okButton?.dataTestid || "ant-modal-ok-button"
      },
      okType: "link",
      onOk: okButton?.onClick
    };

    if (cancelButton) {
      modal.confirm({
        ...sharedModalProps,
        cancelText: cancelButton.text || "Cancel",
        cancelButtonProps: {
          className: "ant-btn-link md-link",
          "data-testid": cancelButton.dataTestid || "ant-modal-cancel-button"
        },
        onCancel: cancelButton.onClick
      });
    } else {
      modal.info(sharedModalProps);
    }

    return {
      type,
      content
    };
  };

  const close = () => {
    if (!onCloseRef.current) return;
    message.destroy();
    onCloseRef.current();
  };

  return { show, close, modal, contextHolder };
};

export default useShowModal;
