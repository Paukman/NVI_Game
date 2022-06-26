import React from "react";
import PropTypes from "prop-types";
import mixpanel from "mixpanel-browser";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  RenderWithProviders,
  mockApiData,
  windowMatchMediaMock,
  resetMockApiData
} from "utils/TestUtils";
import { etransfersBaseUrl } from "api";
import { AntModalContext } from "StyleGuide/Components/Modal";
import { eTransferErrors } from "utils/MessageCatalog";
import useAddRecipient from "./useAddRecipient";

import {
  AUTODEPOSIT_REGISTERED,
  AUTODEPOSIT_NOT_REGISTERED,
  AUTODEPOSIT_REGISTERED_ERR,
  ADD_RECIPIENT_SUCCESS,
  ADD_RECIPIENT_ERR,
  ADD_RECIPIENT_FORM,
  SECURITY_QUESTION_FORM,
  AUTODEPOSIT_REGISTERED_FORM
} from "./utils";

const WrapperWithArgs = ({
  showMessage = null,
  show = () => {},
  close = () => {},
  antModal = null
}) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders
        location="/"
        modalComponent={() => {}}
        showMessage={showMessage}
      >
        <AntModalContext.Provider value={{ close, show, antModal }}>
          {children}
        </AntModalContext.Provider>
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

jest.mock("mixpanel-browser");

describe("useAddRecipient hook", () => {
  let mixpanelMock;

  beforeEach(() => {
    windowMatchMediaMock();
    mixpanelMock = jest.spyOn(mixpanel, "track").mockImplementation();
  });

  it(">> should return AUTODEPOSIT_REGISTERED", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options`,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 2 }]
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({
            handleAddRecipient: () => {},
            showAddRecipient: () => {}
          }),
        {
          wrapper: WrapperWithArgs({})
        }
      );
    });
    const { result } = hook;
    let isAutodepositRegistered;
    await act(async () => {
      isAutodepositRegistered = await result.current.isAutodepositRegistered(
        "faketesting@atb.com"
      );
    });
    expect(isAutodepositRegistered).toEqual(AUTODEPOSIT_REGISTERED);
    expect(result.current.recipientState.autodepositRegistered).toEqual(true);
  });

  it(">> should return AUTODEPOSIT_NOT_REGISTERED", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/options`,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 1 }]
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({
            handleAddRecipient: () => {},
            showAddRecipient: () => {}
          }),
        {
          wrapper: WrapperWithArgs({})
        }
      );
    });
    const { result } = hook;
    let isAutodepositRegistered;
    await act(async () => {
      isAutodepositRegistered = await result.current.isAutodepositRegistered(
        "faketesting@atb.com"
      );
    });
    expect(isAutodepositRegistered).toEqual(AUTODEPOSIT_NOT_REGISTERED);
    expect(result.current.recipientState.autodepositRegistered).toEqual(false);
  });

  it(">> should return AUTODEPOSIT_REGISTERED_ERR", async () => {
    resetMockApiData();
    let hook;
    const show = jest.fn();
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({
            handleAddRecipient: () => {},
            showAddRecipient: () => {}
          }),
        {
          wrapper: WrapperWithArgs({ show })
        }
      );
    });
    const { result } = hook;
    let isAutodepositRegistered;
    const spy = jest.spyOn(result.current, "showModal");

    await act(async () => {
      isAutodepositRegistered = await result.current.isAutodepositRegistered(
        "com@com.com"
      );
    });
    expect(isAutodepositRegistered).toEqual(AUTODEPOSIT_REGISTERED_ERR);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        content: eTransferErrors.MSG_REBAS_000_CONTENT
      })
    );
  });

  it(">> should return ADD_RECIPIENT_SUCCESS with savings to contact true", async () => {
    const showMessage = jest.fn();
    const handleAddRecipient = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: { recipientId: "CA4Tq7nzhK4z" },
        status: 201,
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({ handleAddRecipient, showAddRecipient: () => {} }),
        {
          wrapper: WrapperWithArgs({ showMessage })
        }
      );
    });
    const { result } = hook;

    const spy = jest.spyOn(result.current, "showMessage");
    let isAutodepositRegistered;
    await act(async () => {
      isAutodepositRegistered = await result.current.addRecipient(
        "Question",
        "Answer",
        true
      );
    });
    expect(isAutodepositRegistered).toEqual(ADD_RECIPIENT_SUCCESS);
    expect(mixpanelMock).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        type: "success",
        content: `You've successfully added recipient ${result.current.recipientState.recipientName} and saved them to your contacts.`
      })
    );
    expect(handleAddRecipient).toBeCalled();
  });

  it(">> should return ADD_RECIPIENT_SUCCESS with savings to contact false", async () => {
    const showMessage = jest.fn();
    const handleAddRecipient = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: { recipientId: "CA4Tq7nzhK4z" },
        status: 201,
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({ handleAddRecipient, showAddRecipient: () => {} }),
        {
          wrapper: WrapperWithArgs({ showMessage })
        }
      );
    });
    const { result } = hook;

    const spy = jest.spyOn(result.current, "showMessage");
    let isAutodepositRegistered;
    await act(async () => {
      isAutodepositRegistered = await result.current.addRecipient(
        "Question",
        "Answer",
        false
      );
    });
    expect(isAutodepositRegistered).toEqual(ADD_RECIPIENT_SUCCESS);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        type: "success",
        content: `You've successfully added recipient ${result.current.recipientState.recipientName}.`
      })
    );
    expect(handleAddRecipient).toBeCalled();
  });
  it(">> should return ADD_RECIPIENT_ERR", async () => {
    const show = jest.fn();
    const handleAddRecipient = jest.fn();
    const showAddRecipient = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: { recipientId: "CA4Tq7nzhK4z" },
        status: 400,
        method: "post"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({
            handleAddRecipient,
            showAddRecipient
          }),
        {
          wrapper: WrapperWithArgs({ show })
        }
      );
    });
    const { result } = hook;

    const spy = jest.spyOn(result.current, "showModal");
    let isAutodepositRegistered;
    await act(async () => {
      isAutodepositRegistered = await result.current.addRecipient(
        "Question",
        "Answer",
        true
      );
    });
    expect(isAutodepositRegistered).toEqual(ADD_RECIPIENT_ERR);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        content: eTransferErrors.MSG_REBAS_000_CONTENT
      })
    );
  });

  it(">> sould test onFormFinish", async () => {
    const showMessage = jest.fn();
    const handleAddRecipient = jest.fn();
    const getFieldValue = jest.fn();
    const setFieldsValue = jest.fn();
    const forms = {
      [ADD_RECIPIENT_FORM]: { getFieldValue },
      [AUTODEPOSIT_REGISTERED_FORM]: { getFieldValue, setFieldsValue },
      [SECURITY_QUESTION_FORM]: { getFieldValue, setFieldsValue }
    };

    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useAddRecipient({ handleAddRecipient, showAddRecipient: () => {} }),
        {
          wrapper: WrapperWithArgs({ showMessage })
        }
      );
    });
    const { result } = hook;
    await act(async () => {
      await result.current.onFormFinish(AUTODEPOSIT_REGISTERED_FORM, { forms });
    });
    expect(getFieldValue).toBeCalledWith("saveRecipient");

    await act(async () => {
      await result.current.onFormFinish(SECURITY_QUESTION_FORM, { forms });
    });
    expect(getFieldValue).toBeCalledTimes(4);

    await act(async () => {
      await result.current.onFormFinish(ADD_RECIPIENT_FORM, { forms });
    });
    expect(getFieldValue).toBeCalledTimes(8);
    expect(setFieldsValue).toBeCalledTimes(1);
  });

  it(">> should call onCancel and tryAgain", async () => {
    const handleAddRecipient = jest.fn();
    const showAddRecipient = jest.fn();

    let hook;
    await act(async () => {
      hook = renderHook(
        () => useAddRecipient({ handleAddRecipient, showAddRecipient }),
        {
          wrapper: WrapperWithArgs({})
        }
      );
    });

    const { result } = hook;
    await act(async () => {
      await result.current.onCancel();
    });
    expect(showAddRecipient).toBeCalledWith(false);

    await act(async () => {
      await result.current.onTryAgain();
    });
    expect(showAddRecipient).toBeCalledWith(true);
  });
});
