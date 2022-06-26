import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import DataStore from "utils/store";
import { MemoryRouter } from "react-router-dom";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import InteracPrefProvider from "./InteracPrefProvider";
import InteracPreferencePage from "./InteracPreferencesPage";
import {
  dataWithProfile,
  dataWithNoProfile,
  testInteracProfileUser,
  autodepositRules,
  accounts,
  accountsURL,
  profileURL,
  interacProfile
} from "./constants";
import { autoDepositconfig } from "./hooks/constants";

describe("Testing Bill Payment starting page", () => {
  afterEach(() => {
    DataStore.flush();
  });
  beforeEach(() => {
    windowMatchMediaMock();

    DataStore.flush();
  });

  it(">> should show profile page and edit page when there is profile", async () => {
    mockApiData([
      {
        url: profileURL,
        results: dataWithProfile
      }
    ]);
    const { findByText, getByLabelText } = render(
      <MemoryRouter
        initialEntries={["/more/interac-preferences/profile/view-profile"]}
      >
        <MessageProvider>
          <ModalProvider>
            <InteracPrefProvider
              value={{
                userProfile: {
                  profileState: testInteracProfileUser
                }
              }}
            >
              <InteracPreferencePage />
            </InteracPrefProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    const profileText = await findByText(/Your profile lets/);
    expect(profileText).toBeTruthy();
    const editButton = getByLabelText("Edit interac profile");
    await act(async () => {
      fireEvent.click(editButton);
    });

    const editProfileHeader = await findByText("Edit profile");
    expect(editProfileHeader).toBeTruthy();
  });
  it(">> should show profile page and create page when there is profile", async () => {
    mockApiData([
      {
        url: profileURL,
        results: dataWithNoProfile
      }
    ]);
    const { findByText } = render(
      <MemoryRouter
        initialEntries={["/more/interac-preferences/profile/view-profile"]}
      >
        <MessageProvider>
          <ModalProvider>
            <InteracPrefProvider>
              <InteracPreferencePage />
            </InteracPrefProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    const createProfileButton = await findByText("Create profile");
    expect(createProfileButton).toBeTruthy();

    await act(async () => {
      fireEvent.click(createProfileButton);
    });

    const editProfileHeader = await findByText("Create profile");
    expect(editProfileHeader).toBeTruthy();
  });
  it(">> should show no profile popup if profile is not available and access autodeposit page", async () => {
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
          url: profileURL,
          results: null,
          status: 204,
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
                <InteracPreferencePage />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText, findByText, getByLabelText, findByAltText } = component;

    const autodepositTab = await findByAltText("assets.svg");
    expect(autodepositTab).toBeTruthy();
    await act(async () => {
      fireEvent.click(autodepositTab);
    });

    const noProfileText = await findByText(
      /profile in order to send or receive funds by /
    );
    expect(noProfileText).toBeTruthy();
    const createProfileButton = getByText("Create profile", { exact: true });
    expect(createProfileButton).toBeTruthy();
    await act(async () => {
      fireEvent.click(createProfileButton);
    });
    const createProfileHeader = await findByText("Create profile");
    expect(createProfileHeader).toBeTruthy();
    expect(getByLabelText("Name")).toBeTruthy();
    expect(getByLabelText("Email")).toBeTruthy();
  });
});

describe("Testing interac preference matching", () => {
  it(">> should stay on the same page if profile tab clicked", async () => {
    const mockCalls = () => {
      DataStore.flush();
      mockApiData([
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
          initialEntries={["/more/interac-preferences/profile/view-profile"]}
        >
          <MessageProvider>
            <ModalProvider>
              <InteracPrefProvider>
                <InteracPreferencePage />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText, findByText, findByAltText } = component;

    let profileText = await findByText(/Your profile lets/);
    expect(profileText).toBeTruthy();
    expect(getByText("Different Random Email")).toBeTruthy();
    expect(getByText("different.random.email@random.email.com")).toBeTruthy();

    const profileTab = await findByAltText("person.svg");
    expect(profileTab).toBeTruthy();
    await act(async () => {
      fireEvent.click(profileTab);
    });

    profileText = await findByText(/Your profile lets/);
    expect(profileText).toBeTruthy();
    expect(getByText("Different Random Email")).toBeTruthy();
    expect(getByText("different.random.email@random.email.com")).toBeTruthy();
  });
});
