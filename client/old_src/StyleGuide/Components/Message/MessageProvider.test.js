import React, { useContext } from "react";
import { render, act, fireEvent } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import MessageProvider, { MessageContext } from "./MessageProvider";

const Messages = () => {
  const { show } = useContext(MessageContext);
  return (
    <>
      <button
        type="button"
        onClick={() =>
          show({
            type: "success",
            content: "This is a success message.",
            duration: 1000
          })
        }
      >
        Success
      </button>
      <button
        type="button"
        onClick={() =>
          show({
            type: "success",
            content: "This is a success message.",
            duration: 1000
          })
        }
      >
        OnClose
      </button>
    </>
  );
};
describe("MessageProvider", () => {
  beforeAll(() => {
    windowMatchMediaMock();
  });
  it("can render children", async () => {
    let component;
    await act(async () => {
      component = render(
        <MessageProvider>
          <div />
        </MessageProvider>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
  it("can render children with context", async () => {
    let component;
    await act(async () => {
      component = render(
        <MessageContext.Provider>
          <div />
        </MessageContext.Provider>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
  it("can show message", async () => {
    let component;
    await act(async () => {
      component = render(
        <MessageProvider>
          <Messages />
        </MessageProvider>
      );
      return component;
    });
    const { getByText, queryByText } = component;
    const success = getByText("Success");
    fireEvent.click(success);
    const successMessage = await queryByText("This is a success message.");
    expect(successMessage).toBeTruthy();
  });
  it("can show and close message", async () => {
    let component;
    await act(async () => {
      component = render(
        <MessageProvider>
          <Messages />
        </MessageProvider>
      );
      return component;
    });
    const { getByText, queryByText } = component;
    const success = getByText("Success");
    fireEvent.click(success);
    const successMessage = await queryByText("This is a success message.");
    expect(successMessage).toBeTruthy();
    await act(async () => {
      fireEvent.click(successMessage);
    });
    expect(queryByText("This is a success message.")).toBeNull();
  });
});
