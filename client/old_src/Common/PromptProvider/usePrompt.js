import { useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import usePromptReducer, {
  BLOCK_LOCATION,
  BLOCK_CLOSING_BROWSER,
  SHOW_MODAL,
  COMMIT,
  CANCEL
} from "./usePromptReducer";

const usePrompt = () => {
  const [state, dispatch] = usePromptReducer();
  const nextLocation = useRef(null);
  const unblock = useRef(null);
  const history = useHistory();
  const { blocked, blockedCloseBrowser, confirm } = state;

  const onCommit = () => {
    dispatch({ type: COMMIT });
    if (unblock.current) {
      unblock.current();
      window.onbeforeunload = () => null;
    }
  };

  const onCancel = () => {
    dispatch({ type: CANCEL });
  };

  const blockLocation = useCallback(() => {
    dispatch({ type: BLOCK_LOCATION });
  }, [dispatch]);

  const blockClosingBrowser = useCallback(() => {
    dispatch({ type: BLOCK_CLOSING_BROWSER });
  }, [dispatch]);

  useEffect(() => {
    if (blocked) {
      unblock.current = history.block(location => {
        // block the url nav
        if (!confirm) {
          nextLocation.current = location;
          dispatch({ type: SHOW_MODAL, data: true });
          return false;
        }
        return true;
      });
    }
    return () => {
      if (unblock.current) {
        unblock.current();
      }
    };
  }, [blocked, history, confirm, dispatch]);

  // handles close or refresh the browser tab, may not work in some browsers but is fine
  useEffect(() => {
    if (blockedCloseBrowser) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = () => null;
    }
  });

  useEffect(() => {
    if (confirm && nextLocation.current) {
      history.push(nextLocation.current.pathname);
    }
  }, [blocked, history, confirm]);

  return {
    promptState: state,
    blockLocation,
    blockClosingBrowser,
    onCommit,
    nextLocation,
    onCancel,
    history
  };
};

export default usePrompt;
