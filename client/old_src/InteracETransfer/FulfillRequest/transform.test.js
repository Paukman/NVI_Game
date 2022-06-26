import { transformData } from "./transform";
import { fulfillRequest } from "./constants";

describe("Testing transformData from FulfillRequest utils", () => {
  it(">> should transform values successfully", async () => {
    const id = "TESTID";
    const formData = { from: "test from", message: "test message" };
    const etransferData = {
      withdrawalAccounts: [{ id: "test from", name: "test account" }]
    };
    const data = transformData(id, fulfillRequest, etransferData, formData);

    expect(data.eTransferType).toEqual("Fulfill Money Request eTransfer");
    expect(data.moneyRequestReferenceNumber).toEqual(id);
    expect(data.fromAccount).toEqual({
      id: formData.from,
      name: "test account"
    });
    expect(data.recipient).toEqual({
      aliasName: "Test User"
    });
    expect(data.amount).toEqual({
      value: 11.11,
      currency: fulfillRequest.amountCurrency
    });
    expect(data.memo).toEqual(formData.message);
  });
});
