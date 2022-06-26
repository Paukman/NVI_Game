import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import { AddPayeeContext } from "./AddPayeeProvider";
import AddEditPayeeForm from "./AddEditPayeeForm";

describe(">> AddEditPayeeForm", () => {
  it(">> renders payee name error when there is no payee name", async () => {
    const { getByRole, getByText, queryByText } = render(
      <RenderWithProviders location="/">
        <AddPayeeContext.Provider
          value={{
            addPayeeState: {
              approvedCreditors: [1, 2, 3],
              payeeName: "",
              selectedPayee: "",
              account: "",
              nickname: "",
              searchResults: [],
              disabled: true,
              errors: {}
            },
            onInputChange: () => null
          }}
          handleModal={() => null}
        >
          <AddEditPayeeForm />
        </AddPayeeContext.Provider>
      </RenderWithProviders>
    );
    const addPayeeButton = await getByRole("button", { name: "Add payee" });
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });
    expect(getByText("Select a payee.")).toBeVisible();
    expect(
      queryByText("Enter the payee account number.")
    ).not.toBeInTheDocument();
  });
  it(">> renders payee name error when payee name is invalid - disabled true", async () => {
    const { getByRole, getByText, queryByText } = render(
      <RenderWithProviders location="/">
        <AddPayeeContext.Provider
          value={{
            addPayeeState: {
              approvedCreditors: [1, 2, 3],
              payeeName: "HO",
              selectedPayee: "",
              account: "aaa",
              nickname: "",
              searchResults: [],
              disabled: true,
              errors: {}
            },
            onInputChange: () => null
          }}
          handleModal={() => null}
        >
          <AddEditPayeeForm />
        </AddPayeeContext.Provider>
      </RenderWithProviders>
    );
    const addPayeeButton = await getByRole("button", { name: "Add payee" });
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });
    expect(getByText("Select a payee.")).toBeVisible();
    expect(
      queryByText("Enter the payee account number.")
    ).not.toBeInTheDocument();
  });
  it(">> renders payee name error when payee name is invalid - disabled false", async () => {
    const { getByRole, getByText, queryByText } = render(
      <RenderWithProviders location="/">
        <AddPayeeContext.Provider
          value={{
            addPayeeState: {
              approvedCreditors: [1, 2, 3],
              payeeName: "HO",
              selectedPayee: "",
              account: "aaa",
              nickname: "",
              searchResults: [],
              disabled: false,
              errors: {}
            },
            onInputChange: () => null
          }}
          handleModal={() => null}
        >
          <AddEditPayeeForm />
        </AddPayeeContext.Provider>
      </RenderWithProviders>
    );
    const addPayeeButton = await getByRole("button", { name: "Add payee" });
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });
    expect(getByText("Select a payee.")).toBeVisible();
    expect(
      queryByText("Enter the payee account number.")
    ).not.toBeInTheDocument();
  });
  it(">> it renders account error when there is no account number - valid payee", async () => {
    const { getByRole, getByText } = render(
      <RenderWithProviders location="/">
        <AddPayeeContext.Provider
          value={{
            addPayeeState: {
              approvedCreditors: [1, 2, 3],
              payeeName: "HOGG",
              selectedPayee: "",
              account: "",
              nickname: "",
              searchResults: [],
              disabled: false,
              errors: {}
            },
            onInputChange: () => null
          }}
        >
          <AddEditPayeeForm />
        </AddPayeeContext.Provider>
      </RenderWithProviders>
    );
    const addPayeeButton = await getByRole("button", { name: "Add payee" });
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });
    expect(getByText("Enter the payee account number.")).toBeVisible();
  });
  it(">> renders nickname error ", async () => {
    const { getByRole, getByText, queryByText } = render(
      <RenderWithProviders location="/">
        <AddPayeeContext.Provider
          value={{
            addPayeeState: {
              approvedCreditors: [1, 2, 3],
              payeeName: "HOGG",
              selectedPayee: "",
              account: "sss",
              nickname: "##@!",
              searchResults: [],
              disabled: false,
              errors: {}
            },
            addPayee: () => null,
            onInputChange: () => null
          }}
          handleModal={() => null}
        >
          <AddEditPayeeForm />
        </AddPayeeContext.Provider>
      </RenderWithProviders>
    );
    const addPayeeButton = await getByRole("button", { name: "Add payee" });
    await act(async () => {
      fireEvent.click(addPayeeButton);
    });
    expect(
      queryByText("Enter the payee account number.")
    ).not.toBeInTheDocument();
    expect(getByText("Enter a valid nickname.")).toBeVisible();
  });
});
