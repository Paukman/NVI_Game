import { eTransferDataMock } from "InteracETransfer/validatorsTestData";
import { validateAmountLimits, validateDepositorHashType } from "./validators";

describe("validateAmountLimits Test", () => {
  it(">> Should have no error if value is ok", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();
    const setInlineLimitsError = jest.fn();
    const setETransferSubmit = jest.fn();
    const nextTab = jest.fn();

    const combinedFormData = {
      from: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc",
      to: "CAhGbyStTDEs",
      amount: "12234"
    };
    validateAmountLimits(
      0,
      eTransferDataMock,
      "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc",
      setAlertError,
      setInlineLimitsError,
      combinedFormData,
      setETransferSubmit,
      nextTab
    );
    expect(setETransferSubmit).toHaveBeenCalledTimes(1);
    expect(nextTab).toHaveBeenCalledTimes(1);
    expect(setAlertError).toHaveBeenCalledTimes(0);
    expect(clearError).not.toHaveBeenCalled();
  });

  it(">> Should set error if value is really big", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();
    const setInlineLimitsError = jest.fn();
    const setETransferSubmit = jest.fn();
    const nextTab = jest.fn();

    const combinedFormData = {
      from: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
      to: "CAhGbyStTDEs",
      amount: "312421321432"
    };
    validateAmountLimits(
      312421321432,
      eTransferDataMock,
      "CAhGbyStTDEs",
      setAlertError,
      setInlineLimitsError,
      combinedFormData,
      setETransferSubmit,
      nextTab
    );
    expect(setETransferSubmit).toHaveBeenCalledTimes(0);
    expect(nextTab).toHaveBeenCalledTimes(0);
    expect(setAlertError).toHaveBeenCalledTimes(1);

    expect(setAlertError).toHaveBeenCalledWith({
      title: "Transaction Limit Exceeded",
      errorMessage:
        "Funds cannot be sent to goku because this would exceed your daily transfer limit.",
      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: undefined
        }
      ]
    });
    expect(clearError).not.toHaveBeenCalled();
  });

  it(">> Should set error if hits monthly limit", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();
    const setInlineLimitsError = jest.fn();
    const setETransferSubmit = jest.fn();
    const nextTab = jest.fn();

    const combinedFormData = {
      from: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
      to: "CAhGbyStTDEs",
      amount: "312421321432"
    };
    validateAmountLimits(
      50,
      eTransferDataMock,
      "CAhGbyStTDEs",
      setAlertError,
      setInlineLimitsError,
      combinedFormData,
      setETransferSubmit,
      nextTab
    );

    expect(setAlertError).toHaveBeenCalledWith({
      title: "Transaction Limit Exceeded",
      errorMessage:
        "Funds cannot be sent to goku because this would exceed your monthly transfer limit of $25.00.",
      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: undefined
        }
      ]
    });
    expect(setETransferSubmit).toHaveBeenCalledTimes(0);
    expect(nextTab).toHaveBeenCalledTimes(0);
    expect(setAlertError).toHaveBeenCalledTimes(1);
    expect(clearError).not.toHaveBeenCalled();
  });

  it(">> Should set error if hits weekly limit", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();
    const setInlineLimitsError = jest.fn();
    const setETransferSubmit = jest.fn();
    const nextTab = jest.fn();

    const combinedFormData = {
      from: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
      to: "CAhGbyStTDEs",
      amount: "312421321432"
    };
    validateAmountLimits(
      100,
      eTransferDataMock,
      "CAhGbyStTDEs",
      setAlertError,
      setInlineLimitsError,
      combinedFormData,
      setETransferSubmit,
      nextTab
    );

    expect(setAlertError).toHaveBeenCalledWith({
      title: "Transaction Limit Exceeded",
      errorMessage:
        "Funds cannot be sent to goku because this would exceed your weekly transfer limit of $50.00.",
      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: undefined
        }
      ]
    });
    expect(setETransferSubmit).toHaveBeenCalledTimes(0);
    expect(nextTab).toHaveBeenCalledTimes(0);
    expect(setAlertError).toHaveBeenCalledTimes(1);
    expect(clearError).not.toHaveBeenCalled();
  });

  it(">> Should set error if hits daily limit", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();
    const setInlineLimitsError = jest.fn();
    const setETransferSubmit = jest.fn();
    const nextTab = jest.fn();

    const combinedFormData = {
      from: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y",
      to: "CAhGbyStTDEs",
      amount: "312421321432"
    };
    validateAmountLimits(
      312421321432,
      eTransferDataMock,
      "CAhGbyStTDEs",
      setAlertError,
      setInlineLimitsError,
      combinedFormData,
      setETransferSubmit,
      nextTab
    );

    expect(setAlertError).toHaveBeenCalledWith({
      title: "Transaction Limit Exceeded",
      errorMessage:
        "Funds cannot be sent to goku because this would exceed your daily transfer limit.",
      buttons: [
        {
          buttonName: "OK",
          url: "/move-money/send-money",
          onClick: undefined
        }
      ]
    });
    expect(setETransferSubmit).toHaveBeenCalledTimes(0);
    expect(nextTab).toHaveBeenCalledTimes(0);
    expect(setAlertError).toHaveBeenCalledTimes(1);
    expect(clearError).not.toHaveBeenCalled();
  });
});

describe("validateDepositorHashType Test", () => {
  it(">> Should set error if value is invalid SHA encryption", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();

    validateDepositorHashType(
      "CAe2Pmv4tz3B",
      eTransferDataMock.depositAccounts,
      setAlertError
    );
    expect(setAlertError).toHaveBeenCalledTimes(1);

    expect(clearError).not.toHaveBeenCalled();
  });
  it(">> Should set error if value is valid encryption scheme", () => {
    const clearError = jest.fn();
    const setAlertError = jest.fn();

    validateDepositorHashType(
      "CAzvX8UAKu9X",
      eTransferDataMock.depositAccounts,
      setAlertError
    );
    expect(setAlertError).toHaveBeenCalledTimes(0);

    expect(clearError).not.toHaveBeenCalled();
  });
});

// TODO: is missing test of validate eligibility
// TODO:  validate eligibility actually breaks the pattern of HOC? why is a validator performing HOC tasks?
