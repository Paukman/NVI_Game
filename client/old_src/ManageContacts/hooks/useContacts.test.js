import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import PropTypes from "prop-types";
import mixpanel from "mixpanel-browser";
import { mockApiData } from "utils/TestUtils";
import mockApi, {
  billPaymentsBaseUrl,
  etransfersBaseUrl,
  payeeBaseUrl
} from "api";
import * as useGenericErrorModal from "utils/hooks/useErrorModal";
import { manageContactMessage } from "utils/MessageCatalog";
import DataStore from "utils/store";
import { BILL_PAYMENT_PAYEES } from "utils/store/storeSchema";
import { modeName } from "globalConstants";
import { ModalContext } from "Common/ModalProvider";
import {
  data,
  recipientToHandle,
  approvedCreditors
} from "../ContactsReviewTestData";
import useContacts from "./useContacts";
import { errorTypes } from "../utils";

jest.mock("react-router-dom", () => ({
  useHistory: () => ({ push: jest.fn() })
}));

jest.mock("mixpanel-browser");

const recipientUrl = `${etransfersBaseUrl}/recipients`;
const creditorsUrl = `${billPaymentsBaseUrl}/approvedCreditors`;
const payeeUrl = `${payeeBaseUrl}/payees`;
const optionUrl = `${etransfersBaseUrl}/options`;
const createPayeeUrl = `${billPaymentsBaseUrl}/payees`;
const profileUrl = `${etransfersBaseUrl}/profile`;

const mockWrapper = ({ children }) => (
  <ModalContext.Provider value={{ show: jest.fn() }}>
    {children}
  </ModalContext.Provider>
);
mockWrapper.propTypes = {
  children: PropTypes.element.isRequired
};

describe(">> useContacts hook", () => {
  const mockShowErrorModal = jest.fn();
  let mixpanelMock;

  jest.spyOn(useGenericErrorModal, "default").mockReturnValue({
    showErrorModal: mockShowErrorModal,
    closeErrorModal: jest.fn()
  });
  beforeEach(() => {
    mixpanelMock = jest.spyOn(mixpanel, "track").mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
    DataStore.flush();
  });

  it(">> should fetch contacts", async () => {
    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients
      },
      {
        url: payeeUrl,
        results: data.payees
      },
      {
        url: profileUrl,
        results: data.profile
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    expect(mockApi.get).toHaveBeenCalledWith(recipientUrl);
    expect(mockApi.get).toHaveBeenCalledWith(payeeUrl);
    expect(mockApi.get).toHaveBeenCalledWith(profileUrl);
    expect(result.current.contactsData).toEqual({
      recipients: data.recipients,
      payees: data.payees
    });
  });

  it(">> should call showErrorModal when fetching contacts fails", async () => {
    mockApiData([
      {
        url: recipientUrl,
        error: "some error"
      },
      {
        url: payeeUrl,
        results: data.payees
      },
      {
        url: profileUrl,
        results: data.profile
      }
    ]);

    await act(async () => {
      renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    expect(mockShowErrorModal).toHaveBeenCalledTimes(1);
  });

  it(">> should fetch transferType", async () => {
    mockApiData([
      {
        url: optionUrl,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        results: [{ transferType: 2 }]
      }
    ]);

    let hook;

    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { getTransferType } = result.current;

    let transferType;
    await act(async () => {
      transferType = await getTransferType("faketesting@atb.com");
    });

    expect(mockApi.post).toHaveBeenCalledWith(optionUrl, {
      email: "faketesting@atb.com"
    });
    expect(transferType).toEqual(2);
    expect(result.current.showAutodeposit).toEqual(true);
  });

  it(">> should call showErrorModal when transferType fetch failed", async () => {
    mockApiData([
      {
        url: optionUrl,
        method: "POST",
        data: { email: "faketesting@atb.com" },
        error: "some error"
      }
    ]);

    let hook;

    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { getTransferType } = result.current;

    let transferType;
    await act(async () => {
      transferType = await getTransferType("faketesting@atb.com");
    });

    expect(mockApi.post).toHaveBeenCalledWith(optionUrl, {
      email: "faketesting@atb.com"
    });
    expect(mockShowErrorModal).toHaveBeenCalledTimes(1);
    expect(transferType).toBeNull();
    expect(result.current.showAutodeposit).toEqual(false);
  });

  it(">> should get approvedCreditors", async () => {
    let resultData;
    mockApiData([
      {
        url: creditorsUrl,
        results: approvedCreditors
      }
    ]);
    const setCreditors = values => {
      resultData = values;
    };
    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    await act(async () => {
      await result.current.getApprovedCreditors(setCreditors);
    });

    expect(mockApi.get).toHaveBeenCalledWith(creditorsUrl);
    expect(resultData).toEqual(approvedCreditors);
  });

  it(">> should call showErrorModal when approvedCreditors fetching failed", async () => {
    mockApiData([
      {
        url: creditorsUrl,
        error: "some error"
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    await act(async () => {
      await result.current.getApprovedCreditors();
    });

    expect(mockShowErrorModal).toHaveBeenCalledTimes(1);
  });

  it(">> should add recipient ", async () => {
    const submitData = {
      registrationName: "Recipient Name",
      notificationHandle: "faketesting@atb.com",
      transferAuthentication: 0,
      oneTimeRecipient: false
    };
    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients
      },
      {
        url: payeeUrl,
        results: data.payees
      },
      {
        url: profileUrl,
        results: data.profile
      },
      {
        url: recipientUrl,
        method: "POST",
        status: 201,
        results: {
          confirmationId: "0001"
        }
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setRecipientToHandle, setContactsData } = result.current;

    await act(async () => {
      await setContactsData("This is some contacts data");
    });

    expect(result.current.contactsData).toEqual("This is some contacts data");

    await act(async () => {
      await setRecipientToHandle(recipientToHandle);
    });

    await act(async () => {
      await result.current.addRecipient(submitData);
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      `${etransfersBaseUrl}/recipients`,
      expect.any(Object),
      expect.any(Object)
    );
    expect(result.current.openSnackbar).toEqual(true);
    expect(result.current.isAlertShowing).toEqual(false);
    expect(result.current.contactsData).toEqual(null);
    expect(result.current.recipientToHandle).toEqual(null);
    expect(mixpanelMock).toBeCalledTimes(1);
  });

  it(">> should show alert modal when add is failed ", async () => {
    const putData = {
      registrationName: "Recipient Name",
      notificationHandle: "faketesting@atb.com",
      transferAuthentication: 0,
      oneTimeRecipient: false
    };
    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        method: "POST",
        status: 500,
        error: "Update Failed"
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setRecipientToHandle } = result.current;

    await act(async () => {
      await setRecipientToHandle(recipientToHandle);
    });

    await act(async () => {
      await result.current.addRecipient(putData);
    });

    expect(mockApi.post).toHaveBeenCalled();
    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${etransfersBaseUrl}/recipients`
    );
    expect(result.current.openSnackbar).toEqual(false);
    expect(result.current.isAlertShowing).toEqual(true);
    expect(result.current.alertError).toBeTruthy();
  });

  it(">> should update recipient ", async () => {
    const putData = {
      registrationName: "Updated",
      notificationHandle: "faketesting@atb.com",
      transferAuthentication: 0,
      oneTimeRecipient: false
    };
    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${etransfersBaseUrl}/recipients/CAuTRu9eXMwp`,
        method: "PUT",
        status: 200,
        results: {
          data: {
            confirmationId: "0001"
          }
        }
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setRecipientToHandle, setContactsData } = result.current;

    await act(async () => {
      await setContactsData("This is some contacts data");
    });

    expect(result.current.contactsData).toEqual("This is some contacts data");

    await act(async () => {
      await setRecipientToHandle(recipientToHandle);
    });

    await act(async () => {
      await result.current.updateRecipient(putData);
    });

    expect(mockApi.put).toHaveBeenCalled();
    expect(mockApi.put.mock.calls[0][0]).toContain(
      `${etransfersBaseUrl}/recipients/CAuTRu9eXMwp`
    );
    expect(result.current.openSnackbar).toEqual(true);
    expect(result.current.isAlertShowing).toEqual(false);
    expect(result.current.contactsData).toEqual(null);
    expect(result.current.recipientToHandle).toEqual(null);
  });

  it(">> should show alert modal when update is failed ", async () => {
    const putData = {
      registrationName: "Updated",
      notificationHandle: "faketesting@atb.com",
      transferAuthentication: 0,
      oneTimeRecipient: false
    };
    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${etransfersBaseUrl}/recipients/CAuTRu9eXMwp`,
        method: "PUT",
        status: 500,
        error: "Update Failed"
      }
    ]);

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setRecipientToHandle } = result.current;

    await act(async () => {
      await setRecipientToHandle(recipientToHandle);
    });

    await act(async () => {
      await result.current.updateRecipient(putData);
    });

    expect(mockApi.put).toHaveBeenCalled();
    expect(mockApi.put.mock.calls[0][0]).toContain(
      `${etransfersBaseUrl}/recipients/CAuTRu9eXMwp`
    );
    expect(result.current.openSnackbar).toEqual(false);
    expect(result.current.isAlertShowing).toEqual(true);
    expect(result.current.alertError).toBeTruthy();
  });

  it(">> should update payee in EDIT mode ", async () => {
    const payeeToHandleData = {
      billPayeeId: "0001",
      payeeName: "WEST PARKLAND GAS COOP LTD",
      payeeNickname: "WEST PARKLAND G",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "9871212"
    };

    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${payeeBaseUrl}/payees/0001`,
        method: "PUT",
        status: 200,
        results: {
          data: {
            confirmationId: "0001"
          }
        }
      }
    ]);
    const putData = {
      nickname: "test",
      account: "0001"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setPayeeToHandle, setMode, setContactsData } = result.current;

    await act(async () => {
      await setContactsData("This is some contacts data");
    });

    expect(result.current.contactsData).toEqual("This is some contacts data");

    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
    });
    await act(async () => {
      setMode(modeName.EDIT_MODE);
    });
    expect(result.current.openSnackbar).toEqual(false);
    await act(async () => {
      await result.current.updatePayee(putData);
    });
    expect(mockApi.get).toHaveBeenCalledWith(recipientUrl);
    expect(mockApi.get).toHaveBeenCalledWith(payeeUrl);
    expect(mockApi.put).toHaveBeenCalled();

    expect(mockApi.put.mock.calls[0][0]).toContain(
      `${payeeBaseUrl}/payees/0001`
    );
    expect(result.current.openSnackbar).toEqual(true);
    expect(result.current.contactsData).toEqual(null);
  });

  it(">> should empty Payees from DataStore when a payee is updated", async () => {
    const payeeToHandleData = {
      billPayeeId: "0001",
      payeeName: "WEST PARKLAND GAS COOP LTD",
      payeeNickname: "WEST PARKLAND G",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "9871212"
    };
    DataStore.put(BILL_PAYMENT_PAYEES, [payeeToHandleData]);
    mockApiData([
      {
        url: payeeUrl,
        results: data.payees
      },
      {
        url: `${payeeBaseUrl}/payees/0001`,
        method: "PUT",
        status: 200,
        results: {
          confirmationId: "0001"
        }
      }
    ]);
    const putData = {
      nickname: "test",
      account: "0001"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setPayeeToHandle, setMode } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
    });
    await act(async () => {
      setMode(modeName.EDIT_MODE);
    });
    expect(DataStore.get(BILL_PAYMENT_PAYEES).value.length).toBe(1);

    await act(async () => {
      await result.current.updatePayee(putData);
    });
    expect(mockApi.put).toHaveBeenCalledWith(
      `${payeeBaseUrl}/payees/0001`,
      expect.any(Object),
      expect.any(Object)
    );
    expect(DataStore.get(BILL_PAYMENT_PAYEES)).toBeNull();
  });

  it(">> should update payee in EDIT mode with blank nickname ", async () => {
    const payeeToHandleData = {
      billPayeeId: "2132",
      payeeName: "WEST PARKLAND GAS COOP LTD",
      payeeNickname: "",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "11222333"
    };

    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${payeeBaseUrl}/payees/2132`,
        method: "PUT",
        status: 200,
        results: {
          data: {
            confirmationId: "0001"
          }
        }
      }
    ]);
    const putData = {
      nickname: "",
      account: "2132"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;
    const { setPayeeToHandle, setMode, setContactsData } = result.current;

    await act(async () => {
      await setContactsData("This is some contacts data");
    });

    expect(result.current.contactsData).toEqual("This is some contacts data");

    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
      setMode(modeName.EDIT_MODE);
    });
    expect(result.current.openSnackbar).toEqual(false);
    await act(async () => {
      await result.current.updatePayee(putData);
    });
    expect(mockApi.put).toHaveBeenCalled();

    const [resUrl, resData] = mockApi.put.mock.calls[0];
    expect(resUrl).toEqual(`${payeeBaseUrl}/payees/2132`);
    expect(resData).toEqual({
      payeeCustomerReference: "2132",
      payeeNickname: "WEST PARKLAND GAS CO"
    });

    expect(result.current.openSnackbar).toEqual(true);
    expect(result.current.contactsData).toEqual(null);
  });

  it(">> should handle GENERIC_ERROR error on PUT in EDIT mode ", async () => {
    const payeeToHandleData = {
      billPayeeId: "0001",
      payeeName: "WEST PARKLAND GAS COOP LTD",
      payeeNickname: "WEST PARKLAND G",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "9871212"
    };

    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${payeeBaseUrl}/payees/0001`,
        method: "PUT",
        status: 200,
        error: {
          response: {
            status: 500,
            data: {
              code: "GENERIC_ERROR",
              message: "Failed to update bill payee."
            }
          }
        }
      }
    ]);
    const putData = {
      payeeName: "WEST PARKLAND GAS COOP LTD",
      nickname: "test",
      account: "0001"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setPayeeToHandle, setMode } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
      setMode(modeName.EDIT_MODE);
    });
    await act(async () => {
      setMode(modeName.EDIT_MODE);
    });
    expect(result.current.openSnackbar).toEqual(false);
    await act(async () => {
      await result.current.updatePayee(putData);
    });
    expect(mockApi.get).toHaveBeenCalledWith(recipientUrl);
    expect(mockApi.get).toHaveBeenCalledWith(payeeUrl);
    expect(mockApi.put).toHaveBeenCalled();

    expect(mockApi.put.mock.calls[0][0]).toContain(
      `${payeeBaseUrl}/payees/0001`
    );

    expect(result.current.openSnackbar).toEqual(false);
    expect(result.current.alertError.title).toEqual("System Error");
    const tmp = manageContactMessage.MSG_RBBP_024(
      "WEST PARKLAND GAS COOP LTD/test"
    );
    expect(result.current.alertError.errorMessage).toEqual(tmp);
  });

  it(">> should handle `BP0009` error on PUT in EDIT mode ", async () => {
    const payeeToHandleData = {
      billPayeeId: "0001",
      payeeName: "WEST PARKLAND GAS COOP LTD",
      payeeNickname: "WEST PARKLAND G",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "9871212"
    };

    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${payeeBaseUrl}/payees/0001`,
        method: "PUT",
        status: 200,
        error: {
          response: {
            status: 422,
            data: {
              code: "BP0009",
              message: "Account number is invalid."
            }
          }
        }
      }
    ]);
    const putData = {
      payeeName: "WEST PARKLAND GAS COOP LTD",
      nickname: "test",
      account: "0001"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setPayeeToHandle, setMode } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
      setMode(modeName.EDIT_MODE);
    });
    expect(result.current.openSnackbar).toEqual(false);
    await act(async () => {
      await result.current.updatePayee(putData);
    });
    expect(mockApi.get).toHaveBeenCalledWith(recipientUrl);
    expect(mockApi.get).toHaveBeenCalledWith(payeeUrl);
    expect(mockApi.put).toHaveBeenCalled();

    expect(mockApi.put.mock.calls[0][0]).toContain(
      `${payeeBaseUrl}/payees/0001`
    );
    expect(result.current.openSnackbar).toEqual(false);
    expect(result.current.serverErrors.account.type).toEqual(
      errorTypes.INVALID_ACCOUNT
    );
  });

  it(">> should handle network error on PUT in EDIT mode ", async () => {
    const payeeToHandleData = {
      billPayeeId: "0001",
      payeeName: "WEST PARKLAND GAS COOP LTD",
      payeeNickname: "WEST PARKLAND G",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "9871212"
    };

    mockApiData([
      {
        url: recipientUrl,
        results: data.recipients.data
      },
      {
        url: payeeUrl,
        results: data.payees.data
      },
      {
        url: `${payeeBaseUrl}/payees/0001`,
        method: "PUT",
        status: 200,
        error: "Network Error"
      }
    ]);
    const putData = {
      payeeName: "WEST PARKLAND GAS COOP LTD",
      nickname: "test",
      account: "0001"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setPayeeToHandle, setMode } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
      setMode(modeName.EDIT_MODE);
    });
    await act(async () => {
      setMode(modeName.EDIT_MODE);
    });
    expect(result.current.openSnackbar).toEqual(false);
    await act(async () => {
      await result.current.updatePayee(putData);
    });
    expect(mockApi.get).toHaveBeenCalledWith(recipientUrl);
    expect(mockApi.get).toHaveBeenCalledWith(payeeUrl);
    expect(mockApi.put).toHaveBeenCalled();

    expect(mockApi.put.mock.calls[0][0]).toContain(
      `${payeeBaseUrl}/payees/0001`
    );

    expect(result.current.openSnackbar).toEqual(false);
    expect(result.current.alertError.title).toEqual("System Error");
    const tmp = manageContactMessage.MSG_RBBP_024(
      "WEST PARKLAND GAS COOP LTD/test"
    );
    expect(result.current.alertError.errorMessage).toEqual(tmp);
  });

  it(">> should create payee in CREATE mode ", async () => {
    const payeeToHandleData = {
      approvedCreditorId: "",
      payeeCustomerReference: "",
      payeeNickname: ""
    };

    mockApiData([
      {
        url: creditorsUrl,
        results: approvedCreditors
      },
      {
        url: createPayeeUrl,
        method: "POST",
        status: 201,
        results: {
          data: {
            confirmationId: "0001"
          }
        }
      }
    ]);
    const postData = {
      payeeName: "123 Tree Planting",
      nickname: "test",
      account: "1233"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const {
      setPayeeToHandle,
      setMode,
      setApprovedCreditorsList,
      setContactsData
    } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
    });
    await act(async () => {
      setMode(modeName.CREATE_MODE);
    });

    await act(async () => {
      await setContactsData("This is some contacts data");
    });

    expect(result.current.contactsData).toEqual("This is some contacts data");

    await act(async () => {
      setApprovedCreditorsList(approvedCreditors);
    });
    expect(result.current.openSnackbar).toEqual(false);

    expect(mockApi.get).toHaveBeenCalledWith(createPayeeUrl);

    await act(async () => {
      await result.current.updatePayee(postData);
    });

    expect(mockApi.post).toHaveBeenCalled();

    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${billPaymentsBaseUrl}/payees`
    );
    // TODO confirmationID is discarded?
    // expect(updateresult.confirmationId).toEqual("0001");
    expect(result.current.openSnackbar).toEqual(true);
    expect(result.current.contactsData).toEqual(null);
    expect(mixpanelMock).toBeCalledTimes(1);
  });

  it(">> should empty Payees from DataStore when a new payee is added", async () => {
    const payeeToHandleData = {
      approvedCreditorId: "",
      payeeCustomerReference: "",
      payeeNickname: ""
    };
    DataStore.put(BILL_PAYMENT_PAYEES, [payeeToHandleData]);
    mockApiData([
      {
        url: creditorsUrl,
        results: approvedCreditors
      },
      {
        url: createPayeeUrl,
        method: "POST",
        status: 201,
        results: {
          data: {
            confirmationId: "0001"
          }
        }
      }
    ]);
    const postData = {
      payeeName: "123 Tree Planting",
      nickname: "test",
      account: "1233"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const {
      setPayeeToHandle,
      setMode,
      setApprovedCreditorsList
    } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
    });
    await act(async () => {
      setMode(modeName.CREATE_MODE);
    });

    await act(async () => {
      setApprovedCreditorsList(approvedCreditors);
    });

    expect(DataStore.get(BILL_PAYMENT_PAYEES).value.length).toBe(1);

    await act(async () => {
      await result.current.updatePayee(postData);
    });

    expect(mockApi.post).toHaveBeenCalled();

    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${billPaymentsBaseUrl}/payees`
    );
    expect(DataStore.get(BILL_PAYMENT_PAYEES)).toBeNull();
  });

  it(">> should handle GENERIC_ERROR failure in CREATE mode ", async () => {
    const payeeToHandleData = {
      approvedCreditorId: "",
      payeeCustomerReference: "",
      payeeNickname: ""
    };

    mockApiData([
      {
        url: creditorsUrl,
        results: approvedCreditors
      },
      {
        url: createPayeeUrl,
        method: "POST",
        error: {
          response: {
            status: 500,
            data: {
              code: "GENERIC_ERROR",
              message: "Failed to add bill payee."
            }
          }
        }
      }
    ]);
    const postData = {
      payeeName: "123 Tree Planting",
      nickname: "test",
      account: "1233"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const {
      setPayeeToHandle,
      setMode,
      setApprovedCreditorsList
    } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
    });
    await act(async () => {
      setMode(modeName.CREATE_MODE);
    });

    await act(async () => {
      setApprovedCreditorsList(approvedCreditors);
    });
    expect(result.current.openSnackbar).toEqual(false);

    expect(mockApi.get).toHaveBeenCalledWith(createPayeeUrl);
    await act(async () => {
      await result.current.updatePayee(postData);
    });
    expect(mockApi.post).toHaveBeenCalled();

    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${billPaymentsBaseUrl}/payees`
    );

    expect(result.current.alertError.title).toEqual("System Error");
    expect(result.current.alertError.errorMessage).toEqual(
      "We couldn't add this payee 123 Tree Planting/test. Please try again."
    );

    expect(result.current.openSnackbar).toEqual(false);
  });

  it(">> should handle `BP0009` error in CREATE mode ", async () => {
    const payeeToHandleData = {
      approvedCreditorId: "",
      payeeCustomerReference: "",
      payeeNickname: ""
    };

    mockApiData([
      {
        url: creditorsUrl,
        results: approvedCreditors
      },
      {
        url: createPayeeUrl,
        method: "POST",
        error: {
          response: {
            status: 422,
            data: {
              code: "BP0009",
              message: "Account number is invalid."
            }
          }
        }
      }
    ]);
    const postData = {
      payeeName: "123 Tree Planting",
      nickname: "test",
      account: "1233"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const {
      setPayeeToHandle,
      setMode,
      setApprovedCreditorsList
    } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
      setMode(modeName.CREATE_MODE);
      setApprovedCreditorsList(approvedCreditors);
    });
    expect(result.current.openSnackbar).toEqual(false);

    expect(mockApi.get).toHaveBeenCalledWith(createPayeeUrl);
    await act(async () => {
      await result.current.updatePayee(postData);
    });
    expect(mockApi.post).toHaveBeenCalled();

    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${billPaymentsBaseUrl}/payees`
    );
    expect(result.current.serverErrors.account.type).toEqual(
      errorTypes.INVALID_ACCOUNT
    );
  });

  it(">> should create payee in CREATE mode with a blank nick name", async () => {
    mockApiData([
      {
        url: creditorsUrl,
        results: data.payees.approvedCreditors
      },
      {
        url: createPayeeUrl,
        method: "POST",
        status: 201,
        results: {
          data: {
            confirmationId: "0001"
          }
        }
      }
    ]);
    const postData = {
      payeeName: "123 Tree Planting",
      nickname: "",
      account: "1233"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;
    const {
      setMode,
      setApprovedCreditorsList,
      setContactsData
    } = result.current;

    await act(async () => {
      await setContactsData("This is some contacts data");
    });

    expect(result.current.contactsData).toEqual("This is some contacts data");

    await act(async () => {
      setMode(modeName.CREATE_MODE);
    });
    await act(async () => {
      setApprovedCreditorsList(approvedCreditors);
    });
    await act(async () => {
      await result.current.updatePayee(postData);
    });
    expect(mockApi.post).toHaveBeenCalled();
    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${billPaymentsBaseUrl}/payees`
    );

    expect(result.current.openSnackbar).toEqual(true);
    expect(result.current.contactsData).toEqual(null);
  });

  it(">> should handle a network error in CREATE mode ", async () => {
    const payeeToHandleData = {
      approvedCreditorId: "",
      payeeCustomerReference: "",
      payeeNickname: ""
    };

    mockApiData([
      {
        url: creditorsUrl,
        results: approvedCreditors
      },
      {
        url: createPayeeUrl,
        method: "POST",
        error: "Network Error"
      }
    ]);
    const postData = {
      payeeName: "123 Tree Planting",
      nickname: "test",
      account: "1233"
    };

    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const {
      setPayeeToHandle,
      setMode,
      setApprovedCreditorsList
    } = result.current;
    await act(async () => {
      setPayeeToHandle(payeeToHandleData);
      setMode(modeName.CREATE_MODE);
      setApprovedCreditorsList(approvedCreditors);
    });
    expect(result.current.openSnackbar).toEqual(false);

    expect(mockApi.get).toHaveBeenCalledWith(createPayeeUrl);
    await act(async () => {
      await result.current.updatePayee(postData);
    });
    expect(mockApi.post).toHaveBeenCalled();

    expect(mockApi.post.mock.calls[0][0]).toContain(
      `${billPaymentsBaseUrl}/payees`
    );

    expect(result.current.alertError.title).toEqual(
      manageContactMessage.MSG_RBBP_019_TITLE
    );
    expect(result.current.alertError.errorMessage).toEqual(
      "We couldn't add this payee 123 Tree Planting/test. Please try again."
    );

    expect(result.current.openSnackbar).toEqual(false);
  });

  it(">> should clear a server error ", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useContacts(), {
        wrapper: mockWrapper
      });
    });
    const { result } = hook;

    const { setServerErrors } = result.current;
    await act(async () => {
      setServerErrors({ account: { type: errorTypes.INVALID_ACCOUNT } });
    });
    expect(result.current.serverErrors.account.type).toEqual(
      errorTypes.INVALID_ACCOUNT
    );
    await act(async () => {
      result.current.clearServerError(errorTypes.INVALID_ACCOUNT);
    });

    expect(result.current.serverErrors.account.type).toBeNull();
  });
});
