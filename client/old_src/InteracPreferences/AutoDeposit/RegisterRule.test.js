import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockApiData, RenderWithProviders } from "utils/TestUtils";
import DataStore from "utils/store";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import InteracPrefProvider, {
  InteracPreferencesContext
} from "../InteracPrefProvider";
import AutodepositForm from "./AutodepositForm";
import {
  loggedInUser,
  autodepositRules,
  accounts,
  interacProfile,
  accountsURL,
  loggedinUserURL,
  profileURL,
  testAutodeposit
} from "../constants";
import { autoDepositconfig } from "../hooks/constants";
import RegisterRule from "./RegisterRule";

describe(">> Testing RegisterRule", () => {
  it(">> should navigate to register-rule and cancel", async () => {
    const mockCalls = () => {
      DataStore.flush();
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
    };
    let component;
    mockCalls();
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
    const { findByText, getByAltText } = component;
    let registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
    await act(async () => {
      fireEvent.click(registerAnotherEmail);
    });

    // in register-rule page
    const editAutodepositHeader = await findByText("Register for Autodeposit");
    expect(editAutodepositHeader).toBeTruthy();
    const cancelButton = getByAltText("create-rule-cancel");
    act(() => {
      fireEvent.click(cancelButton);
    });

    // back in view page
    registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
  });
  it(">> should present modal for missing legal name", async () => {
    const mockCalls = () => {
      DataStore.flush();
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
          results: null,
          status: 204,
          method: "get"
        },
        {
          url: profileURL,
          results: interacProfile,
          status: 200,
          method: "get"
        }
      ]);
    };
    let component;
    mockCalls();
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
    const { getByText, findByText } = component;

    let registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
    await act(async () => {
      fireEvent.click(registerAnotherEmail);
    });

    const legalNameText = await findByText(
      /For security purposes relating to the processing of Autodeposits/
    );
    expect(legalNameText).toBeTruthy();
    const okButton = getByText("OK");
    await act(async () => {
      fireEvent.click(okButton);
    });

    // back in view page
    registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
  });
  it(">> should show validation errors", async () => {
    DataStore.flush();
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
    const { getByText, findByText, queryByText } = component;

    const registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
    await act(async () => {
      fireEvent.click(registerAnotherEmail);
    });

    // in register-rule page
    const saveButton = await findByText("Save");

    expect(queryByText("Enter an email.")).toBeNull();
    expect(queryByText("Select an account.")).toBeNull();

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(getByText("Enter an email.")).toBeTruthy();
    expect(getByText("Select an account.")).toBeTruthy();
  });
  it(">> should accept email when operational system adds period once the user hits space twice", async () => {
    DataStore.flush();
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
    const { getByLabelText, findByText, queryByText, getByText } = component;

    const registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeVisible();
    await act(async () => {
      fireEvent.click(registerAnotherEmail);
    });

    const fakeEmail1 = "someone1@atb.com";
    const fakeEmail2 = "someone2@atb.com";

    const saveButton = await findByText("Save");
    const email = getByLabelText("Email");

    await act(async () => {
      fireEvent.blur(email, {
        target: { value: `${fakeEmail1}. ` }
      });
      fireEvent.click(saveButton);
    });
    expect(queryByText("Enter an email.")).toBeNull();
    expect(email.value).toBe(fakeEmail1);
    expect(getByText("Select an account.")).toBeVisible();

    await act(async () => {
      fireEvent.keyDown(email, {
        key: "Enter",
        target: { value: `${fakeEmail2}  .   ` }
      });
      fireEvent.click(saveButton);
    });
    expect(queryByText("Enter an email.")).toBeNull();
    expect(email.value).toBe(fakeEmail2);
    expect(getByText("Select an account.")).toBeVisible();
  });

  it(">> should include legal name of account holder in Autodeposit message that appears at bottom of page", async () => {
    const { findByText } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <InteracPreferencesContext.Provider
          value={{
            legalName: "James Herbert Bond",
            autodeposit: {
              autodepositState: {
                accounts: testAutodeposit.autodepositState.accounts,
                formattedAccountOptions:
                  testAutodeposit.autodepositState.formattedAccountOptions,
                account:
                  testAutodeposit.autodepositState.formattedAccountOptions[0]
                    .value,
                autodepositRule: testAutodeposit.autodepositState.rules[0],
                error: { type: null }
              }
            }
          }}
        >
          <RegisterRule />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );

    // in edit-rule page
    const autodepositMessageContainingLegalName = await findByText(
      /When someone sends you funds by/
    );
    expect(autodepositMessageContainingLegalName).toHaveTextContent(
      "James Herbert Bond"
    );
  });
});
