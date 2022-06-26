import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import profileIcon from "assets/icons/Person/person.svg";
import autodepositIcon from "assets/icons/Assets/assets.svg";
import UrlTabSelector from "./UrlTabSelector";

describe("Testing UrlTabSelector", () => {
  const items = [
    {
      url: "/more/interac-preferences/profile/view-profile",
      class: "active",
      name: "Profile",
      icon: profileIcon
    },
    {
      url: "/more/interac-preferences/autodeposit/view",
      class: "inactive",
      name: "Autodeposit",
      icon: autodepositIcon
    }
  ];
  it(">> should verify verbage on passed in props", async () => {
    const onClick = jest.fn();
    const { findByText } = render(
      <RenderWithProviders location="/more/interac-preferences/profile/view-profile">
        <UrlTabSelector
          title="Test Title"
          subTitle="Test Sub-Title"
          onClick={onClick}
          items={items}
        />
      </RenderWithProviders>
    );

    const firstItem = await findByText("Profile");
    expect(firstItem).toBeTruthy();
    expect(
      firstItem.parentElement.parentElement.classList.contains("active")
    ).toBeTruthy();
    const secondItem = await findByText("Autodeposit");
    expect(secondItem).toBeTruthy();
    expect(
      secondItem.parentElement.parentElement.classList.contains("active")
    ).toBeFalsy();

    await act(async () => {
      fireEvent.click(secondItem);
    });

    expect(onClick).toBeCalled();
  });
});
