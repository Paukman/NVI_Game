import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { renderWithRouter } from "utils/TestUtils";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import NoRulesRegistered from "./NoRulesRegistered";
import { testProfile, BASE_PATH_AUTODEPOSIT } from "../constants";

describe(">> InteracPreferencePage Interac profile but no rules", () => {
  it(">> should show not registered page ", async () => {
    const editProfile = () => {};
    const { getByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: { profile: testProfile },
          autodeposit: {
            autodepositState: {
              email: "",
              accounts: [],
              error: { type: null }
            },
            updateAutodeposit: () => null,
            createAutodepositRule: () => null,
            handleOnChange: () => null,
            handleRegister: () => null
          },
          editProfile
        }}
      >
        <NoRulesRegistered />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_AUTODEPOSIT}/register-rule`
      }
    );
    expect(getByText("Register")).toBeTruthy();
  });
  it(">> should call handleRegister on Register button click", async () => {
    const handleRegister = jest.fn();
    const { getByText } = renderWithRouter(
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
            handleRegister
          },
          editProfile: () => null
        }}
      >
        <NoRulesRegistered />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_AUTODEPOSIT}/register-rule`
      }
    );
    const registerButton = getByText("Register");
    await act(async () => {
      fireEvent.click(registerButton);
    });
    expect(handleRegister).toHaveBeenCalled();
  });
});
