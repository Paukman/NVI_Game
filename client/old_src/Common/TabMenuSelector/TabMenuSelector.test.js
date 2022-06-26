import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import TabMenuSelector from "./TabMenuSelector";

let isRecurring;
const onClick = val => {
  isRecurring = val;
};

const props = {
  title: "Test Title",
  subTitle: "Test Sub-Title",
  id: "tabMenuSelectorTest",
  items: [
    {
      name: "Test One",
      class: "active"
    },
    {
      name: "Test two",
      class: "inactive"
    }
  ]
};

describe("Tab Menu Selector", () => {
  it(">> Should click and update state", () => {
    const { container } = render(
      <TabMenuSelector onClick={onClick} {...props} />
    );

    const tab = container.querySelector('[id$="-tab-menu-item-1"]');

    act(() => {
      fireEvent.click(tab);
    });

    expect(isRecurring).toEqual(1);
  });

  it(">> Should validate Headers", async () => {
    const { container } = render(
      <TabMenuSelector
        onClick={onClick}
        {...props}
        title="Title"
        subTitle="subTitle"
      />
    );
    await act(async () => {});
    const spanHeader = container.querySelector("#sidebar-tabs-title");
    const h3Header = container.querySelector("#sidebar-tabs-sub-title");

    expect(spanHeader.textContent).toEqual("Title");
    expect(h3Header.textContent).toEqual("subTitle");
  });
});
