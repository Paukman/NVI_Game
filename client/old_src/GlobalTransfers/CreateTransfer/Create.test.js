import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Form } from "antd";
import { renderWithClient, mockApiData } from "utils/TestUtils";
import { globalTransfersMessage } from "utils/MessageCatalog";
import Create from "./Create";
import * as useGetGlobalTransfersInfo from "./hooks/useGetGlobalTransferData";

const recipientsUrl = "/api/atb-rebank-api-globaltransfers/recipients";
const accountsUrl =
  "/api/atb-rebank-api-accounts-ts/sortedEligibleAccounts?feature=GlobalTransfers";
const userInfoUrl = "/api/atb-rebank-api-globaltransfers/user";
const mockUserInfoResult = {
  buildingName: "",
  city: "Calgary",
  street: "16 Arbour Ridge Mews NW",
  addressLine2: "addressline2",
  houseNumber: "678",
  postalCode: "T3G 3Z3",
  unitNumber: "12",
  floorNumber: "109",
  country: "CA",
  region: "AB",
  careOfName: ""
};
const userAddressMessage = `Your address is 678 16 Arbour Ridge Mews NW, Calgary AB, T3G 3Z3.If this address isn't correct, please update or call ATB at ${globalTransfersMessage.MSG_GTA_PHONE} so we can help.`;
const exchangeRatesUrl = "/api/atb-rebank-api-globaltransfers/exchangeRates";

const generalRecipientsReturn = [
  { name: "person", id: 54321, currencyCode: "AUD" }
];
const generalAccountsReturn = [
  {
    name: "some account",
    currency: "CAD",
    availableBalance: { value: 5 },
    number: "123",
    id: "123"
  },
  {
    name: "some other account",
    availableBalance: { value: 4 },
    id: "321"
  }
];

const RenderWithForm = () => {
  const [form] = Form.useForm();
  return (
    <MemoryRouter initialEntries={[`/move-money/global-transfers`]}>
      <Create form={form} />
    </MemoryRouter>
  );
};

describe("Global Transfers", () => {
  let render;

  beforeEach(() => {
    render = () => renderWithClient(<RenderWithForm />);
  });

  it("should show the loading skeleton when loading", async () => {
    jest.spyOn(useGetGlobalTransfersInfo, "default").mockReturnValueOnce({
      isError: false,
      recipientList: [],
      accountList: [],
      isLoading: true
    });
    render();

    expect(
      await screen.findByTestId("global-transfers-create-skeleton")
    ).toBeVisible();
  });

  it("should render the input fields", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    expect(await screen.findByText("Select account")).toBeVisible();
    expect(await screen.findByText("Select recipient")).toBeVisible();
  });

  it("should show the account list in the dropdown after a successful call", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    const fromDropDown = await screen.findByText("Select account");
    fireEvent.mouseDown(fromDropDown);

    const options = await screen.findAllByTestId("global-transfer-from");

    expect(options.length).toBe(2);
  });

  it("should show the recipient list in the dropdown after a successful call", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    const recipientDropDown = await screen.findByText("Select recipient");
    fireEvent.mouseDown(recipientDropDown);

    const options = await screen.findAllByTestId("global-transfer-recipient");

    expect(options.length).toBe(1);
  });

  it("should show both currency types in the fields after selecting to and from", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    expect(screen.queryByText("AUD")).not.toBeInTheDocument();
    expect(screen.queryByText("CAD")).not.toBeInTheDocument();

    fireEvent.mouseDown(await screen.findByText("Select account"));
    fireEvent.click(await screen.findByText(/.*some account.*/));

    fireEvent.mouseDown(await screen.findByText("Select recipient"));
    fireEvent.click(await screen.findByText("person"));

    expect(await screen.findByText("AUD")).toBeVisible();
    expect(await screen.findByText("CAD")).toBeVisible();
  });

  it("should show the correct exchange rates after filling in from amount", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: exchangeRatesUrl,
        method: "POST",
        results: {
          buyAmount: 90.68,
          exchangeRate: 1.007506,
          exchangeRateId: 926124,
          sellAmount: 90
        }
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    expect(screen.queryByText("AUD")).not.toBeInTheDocument();
    expect(screen.queryByText("CAD")).not.toBeInTheDocument();

    fireEvent.mouseDown(await screen.findByText("Select account"));
    fireEvent.click(await screen.findByText(/.*some account.*/));

    fireEvent.mouseDown(await screen.findByText("Select recipient"));
    fireEvent.click(await screen.findByText("person"));

    fireEvent.change(screen.getByLabelText("From amount"), {
      target: { value: "90" }
    });

    await act(async () => {
      fireEvent.blur(await screen.findByLabelText("From amount"));
    });

    expect(await screen.getByDisplayValue("90.68")).toBeVisible();
  });

  it("should show a generic error if the exchange rate call fails", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: exchangeRatesUrl,
        method: "POST",
        error: 500
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    expect(screen.queryByText("AUD")).not.toBeInTheDocument();
    expect(screen.queryByText("CAD")).not.toBeInTheDocument();

    fireEvent.mouseDown(await screen.findByText("Select account"));
    fireEvent.click(await screen.findByText(/.*some account.*/));

    fireEvent.mouseDown(await screen.findByText("Select recipient"));
    fireEvent.click(await screen.findByText("person"));

    fireEvent.change(screen.getByLabelText("From amount"), {
      target: { value: "90" }
    });

    await act(async () => {
      fireEvent.blur(await screen.findByLabelText("From amount"));
    });

    expect(await screen.findByText("System Error")).toBeVisible();
  });

  it("should show the user address after a successful call", async () => {
    mockApiData([
      {
        url: recipientsUrl,
        results: {
          recipients: generalRecipientsReturn
        }
      },
      {
        url: accountsUrl,
        results: generalAccountsReturn
      },
      {
        url: userInfoUrl,
        results: {
          address: mockUserInfoResult
        }
      }
    ]);
    render();

    const userInfoMessage = await screen.findByTestId("user-address-message");
    expect(userInfoMessage).toHaveTextContent(userAddressMessage);
  });
});
