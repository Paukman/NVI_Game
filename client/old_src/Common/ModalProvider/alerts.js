import React from "react";
import { eTransferErrors } from "utils/MessageCatalog";

export const systemErrorAlert = (history, hide) => {
  return {
    content: eTransferErrors.MSG_REBAS_000,
    actions: (
      <button
        type="button"
        className="ui button basic"
        onClick={() => {
          if (history) history.push("/overview");
          hide();
        }}
      >
        OK
      </button>
    )
  };
};
