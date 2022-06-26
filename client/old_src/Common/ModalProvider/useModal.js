import { useState, useCallback } from "react";
import useIsMounted from "utils/hooks/useIsMounted";

const useModal = () => {
  const [modalState, setModalState] = useState({
    show: false,
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
  });
  const isMounted = useIsMounted();
  let onCloseHandler = null;

  const show = useCallback(
    ({
      size = "mini",
      closeOnDimmerClick = false,
      closeOnEscape = true,
      onClose = null,
      content = null,
      actions = null,
      modalClassName = "",
      contentClassName = "",
      actionsClassName = "",
      headerClassName = "",
      modalHeader = null
    }) => {
      if (!isMounted()) return;
      onCloseHandler = onClose;
      setModalState({
        show: true,
        closeOnDimmerClick,
        closeOnEscape,
        size,
        content,
        actions,
        modalClassName,
        contentClassName,
        actionsClassName,
        headerClassName,
        modalHeader
      });
    },
    [isMounted]
  );

  const hide = useCallback(() => {
    if (!isMounted()) return;
    setModalState(state => {
      return {
        ...state,
        show: false
      };
    });
    if (onCloseHandler) {
      onCloseHandler();
    }
  }, [isMounted]);

  return {
    show,
    hide,
    modalState,
    onCloseHandler
  };
};

export default useModal;
