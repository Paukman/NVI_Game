import { act } from "@testing-library/react";
import { mockApiData } from "utils/TestUtils";
import { accountsBaseUrl, etransfersBaseUrl } from "api";
import { fetchValidationWithoutModal } from "./utils";
import {
  eTransferLimitsPassing,
  eTransferLimitsFailing,
  eligibleAccountsFromDataPassing,
  eligibleAccountsFromDataFailing
} from "../InteracETransfer.testdata";
import { noEligibleAccountsAlert, dailyLimitReachedAlert } from "./alerts";

const history = {};

describe("Testing validation array logic", () => {
  it(">> Should return Interac Failure", async () => {
    let alertError = false;

    mockApiData([
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    fetchValidationWithoutModal(
      () => {
        alertError = true;
      },
      () => null,
      () => null,
      history,
      () => null,
      modal
    );
    await act(async () => {});
    expect(alertError).toEqual(false);
    expect(modal.show).toHaveBeenCalled();
  });

  it(">> Should return Eligible Accounts Failure", async () => {
    let eligibleAlertError = {};
    let formData = {};
    let showForm = false;

    const setAlertError = newObject => {
      eligibleAlertError = newObject;
    };

    const setFormData = newObject => {
      formData = newObject({});
    };

    const setShowForm = val => {
      showForm = val;
    };

    mockApiData([
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataFailing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);

    fetchValidationWithoutModal(setAlertError, setFormData, setShowForm);

    await act(async () => {});

    expect(eligibleAlertError).toEqual(noEligibleAccountsAlert());

    expect(showForm).toEqual(true);
    expect(formData.interacLimits).toBeInstanceOf(Object);
    expect(formData.withdrawalAccounts).toBeInstanceOf(Array);
  });

  it(">> Should return Limits Accounts Failure", async () => {
    let alertError = {};
    let formData = {};
    let showForm = false;
    const handleClick = () => {};

    const setAlertError = newObject => {
      alertError = newObject;
    };

    const setFormData = newObject => {
      formData = newObject({});
    };

    const setShowForm = val => {
      showForm = val;
    };

    mockApiData([
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsFailing
      }
    ]);

    fetchValidationWithoutModal(
      setAlertError,
      setFormData,
      setShowForm,
      handleClick
    );

    await act(async () => {});

    expect(alertError).toEqual(
      dailyLimitReachedAlert(undefined, { max24HrAmount: 5000 })
    );

    expect(showForm).toEqual(true);
    expect(formData.interacLimits).toBeInstanceOf(Object);
    expect(formData.withdrawalAccounts).toBeInstanceOf(Array);
  });
});
