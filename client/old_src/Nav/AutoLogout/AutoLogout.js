import React, { useContext } from "react";
import { ModalContext } from "Common/ModalProvider";
import { autoLogout } from "utils/MessageCatalog";
import useAutoLogout from "./useAutoLogout";

const idle = window.envConfig
  ? parseInt(window.envConfig.IDLE_TIMEOUT, 10)
  : 480 * 1000;
const IDLE_TIME = Number.isNaN(Number(idle)) ? 480 * 1000 : idle;

const AutoLogout = () => {
  const { modalComponent } = useContext(ModalContext);
  const { time, show, handleLogout, handleContinue } = useAutoLogout(IDLE_TIME);
  return modalComponent({
    show,
    content: autoLogout.MSG_RB_AUTH_035(time.seconds),
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={handleLogout}
        >
          Log out
        </button>
        <button
          type="button"
          className="ui button basic"
          onClick={handleContinue}
        >
          Continue banking
        </button>
      </>
    )
  });
};

export default AutoLogout;
