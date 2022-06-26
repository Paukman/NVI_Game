import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { act as actHook } from "@testing-library/react-hooks";
import { RenderWithProviders, mockApiData } from "utils/TestUtils";
import { MemoryRouter } from "react-router-dom";
import DataStore from "utils/store";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import InteracPrefProvider, {
  InteracPreferencesContext
} from "../InteracPrefProvider";
import RulesView from "./RulesView";

import AutodepositForm from "./AutodepositForm";
import {
  testProfile,
  testAutodeposit,
  loggedInUser,
  autodepositRules,
  accounts,
  interacProfile,
  accountsURL,
  loggedinUserURL,
  profileURL
} from "../constants";
import { autoDepositconfig } from "../hooks/constants";

describe(">> InteracPreferencePage Interac profile with rules", () => {
  it(">> should show review rules page ", async () => {
    const editProfile = () => {};
    const { getByText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            userProfile: { profile: testProfile },
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: [],
                rules: [
                  {
                    account: "7679",
                    accountHolderName: "George Morgan Vegas",
                    accountId: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
                    accountName: "No-Fee All-In Account",
                    directDepositHandle: "test@atb.cozncm",
                    directDepositReferenceNumber: "CA1DDNbVNszUPDRW",
                    registrationStatus: 0
                  }
                ],
                error: { type: null }
              },
              updateAutodeposit: () => null,
              createAutodepositRule: () => null,
              handleOnChange: () => null,
              handleRegister: () => null,
              handleHideSidebar: () => null
            },
            editProfile
          }}
        >
          <RulesView />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    expect(getByText("Register another email")).toBeTruthy();
  });
  it(">> should show review rules page with pending status ", async () => {
    const editProfile = () => {};
    const { getByText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            userProfile: { profile: testProfile },
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: [],
                rules: [
                  {
                    account: "7679",
                    accountHolderName: "George Morgan Vegas",
                    accountId: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
                    accountName: "No-Fee All-In Account",
                    directDepositHandle: "test@atb.cozncm",
                    directDepositReferenceNumber: "CA1DDNbVNszUPDRW",
                    registrationStatus: 0
                  }
                ],
                error: { type: null }
              },
              updateAutodeposit: () => null,
              createAutodepositRule: () => null,
              handleOnChange: () => null,
              handleRegister: () => null,
              handleHideSidebar: () => null
            },
            editProfile
          }}
        >
          <RulesView />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    expect(getByText("PENDING")).toBeTruthy();
  });
  it(">> should show review rules page with active status ", async () => {
    const editProfile = () => {};
    const { getByText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            userProfile: { profile: testProfile },
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: [],
                rules: [
                  {
                    account: "7679",
                    accountHolderName: "George Morgan Vegas",
                    accountId: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
                    accountName: "No-Fee All-In Account",
                    directDepositHandle: "test@atb.cozncm",
                    directDepositReferenceNumber: "CA1DDNbVNszUPDRW",
                    registrationStatus: 1
                  }
                ],
                error: { type: null }
              },
              updateAutodeposit: () => null,
              createAutodepositRule: () => null,
              handleOnChange: () => null,
              handleRegister: () => null,
              handleHideSidebar: () => null
            },
            editProfile
          }}
        >
          <RulesView />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    expect(getByText("ACTIVE")).toBeTruthy();
  });
  it(">> should call handleRegister on 'Register another email' button click", async () => {
    const handleRegister = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            userProfile: { profile: testProfile },
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: [],
                rules: [],
                register: false,
                error: { type: null }
              },
              updateAutodeposit: () => null,
              createAutodepositRule: () => null,
              handleOnChange: () => null,
              handleRegister,
              handleHideSidebar: () => null
            },
            editProfile: () => null
          }}
        >
          <RulesView />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    const registerButton = getByText("Register another email");
    await act(async () => {
      fireEvent.click(registerButton);
    });
    expect(handleRegister).toHaveBeenCalled();
  });

  it(">> should call handleDelete on 'Trash can' button click and key down", async () => {
    const deleteAutoDepositRule = jest.fn();
    const onKeyDown = jest.fn();
    const { findAllByAltText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            userProfile: { profile: testProfile },
            autodeposit: {
              autodepositState: {
                email: "",
                mode: "PENDING",
                accounts: [
                  {
                    value: "123456",
                    key: "dkjfguf3747574365346"
                  }
                ],
                rules: testAutodeposit.autodepositState.rules,
                autodepositRule: testAutodeposit.autodepositState.rules[1],
                error: { type: null }
              },
              updateAutodeposit: () => null,
              createAutodepositRule: () => null,
              handleOnChange: () => null,
              deleteAutoDepositRule,
              onKeyDown
            },
            editProfile: () => null
          }}
        >
          <RulesView />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    // find all 'span' buttons and test click on image calls delete
    const deleteAutodeposits = await findAllByAltText(
      `delete-autodeposit-${testAutodeposit.autodepositState.rules[1].directDepositReferenceNumber}`
    );
    await act(async () => {
      fireEvent.click(deleteAutodeposits[0]);
    });
    expect(deleteAutoDepositRule).toHaveBeenCalled();

    await act(async () => {
      fireEvent.keyDown(deleteAutodeposits[0], {
        key: "Enter",
        code: 13,
        charCode: 13
      });
    });
    expect(onKeyDown).toHaveBeenCalled();
  });

  it(">> should call handleUpdate on 'Chevron' button click and key down", async () => {
    const setAutoDepositRule = jest.fn();
    const onKeyDown = jest.fn();
    const { findAllByAltText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            userProfile: { profile: testProfile },
            autodeposit: {
              autodepositState: {
                email: "",
                mode: "PENDING",
                accounts: [
                  {
                    value: "123456",
                    key: "dkjfguf3747574365346"
                  }
                ],
                rules: testAutodeposit.autodepositState.rules,
                autodepositRule: testAutodeposit.autodepositState.rules[1],
                error: { type: null }
              },
              updateAutodeposit: () => null,
              createAutodepositRule: () => null,
              handleOnChange: () => null,
              setAutoDepositRule,
              onKeyDown
            },
            editProfile: () => null
          }}
        >
          <RulesView />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    // find all 'span' buttons and test click on image calls delete
    const chevronAutodeposits = await findAllByAltText(
      `select-autodeposit-${testAutodeposit.autodepositState.rules[1].directDepositReferenceNumber}`
    );
    await act(async () => {
      fireEvent.click(chevronAutodeposits[0]);
    });
    expect(setAutoDepositRule).toHaveBeenCalled();

    await act(async () => {
      fireEvent.keyDown(chevronAutodeposits[0], {
        key: "Enter",
        code: 13,
        charCode: 13
      });
    });
    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe(">> test mobile view", () => {
  beforeEach(() => {
    actHook(() => {
      window.innerWidth = 320;
      window.innerHeight = 780;
      fireEvent(window, new Event("resize"));
    });
    DataStore.flush();
  });

  it("should verify active and pending rule", async () => {
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: autodepositRules,
        status: 200,
        method: "get"
      },
      {
        url: accountsURL,
        results: accounts,
        status: 200,
        method: "get"
      },
      {
        url: loggedinUserURL,
        results: loggedInUser,
        status: 200,
        method: "get"
      },
      {
        url: profileURL,
        results: interacProfile,
        status: 200,
        method: "get"
      }
    ]);
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter
          initialEntries={["/more/interac-preferences/autodeposit/view"]}
        >
          <MessageProvider>
            <ModalProvider>
              <InteracPrefProvider>
                <AutodepositForm />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText, findByText, getByAltText } = component;

    // click on active
    const activeRule = getByText("ACTIVE");
    await act(async () => {
      fireEvent.click(activeRule);
    });

    // in edit-rule page
    const editAutodepositHeader = await findByText("Edit Autodeposit");
    expect(editAutodepositHeader).toBeTruthy();
    let cancelButton = getByAltText("create-rule-cancel");
    act(() => {
      fireEvent.click(cancelButton);
    });

    // back in view page
    let registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();

    // click on pending
    const pendingRule = getByText("PENDING");
    await act(async () => {
      fireEvent.click(pendingRule);
    });

    // in pending page
    const pendingAutodepositHeader = await findByText("Autodeposit Pending");
    expect(pendingAutodepositHeader).toBeTruthy();
    cancelButton = getByAltText("create-rule-cancel");
    act(() => {
      fireEvent.click(cancelButton);
    });

    // back in view page
    registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
  });
});
