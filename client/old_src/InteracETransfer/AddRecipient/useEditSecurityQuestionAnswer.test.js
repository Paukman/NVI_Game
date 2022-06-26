import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  RenderWithProviders,
  mockApiData,
  windowMatchMediaMock
} from "utils/TestUtils";
import { etransfersBaseUrl } from "api";
import { AntModalContext } from "StyleGuide/Components/Modal";
import { eTransferErrors } from "utils/MessageCatalog";
import useEditSecurityQuestionAnswer from "./useEditSecurityQuestionAnswer";

import { EDIT_RECIPIENT_SUCCESS, EDIT_RECIPIENT_ERR } from "./utils";

const recipient = {
  recipientName: "name",
  recipientEmail: "email@email.com",
  recipientId: "100erjhksjhd"
};

const selectedAccount = {
  recipientId: "100erjhksjhd",
  aliasName: "name",
  defaultTransferAuthentication: {
    authenticationType: "None",
    question: "question",
    hashType: "SHA2"
  },
  notificationPreference: [
    {
      notificationHandleType: "Email",
      notificationHandle: "email@email.com",
      isActive: true
    }
  ]
};

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

describe("useAddRecipient hook", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should return EDIT_RECIPIENT_SUCCESS ", async () => {
    const showMessage = jest.fn();
    const handleEditRecipient = jest.fn();
    const showEditSecurityQuestionAnswer = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients/${selectedAccount.recipientId}`,
        result: {
          status: 230
        },
        method: "put"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useEditSecurityQuestionAnswer({
            handleEditRecipient,
            recipient,
            showEditSecurityQuestionAnswer
          }),
        {
          wrapper: WrapperWithArgs({ showMessage })
        }
      );
    });
    const { result } = hook;

    const spy = jest.spyOn(result.current, "showMessage");
    let editRecipient;
    await act(async () => {
      editRecipient = await result.current.editSecurityQuestion(
        "Question",
        "Answer"
      );
    });
    expect(editRecipient).toEqual(EDIT_RECIPIENT_SUCCESS);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        type: "success",
        content: `You’ve successfully updated recipient name.`
      })
    );
    expect(handleEditRecipient).toBeCalled();
  });

  it(">> should return EDIT_RECIPIENT_ERR", async () => {
    const handleEditRecipient = jest.fn();
    const show = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients/${selectedAccount.recipientId}`,
        result: [],
        status: 400,
        code: "INVALID_REQUEST",
        method: "put"
      }
    ]);
    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useEditSecurityQuestionAnswer({
            handleEditRecipient,
            recipient,
            showEditSecurityQuestionAnswer: () => {}
          }),
        {
          wrapper: WrapperWithArgs({ show })
        }
      );
    });
    const { result } = hook;

    const spy = jest.spyOn(result.current, "showModal");
    let editRecipient;
    await act(async () => {
      editRecipient = await result.current.editSecurityQuestion(
        "Question",
        "Answer"
      );
    });
    expect(editRecipient).toEqual(EDIT_RECIPIENT_ERR);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        content: eTransferErrors.MSG_REBAS_000_CONTENT
      })
    );
  });

  it(">> should call onCancel and tryAgain", async () => {
    const handleEditRecipient = jest.fn();
    const showEditSecurityQuestionAnswer = jest.fn();

    let hook;
    await act(async () => {
      hook = renderHook(
        () =>
          useEditSecurityQuestionAnswer({
            handleEditRecipient,
            recipient,
            showEditSecurityQuestionAnswer
          }),
        {
          wrapper: WrapperWithArgs({})
        }
      );
    });

    const { result } = hook;
    await act(async () => {
      await result.current.onCancel();
    });
    expect(showEditSecurityQuestionAnswer).toBeCalledWith(false);

    await act(async () => {
      await result.current.onTryAgain();
    });
    expect(showEditSecurityQuestionAnswer).toBeCalledWith(true);
  });
});
