import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithRouter, windowMatchMediaMock } from "utils/TestUtils";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import InteracPrefProvider, {
  InteracPreferencesContext
} from "../InteracPrefProvider";
import Profile from "./Profile";
import {
  testProfile,
  testInteracProfileLoadingUser,
  BASE_PATH_PROFILE
} from "../constants";

describe(">> InteracPreferencePage Profile Component", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render the userprofile page null when loading", async () => {
    const editProfile = () => {};
    const { queryByText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: { profileState: testInteracProfileLoadingUser },
          autodeposit: {},
          editProfile
        }}
      >
        <Profile hideSidebar={jest.fn()} />
      </InteracPreferencesContext.Provider>
    );
    expect(queryByText("Create profile")).toBeNull();
  });
  it(">> should render the profile with no profile unabled ", async () => {
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter
          initialEntries={["/more/interac-preferences/profile/view-profile"]}
        >
          <MessageProvider>
            <ModalProvider>
              <InteracPrefProvider
                value={{
                  userProfile: {
                    profileState: testProfile
                  },
                  autodeposit: {}
                }}
              >
                <Profile hideSidebar={jest.fn()} />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });

    const { getByText } = component;
    expect(getByText("Create profile", { exact: true })).toBeDefined();
  });
  it(">> should render the profile page with enabled profile, should render view profile", async () => {
    const editProfile = () => {};
    const enabledProfile = { ...testProfile, enabled: true };
    const { getByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{ userProfile: { profileState: enabledProfile }, editProfile }}
      >
        <Profile hideSidebar={jest.fn()} />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_PROFILE}/view-profile`
      }
    );
    expect(getByText("charlie brown")).toBeTruthy();
    expect(getByText("charlie_brown@gmail.com")).toBeTruthy();
    expect(getByText("Edit")).toBeTruthy();
  });
  it(">> should go from view profile to edit profile ", async () => {
    const enabledProfile = { ...testProfile, enabled: true };
    const { getByText, getByLabelText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: enabledProfile,
            handleOnChange: () => {},
            cancelEdit: () => {},
            cancelCreate: () => {},
            onSubmit: () => {}
          },
          autodeposit: {}
        }}
      >
        <Profile hideSidebar={jest.fn()} />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_PROFILE}/view-profile`
      }
    );
    expect(getByText("charlie brown")).toBeTruthy();
    expect(getByText("charlie_brown@gmail.com")).toBeTruthy();
    const editBtn = getByText("Edit");
    fireEvent.click(editBtn);
    // click on edit and go to edit page
    const nameField = getByLabelText("Name");
    expect(nameField.value).toEqual(testProfile.editProfile.name);
    const emailField = getByLabelText("Email");
    expect(emailField.value).toEqual(testProfile.editProfile.email);
    expect(getByText("Save")).toBeTruthy();
  });
  it(">> cancel should be called when click on close btn on edit ", async () => {
    const enabledProfile = { ...testProfile, enabled: true };
    const cancelEdit = jest.fn();
    const { getByText, findByAltText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: enabledProfile,
            handleOnChange: () => {},
            cancelEdit,
            cancelCreate: () => {},
            onSubmit: () => {}
          },
          autodeposit: {}
        }}
      >
        <Profile hideSidebar={jest.fn()} />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_PROFILE}/view-profile`
      }
    );
    expect(getByText("charlie brown")).toBeTruthy();
    expect(getByText("charlie_brown@gmail.com")).toBeTruthy();
    const editBtn = getByText("Edit");
    fireEvent.click(editBtn);
    const cancelBtn = await findByAltText("edit-profile-cancel");
    fireEvent.click(cancelBtn);
    // expect(cancelEdit).toHaveBeenCalled();
  });
  it(">> should render the profile page with unabled profile . should render view profile", async () => {
    const editProfile = () => {};
    const enabledProfile = { ...testProfile, enabled: true };
    const { getByText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{ userProfile: { profileState: enabledProfile }, editProfile }}
      >
        <Profile hideSidebar={jest.fn()} />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_PROFILE}/view-profile`
      }
    );
    expect(getByText("charlie brown")).toBeTruthy();
    expect(getByText("charlie_brown@gmail.com")).toBeTruthy();
    expect(getByText("Edit")).toBeTruthy();
  });
  it(">> should go from view profile to edit profile ", async () => {
    const enabledProfile = { ...testProfile, enabled: true };
    const { getByText, getByLabelText } = renderWithRouter(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: enabledProfile,
            handleOnChange: () => {},
            cancelEdit: () => {},
            cancelCreate: () => {},
            onSubmit: () => {}
          },
          autodeposit: {}
        }}
      >
        <Profile hideSidebar={jest.fn()} />
      </InteracPreferencesContext.Provider>,
      {
        route: `${BASE_PATH_PROFILE}/view-profile`
      }
    );
    expect(getByText("charlie brown")).toBeTruthy();
    expect(getByText("charlie_brown@gmail.com")).toBeTruthy();
    const editBtn = getByText("Edit");
    fireEvent.click(editBtn);
    // click on edit and go to edit page
    const nameField = getByLabelText("Name");
    expect(nameField.value).toEqual(testProfile.editProfile.name);
    const emailField = getByLabelText("Email");
    expect(emailField.value).toEqual(testProfile.editProfile.email);
    expect(getByText("Save")).toBeTruthy();
  });
  it(">> cancel should be called when click on close btn on create ", async () => {
    const enabledProfile = { ...testProfile, enabled: false };
    const cancelCreate = jest.fn();
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter
          initialEntries={["/more/interac-preferences/profile/view-profile"]}
        >
          <MessageProvider>
            <ModalProvider>
              <InteracPrefProvider
                value={{
                  userProfile: {
                    profileState: enabledProfile,
                    handleOnChange: () => {},
                    cancelEdit: () => {},
                    cancelCreate,
                    onSubmit: () => {}
                  },
                  autodeposit: {}
                }}
              >
                <Profile hideSidebar={jest.fn()} />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText, findByAltText } = component;
    const createBtn = getByText("Create profile");
    fireEvent.click(createBtn);
    const cancelBtn = await findByAltText("edit-profile-cancel");
    fireEvent.click(cancelBtn);
    // expect(cancelCreate).toHaveBeenCalled();
  });
  it(">> render no profile", async () => {
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter
          initialEntries={["/more/interac-preferences/profile/view-profile"]}
        >
          <MessageProvider>
            <ModalProvider>
              <InteracPrefProvider
                value={{
                  userProfile: {
                    profileState: {
                      loading: false,
                      enabled: false,
                      dataLoaded: true,
                      editProfile: {},
                      error: { type: null }
                    },
                    handleOnChange: () => {},
                    cancelEdit: () => {},
                    cancelCreate: () => {},
                    onSubmit: () => {}
                  },
                  autodeposit: {}
                }}
              >
                <Profile hideSidebar={jest.fn()} />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText } = component;
    const createProfile = getByText("Create profile");
    expect(createProfile).toBeTruthy();
  });
  it(">> render edit component", async () => {
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter
          initialEntries={["/more/interac-preferences/profile/view-profile"]}
        >
          <MessageProvider>
            <ModalProvider>
              <InteracPrefProvider
                value={{
                  userProfile: {
                    profileState: {
                      loading: false,
                      enabled: false,
                      editProfile: {
                        name: "",
                        email: ""
                      }
                    },
                    handleOnChange: () => {},
                    cancelEdit: () => {},
                    cancelCreate: () => {},
                    onSubmit: () => {}
                  },
                  autodeposit: {}
                }}
              >
                <Profile hideSidebar={jest.fn()} />
              </InteracPrefProvider>
            </ModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText } = component;
    const createBtn = getByText("Create profile");
    fireEvent.click(createBtn);
    const saveBtn = getByText("Save");
    expect(saveBtn).toBeTruthy();
  });
});
