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
import EditRule from "./EditRule";
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

describe(">> Testing EditRule", () => {
  afterEach(() => {
    DataStore.flush();
  });

  it(">> should navigate to edit-rules and cancel", async () => {
    const mockCalls = () => {
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
      return component;
    });
    const { getByText, findByText, getByAltText } = component;
    const activeRule = getByText("ACTIVE");
    await act(async () => {
      fireEvent.click(activeRule);
    });

    // in edit-rule page
    const editAutodepositHeader = await findByText("Edit Autodeposit");
    expect(editAutodepositHeader).toBeTruthy();
    const cancelButton = getByAltText("create-rule-cancel");
    act(() => {
      fireEvent.click(cancelButton);
    });

    // back in view page
    const registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
  });

  it(">> should present modal for missing legal name", async () => {
    const mockCalls = () => {
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
      return component;
    });
    const { getByText, findByText } = component;
    const activeRule = getByText("ACTIVE");
    await act(async () => {
      fireEvent.click(activeRule);
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
    const registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
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
          <EditRule />
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

  it(">> should delete rule", async () => {
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
      },
      {
        url: `${autoDepositconfig.url}${autodepositRules[0].directDepositReferenceNumber}`,
        results: "done",
        status: 200,
        method: "DELETE"
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
      return component;
    });
    const { getByText, findByText } = component;

    const activeRule = getByText("ACTIVE");
    await act(async () => {
      fireEvent.click(activeRule);
    });

    // in edit-rule page
    const deleteButton = await findByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // delete modal
    const deleteEmailButton = await findByText("Delete email");
    await act(async () => {
      fireEvent.click(deleteEmailButton);
    });

    // back in view page
    const registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
  });
});
