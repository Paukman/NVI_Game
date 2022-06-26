import React from "react";
import { render } from "@testing-library/react";
import { InteracPreferencesContext } from "../InteracPrefProvider";
import EditProfile from "./EditProfile";
import { testProfile } from "../constants";
import ProfileTitle from "./ProfileTitle";

describe(">> InteracPreferencePage Edit Profile", () => {
  it(">> should render the profile data in the form ", async () => {
    const editProfile = () => {};
    const { getByText, getByLabelText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: testProfile
          },
          editProfile
        }}
      >
        <EditProfile handleCancel={() => ""} profileTitle={<ProfileTitle />} />
      </InteracPreferencesContext.Provider>
    );
    const nameField = getByLabelText("Name");
    expect(nameField.value).toEqual(testProfile.editProfile.name);
    const emailField = getByLabelText("Email");
    expect(emailField.value).toEqual(testProfile.editProfile.email);
    expect(getByText("Save")).toBeTruthy();
  });
  it(">> should show validation errors ", async () => {
    const editProfile = () => {};
    const { getByText, getByLabelText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: testProfile
          },
          editProfile
        }}
      >
        <EditProfile handleCancel={() => ""} profileTitle={<ProfileTitle />} />
      </InteracPreferencesContext.Provider>
    );
    await act(async () => {
      fireEvent.change(getByLabelText("Email"), {
        target: { name: "email", value: "not_valid_email" }
      });
    });

    await act(async () => {
      fireEvent.change(getByLabelText("Name"), {
        target: { name: "name", value: "$%###$m" }
      });
    });

    const saveButton = getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(getByText("Enter a valid email address.")).toBeTruthy();
    expect(
      getByText("Enter your name (special characters not supported).")
    ).toBeTruthy();
  });
  it(">> should call onSubmitCreate even when operational systems add a period once the user hits twice the space bar ", async () => {
    const onSubmitCreate = jest.fn();
    const { getByText, getByLabelText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: testProfile,
            onSubmitCreate
          }
        }}
      >
        <EditProfile
          edit={false}
          handleCancel={() => ""}
          profileTitle={<ProfileTitle />}
        />
      </InteracPreferencesContext.Provider>
    );
    const email = getByLabelText("Email");
    await act(async () => {
      fireEvent.blur(email, {
        target: { value: `${testProfile.email} .   ` }
      });
    });
    expect(email.value).toBe(testProfile.email);
    const saveButton = getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });
    expect(onSubmitCreate).toHaveBeenCalledTimes(1);
    await act(async () => {
      fireEvent.keyDown(email, {
        key: "Enter",
        target: { value: `${testProfile.email} .   ` }
      });
    });
    expect(email.value).toBe(testProfile.email);
    await act(async () => {
      fireEvent.click(saveButton);
    });
    expect(onSubmitCreate).toHaveBeenCalledTimes(2);
  });
  it(">> should call onSubmitCreate ", async () => {
    const onSubmitCreate = jest.fn();
    const { getByText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: testProfile,
            onSubmitCreate
          }
        }}
      >
        <EditProfile
          edit={false}
          handleCancel={() => ""}
          profileTitle={<ProfileTitle />}
        />
      </InteracPreferencesContext.Provider>
    );
    const saveButton = getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });
    expect(onSubmitCreate).toHaveBeenCalledTimes(1);
  });
  it(">> should call onSubmitUpdate ", async () => {
    const onSubmitUpdate = jest.fn();
    const { getByText } = render(
      <InteracPreferencesContext.Provider
        value={{
          userProfile: {
            profileState: testProfile,
            onSubmitUpdate
          }
        }}
      >
        <EditProfile
          handleCancel={() => ""}
          profileTitle={<ProfileTitle />}
          edit
        />
      </InteracPreferencesContext.Provider>
    );
    const saveButton = getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });
    expect(onSubmitUpdate).toHaveBeenCalledTimes(1);
  });
});
