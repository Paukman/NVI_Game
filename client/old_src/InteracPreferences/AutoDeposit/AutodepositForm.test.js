import React from "react";
import { render, fireEvent, findAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  mockApiData,
  renderWithRouter,
  windowMatchMediaMock
} from "utils/TestUtils";
import { accountsBaseUrl } from "api";
import DataStore from "utils/store";
import ModalProvider from "Common/ModalProvider";
// import MessageProvider from "Common/MessageProvider";
import { MessageProvider } from "StyleGuide/Components";
import InteracPrefProvider, {
  InteracPreferencesContext
} from "../InteracPrefProvider";
import AutodepositForm from "./AutodepositForm";
import {
  testInteracProfileUser,
  testInteracProfileLoadingUser,
  testInteracProfileNull,
  testAutodeposit,
  BASE_PATH_AUTODEPOSIT,
  loggedInUser,
  autodepositRules,
  accounts,
  interacProfile
} from "../constants";
import { autoDepositconfig } from "../hooks/constants";

const accountsURL = `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferAutoDeposit`;
const loggedinUserURL = `${accountsBaseUrl}/accountHolderName`;
const profileURL = "/api/atb-rebank-api-etransfers/profile";

describe(">> InteracPreferencePage AutodepositForm Component", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  it(">> should render the AutodepositForm page with enabled profile . should render no rules", async () => {
    const editProfile = () => {};
    const { getByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: { profileState: testInteracProfileUser },
          autodeposit: {
            autodepositState: testAutodeposit.autodepositState,
            updateAutodeposit: () => {},
            createAutodepositRule: () => {},
            handleOnChange: () => {},
            handleRegister: () => {}
          },
          editProfile
        }}
      >
        <AutodepositForm />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_AUTODEPOSIT}/view`
      }
    );
    expect(getByText("Register another email", { exact: true })).toBeDefined();
  });

  it(">> should render the AutodepositForm page null when loading", async () => {
    const editProfile = () => {};
    const { queryByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: { profileState: testInteracProfileLoadingUser },
          autodeposit: {
            autodepositState: testAutodeposit.autodepositState,
            updateAutodeposit: () => {},
            createAutodepositRule: () => {},
            handleOnChange: () => {},
            handleRegister: () => {}
          },
          editProfile
        }}
      >
        <AutodepositForm />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_AUTODEPOSIT}/view`
      }
    );
    expect(queryByText("Register")).toBeNull();
  });

  it(">> should render the AutodepositForm page null has rules", async () => {
    const editProfile = () => {};
    const { queryByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: { profileState: testInteracProfileNull },
          autodeposit: {
            autodepositState: testAutodeposit.autodepositState,
            updateAutodeposit: () => {},
            createAutodepositRule: () => {},
            handleOnChange: () => {},
            handleRegister: () => {}
          },
          editProfile
        }}
      >
        <AutodepositForm />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_AUTODEPOSIT}/view`
      }
    );
    expect(queryByText("Register")).toBeNull();
  });

  it(">> should render the AutodepositForm page with no rules registered when no rules in state", async () => {
    const editProfile = () => {};
    const { queryByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: { profileState: testInteracProfileNull },
          autodeposit: {
            autodepositState: {
              email: "",
              accounts: [],
              rules: [],
              mode: "",
              error: { type: null }
            },
            updateAutodeposit: () => null,
            handleOnChange: () => null,
            handleRegister: () => null
          },
          editProfile
        }}
      >
        <AutodepositForm />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_AUTODEPOSIT}/no-rules`
      }
    );
    expect(queryByText("Register")).toBeTruthy();
  });
});

describe("autodeposit full test", () => {
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
  it(">> should show auto deposit rules in the table", async () => {
    mockCalls();
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
    const { getByText } = component;
    expect(getByText("Autodeposit")).toBeDefined();
    expect(getByText(/cozncm/)).toBeDefined();
    expect(getByText(/faketestin/)).toBeDefined();
  });
  it(">> should delete the rule from the view page", async () => {
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
    const { getByText, getByAltText, queryByText } = component;
    expect(getByText("Autodeposit")).toBeDefined();
    expect(getByText(/cozncm/)).toBeDefined();
    expect(getByText(/faketestin/)).toBeDefined();
    const ruleAltText = `delete-autodeposit-${autodepositRules[0].directDepositReferenceNumber}`;
    const rule = getByAltText(ruleAltText);
    expect(rule).toBeDefined();
    await act(async () => {
      fireEvent.click(rule);
    });
    expect(getByText("Delete email")).toBeDefined();
    expect(getByText(/Cancel/)).toBeDefined();

    await act(async () => {
      fireEvent.click(getByText(/Cancel/));
    });
    expect(queryByText("Delete email")).toBeNull();
    await act(async () => {
      fireEvent.click(rule);
    });
    await act(async () => {
      fireEvent.click(getByText("Delete email"));
    });
    expect(queryByText("Delete email")).toBeNull();
  });
  it(">> should register a new rule successfully ", async () => {
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
    const { getByText, queryByText, getByLabelText, getByTestId } = component;
    await act(async () => {
      fireEvent.click(getByText("Register another email"));
    });
    const accountsDropdown = getByTestId("register-rule-account");
    expect(accountsDropdown.children[1].textContent).toBe("Select account");
    const accountOptions = await findAllByRole(accountsDropdown, "option");
    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accountsDropdown.children[1].textContent).toBe(
      "Basic Account (6679)"
    );
    await act(async () => {
      fireEvent.change(getByLabelText("Email"), {
        target: { name: "email", value: "some@email.com" }
      });
    });
    expect(getByLabelText("Email").value).toEqual("some@email.com");
    await act(async () => {
      fireEvent.click(getByText("Save"));
    });
    expect(getByText("Almost done!")).toBeTruthy();
    await act(async () => {
      fireEvent.click(getByText("OK"));
    });
    expect(queryByText("Almost done!")).toBeNull();
  });
  it(">> should go to edit page and delete the rule successfully", async () => {
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
    const { getByText, findByText, queryByText, getByAltText } = component;

    const ruleAltText = `select-autodeposit-${autodepositRules[0].directDepositReferenceNumber}`;
    const rule = getByAltText(ruleAltText);
    expect(rule).toBeDefined();
    await act(async () => {
      fireEvent.click(rule);
    });

    await act(async () => {
      fireEvent.click(getByText("Delete"));
    });
    expect(getByText("Delete email?")).toBeTruthy();
    await act(async () => {
      fireEvent.click(getByText("Cancel"));
    });

    expect(queryByText("Delete email?")).toBeNull();
    await act(async () => {
      fireEvent.click(getByText("Delete"));
    });
    await act(async () => {
      fireEvent.click(getByText("Delete email"));
    });
    const registerAnotherEmail = await findByText("Register another email");
    expect(registerAnotherEmail).toBeTruthy();
  });
  it(">> should go to edit page, change info and update the rule successfully", async () => {
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
    const { getByText, getByTestId } = component;
    await act(async () => {
      fireEvent.click(getByText("ACTIVE"));
    });
    const accountsDropdown = getByTestId("register-rule-account");
    const accountOptions = await findAllByRole(accountsDropdown, "option");
    await act(async () => {
      fireEvent.click(accountOptions[1]);
    });
    expect(accountsDropdown.children[1].textContent).toBe(
      "Basic Another Account (6680)"
    );
    await act(async () => {
      fireEvent.click(getByText("Save"));
    });
    expect(
      getByText(/You've successfully updated your Autodeposit profile/)
    ).toBeTruthy();
  });
  it(">> should show register page when no autodeposit rules", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: [],
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
      return component;
    });
    const { getByText } = component;
    await act(async () => {
      fireEvent.click(getByText("Register"));
    });
    expect(getByText("Register for Autodeposit")).toBeTruthy();
  });
});
describe("Autodeposit sad path", () => {
  it(">> should fail on delete rule", async () => {
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
      },
      {
        url: `${autoDepositconfig.url}${autodepositRules[0].directDepositReferenceNumber}`,
        results: [],
        method: "DELETE",
        error: "ServerError"
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
    const { getByText, getByAltText, queryByText } = component;
    expect(getByText("Autodeposit")).toBeDefined();
    const ruleAltText = `delete-autodeposit-${autodepositRules[0].directDepositReferenceNumber}`;
    const rule = getByAltText(ruleAltText);
    expect(rule).toBeDefined();
    await act(async () => {
      fireEvent.click(rule);
    });
    expect(getByText("Delete email")).toBeDefined();
    expect(getByText(/Cancel/)).toBeDefined();

    await act(async () => {
      fireEvent.click(getByText(/Cancel/));
    });
    expect(queryByText("Delete email")).toBeNull();
    await act(async () => {
      fireEvent.click(rule);
    });
    await act(async () => {
      fireEvent.click(getByText("Delete email"));
    });
    expect(queryByText("Delete email")).toBeNull();
    expect(getByText("System Error")).toBeDefined();
    await act(async () => {
      fireEvent.click(getByText("OK"));
    });
    expect(queryByText("System Error")).toBeNull();
  });
  it(">> should fail on create rule", async () => {
    DataStore.flush();
    mockApiData([
      {
        url: autoDepositconfig.url,
        results: autodepositRules,
        status: 400,
        method: "POST",
        error: "ServerError"
      },
      {
        url: autoDepositconfig.url,
        results: [],
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
      return component;
    });
    const { getByText, getByLabelText, queryByText, getByTestId } = component;
    await act(async () => {
      fireEvent.click(getByText("Register"));
    });
    expect(getByText("Register for Autodeposit")).toBeTruthy();
    const accountsDropdown = getByTestId("register-rule-account");
    expect(accountsDropdown.children[1].textContent).toBe("Select account");
    const accountOptions = await findAllByRole(accountsDropdown, "option");
    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accountsDropdown.children[1].textContent).toBe(
      "Basic Account (6679)"
    );
    await act(async () => {
      fireEvent.change(getByLabelText("Email"), {
        target: { name: "email", value: "some@email.com" }
      });
    });
    expect(getByLabelText("Email").value).toEqual("some@email.com");
    await act(async () => {
      fireEvent.click(getByText("Save"));
    });
    expect(getByText("System Error")).toBeTruthy();
    await act(async () => {
      fireEvent.click(getByText("OK"));
    });
    expect(queryByText("System Error")).toBeNull();
  });
});

describe("Testing autodeposit routing", () => {
  it(">> should land on no-rules page if rules are not available", async () => {
    const mockCalls = () => {
      DataStore.flush();
      mockApiData([
        {
          url: autoDepositconfig.url,
          results: null,
          status: 204,
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
    const { getByText } = component;
    const noRulesText = getByText(
      /e-Transfer feature that allows you to have funds deposited directly/
    );
    expect(noRulesText).toBeTruthy();
  });
});
