import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  RenderWithProviders,
  mockApiData,
  windowMatchMediaMock
} from "utils/TestUtils";
import { SNACKBAR_TOP_DEFAULT_VIEW } from "utils/hooks/useGetSnackbarTop";
import { etransfersBaseUrl } from "api";
import { eTransferErrors } from "utils/MessageCatalog";
import useUpdateRecipient from "./useUpdateRecipient";

const selectedAccount = {
  recipientId: "CAhGbyStTbMv",
  aliasName: "alias name",
  defaultTransferAuthentication: {
    authenticationType: "None",
    question: "question",
    hashType: "SHA2"
  },
  notificationPreference: [
    {
      notificationHandleType: "Email",
      notificationHandle: "1+1@1.com",
      isActive: true
    }
  ]
};

const Wrapper = (
  location,
  show,
  hide,
  modalComponent,
  showMessage = jest.fn()
) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location={location}
        show={show}
        hide={hide}
        modalComponent={modalComponent}
        showMessage={showMessage}
      >
        {children}
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("Testing useUpdateRecipient", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> can render", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const showMessage = jest.fn();
    let hook;
    await act(async () => {
      hook = renderHook(() => useUpdateRecipient(), {
        wrapper: Wrapper("/", show, hide, () => null, showMessage)
      });
    });
    const { result } = hook;
    expect(result.current.isPosting).toEqual(false);
    return result;
  });

  it(">> update with success", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const showMessage = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients/${selectedAccount.recipientId}`,
        results: [],
        status: 200,
        method: "put"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(() => useUpdateRecipient(), {
        wrapper: Wrapper("/", show, hide, () => null, showMessage)
      });
    });
    const { result } = hook;
    const spy = jest.fn();
    const errorResetSpy = jest.fn();
    await act(async () => {
      await result.current.updateRecipient(
        selectedAccount,
        spy,
        "question",
        "answer",
        errorResetSpy
      );
    });
    expect(result.current.isPosting).toEqual(false);
    expect(spy).toHaveBeenCalled();
    expect(errorResetSpy).toHaveBeenCalled();
    expect(result.current.showMessage).toBeCalledWith({
      type: "success",
      top: SNACKBAR_TOP_DEFAULT_VIEW,
      content: eTransferErrors.MSG_RBET_036D(selectedAccount.aliasName)
    });
  });
});
