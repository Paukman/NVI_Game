import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import PendingAutodeposit from "./PendingAutodeposit";
import { testAutodeposit } from "../constants";

describe(">> Pending Autodeposit", () => {
  it(">> should show pending auto deposit page ", async () => {
    const component = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: testAutodeposit.autodepositState.accounts,
                rules: testAutodeposit.autodepositState.rules,
                autodepositRule: testAutodeposit.autodepositState.rules[0],
                mode: "PENDING",
                error: { type: null }
              },
              createAutodepositRule: () => null,
              updateAutoDepositRule: () => null,
              deleteAutoDepositRule: () => null,
              setAutoDepositRule: () => null,
              onAutodepositChange: () => null,
              handleRegister: () => null,
              clearForm: () => null
            }
          }}
        >
          <PendingAutodeposit />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    const { getByText } = component;
    expect(getByText("Autodeposit Pending")).toBeTruthy();
  });

  it(">> should call deleteAutoDepositRule on click of delete button", async () => {
    const deleteAutoDepositRule = jest.fn();
    const component = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: testAutodeposit.autodepositState.accounts,
                rules: testAutodeposit.autodepositState.rules,
                autodepositRule: testAutodeposit.autodepositState.rules[0],
                mode: "PENDING",
                error: { type: null }
              },
              createAutodepositRule: () => null,
              updateAutoDepositRule: () => null,
              deleteAutoDepositRule,
              setAutoDepositRule: () => null,
              onAutodepositChange: () => null,
              handleRegister: () => null,
              clearForm: () => null
            }
          }}
        >
          <PendingAutodeposit />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    const { getByText } = component;

    const deleteButton = getByText("Delete", { exact: true });
    await act(async () => {
      fireEvent.click(deleteButton);
    });
    expect(deleteAutoDepositRule).toHaveBeenCalled();
  });
  it(">> should call clearForm on click of cross icon", async () => {
    const clearForm = jest.fn();
    const component = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            autodeposit: {
              autodepositState: {
                email: "",
                accounts: testAutodeposit.autodepositState.accounts,
                rules: testAutodeposit.autodepositState.rules,
                autodepositRule: testAutodeposit.autodepositState.rules[0],
                mode: "PENDING",
                error: { type: null }
              },
              createAutodepositRule: () => null,
              updateAutoDepositRule: () => null,
              deleteAutoDepositRule: () => null,
              setAutoDepositRule: () => null,
              onAutodepositChange: () => null,
              handleRegister: () => null,
              clearForm
            }
          }}
        >
          <PendingAutodeposit />
        </InteracPreferencesContext.Provider>
      </RenderWithProviders>
    );
    const { getByAltText } = component;

    const cancelButton = getByAltText("create-rule-cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    expect(clearForm).toHaveBeenCalled();
  });

  it(">> should include legal name of account holder in Autodeposit message that appears at bottom of page", async () => {
    const { findByText } = render(
      <RenderWithProviders location="/">
        <InteracPreferencesContext.Provider
          value={{
            legalName: "James Herbert Bond",
            autodeposit: {
              autodepositState: {
                autodepositRule: testAutodeposit.autodepositState.rules[0],
                error: { type: null }
              }
            }
          }}
        >
          <PendingAutodeposit />
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
