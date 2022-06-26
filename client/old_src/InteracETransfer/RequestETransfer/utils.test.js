import { mockApiData } from "utils/TestUtils";
import { accountsBaseUrl, etransfersBaseUrl } from "api";
import {
  recipientsPassing,
  recipientsFailing,
  interacProfilePassing,
  interacProfileFailing,
  eTransferLimitsPassing,
  eTransferLimitsFailing,
  eligibleAccountsFromDataPassing,
  eligibleAccountsFromDataFailing
} from "./utils.testdata";
import {
  setRequestETransferFormData,
  isRequestETransferEligible
} from "./utils";

const waitFor = (time = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

describe("Testing setRequestETransferFormData from utils", () => {
  let formData = {};
  let showForm = false;
  const setFormData = newObject => {
    formData = newObject;
  };
  const setShowForm = newObject => {
    showForm = newObject;
  };

  afterEach(() => {
    formData = {};
    showForm = false;
  });

  it(">> should set values when the api call is success", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);
    setRequestETransferFormData(
      setFormData,
      setShowForm,
      null,
      {
        modal: {
          show: () => null,
          hide: () => null
        }
      },
      "James Herbert Bond"
    );
    await waitFor();
    expect(formData).toEqual({
      depositAccounts: recipientsPassing,
      withdrawalAccounts: eligibleAccountsFromDataPassing,
      interacLimits: eTransferLimitsPassing,
      loading: false,
      legalName: "James Herbert Bond"
    });
    expect(showForm).toEqual(true);
  });

  it(">> should return error when there are no eligible accounts", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataFailing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const res = await setRequestETransferFormData(
      setFormData,
      setShowForm,
      null,
      modal
    );
    await waitFor(100);
    expect(res).toEqual([]);
    expect(modal.show).toHaveBeenCalled();
    expect(formData).toEqual({});
    expect(showForm).toEqual(false);
  });
  it(">> should return error when there are no recipients", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsFailing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const recipients = await setRequestETransferFormData(
      setFormData,
      setShowForm,
      null,
      modal
    );
    expect(recipients).toEqual([]);
    expect(formData).toEqual({});
    expect(modal.show).toHaveBeenCalled();
    expect(showForm).toEqual(false);
  });

  it(">> should return error when user request money limit exceeds", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsFailing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const limitsFailedRes = await setRequestETransferFormData(
      setFormData,
      setShowForm,
      null,
      modal
    );
    expect(formData).toEqual({});
    expect(limitsFailedRes).toEqual([]);
    expect(modal.show).toHaveBeenCalled();
    expect(showForm).toEqual(false);
  });
  it(">> should return error when any of the GET calls fail", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: null,
        status: 500,
        method: "GET"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsFailing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const fetchInfoFailedRes = await setRequestETransferFormData(
      setFormData,
      setShowForm,
      null,
      modal
    );
    expect(formData).toEqual({});
    expect(fetchInfoFailedRes).toEqual(false);
    expect(modal.show).toHaveBeenCalled();
    expect(showForm).toEqual(false);
  });
});

describe("Testing isRequestETransferEligible from utils", () => {
  it(">> should set setIsProfileEnabled to true with a valid profile", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    let alertError = false;

    isRequestETransferEligible(
      modal,
      () => {
        alertError = true;
      },
      () => null
    );
    await waitFor();
    expect(modal.show).not.toHaveBeenCalled();
    expect(alertError).toEqual(true);
  });

  it(">> should return error when the profile is invalid", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfileFailing
      }
    ]);
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };

    let alertError = false;

    isRequestETransferEligible(
      modal,
      () => {
        alertError = true;
      },
      () => null
    );
    await waitFor();
    expect(modal.show).toBeCalled();
    expect(alertError).toEqual(false);
  });
});
