import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Details from "./Details";
import { fulfillRequest, postData } from "../constants";

describe("Testing Details Component", () => {
  it("Testing headers", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Details requestData={fulfillRequest} postData={postData} />
      </MemoryRouter>
    );

    expect(getByText("Fulfill a request for money")).toBeTruthy();
    expect(getByText("Requester")).toBeTruthy();
    expect(getByText("Requested amount")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(getByText("Message")).toBeTruthy();
  });

  it("Testing values", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Details requestData={fulfillRequest} postData={postData} />
      </MemoryRouter>
    );

    expect(getByText("Ariel Wheeler (testing123456@atb.com)")).toBeTruthy();
    expect(getByText("$11.11")).toBeTruthy();
    expect(getByText("Basic Account (3779) | $43,230.91")).toBeTruthy();
    expect(getByText("Test")).toBeTruthy();
    expect(getByText("View account")).toBeTruthy();
    expect(getByText("Go to Overview")).toBeTruthy();
  });
});
