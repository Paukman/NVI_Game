import { fulfillRequest, fulfillRequestBusiness, postData } from "./constants";
import { transformFulfillRequest } from "./transformFulfillRequest";

describe("Testing Transform Fulfill Request", () => {
  it(">> should render retail body", () => {
    const result = transformFulfillRequest(fulfillRequest, postData, 1024);

    expect(result.CheckMark.visible).toEqual(true);
    expect(result.CheckMark.imageIcon).toEqual("checkmark-green.svg");
    expect(result.To).toEqual({
      visible: true,
      imageIcon: "person.svg",
      title: "Requester",
      label: "Ariel Wheeler (testing123456@atb.com)"
    });
    expect(result.Amount).toEqual({
      visible: true,
      imageIcon: "money.svg",
      title: "Requested amount",
      label: "$11.11"
    });
    expect(result.MessageFromRequester).toEqual({
      visible: true,
      imageIcon: "message.svg",
      title: "Message from requester",
      label: "Test message"
    });
    expect(result.InvoiceNumber).toEqual({
      visible: false,
      imageIcon: "statement.svg",
      title: "Invoice number",
      label: null
    });
    expect(result.InvoiceDate).toEqual({
      visible: false,
      imageIcon: "end-date.svg",
      title: "Invoice due",
      label: null
    });
    expect(result.From).toEqual({
      visible: true,
      imageIcon: "account.svg",
      title: "From",
      label: "Basic Account (3779) | $43,230.91"
    });
    expect(result.Message).toEqual({
      visible: true,
      imageIcon: "message.svg",
      title: "Message",
      label: "Test"
    });
  });

  it("Testing No Message case", () => {
    const noMessageData = {
      ...fulfillRequest,
      beneficiaryMessage: null
    };
    const postDataNoMessage = {
      ...postData,
      message: ""
    };
    const noMessageResult = transformFulfillRequest(
      noMessageData,
      postDataNoMessage
    );

    expect(noMessageResult.Message).toEqual({
      visible: false,
      imageIcon: "message.svg",
      title: "Message",
      label: ""
    });
  });

  it(">> should render corporate body with invoice number and invoice date", () => {
    const result = transformFulfillRequest(
      fulfillRequestBusiness,
      postData,
      1024
    );

    expect(result.CheckMark.visible).toEqual(true);
    expect(result.CheckMark.imageIcon).toEqual("checkmark-green.svg");
    expect(result.To).toEqual({
      visible: true,
      imageIcon: "person.svg",
      title: "Requester",
      label: "Company User (testing123456@atb.com)"
    });
    expect(result.Amount).toEqual({
      visible: true,
      imageIcon: "money.svg",
      title: "Requested amount",
      label: "$11.11"
    });
    expect(result.MessageFromRequester).toEqual({
      visible: true,
      imageIcon: "message.svg",
      title: "Message from requester",
      label: "Test message"
    });
    expect(result.InvoiceNumber).toEqual({
      visible: true,
      imageIcon: "statement.svg",
      title: "Invoice number",
      label: "123456"
    });
    expect(result.InvoiceDate).toEqual({
      visible: true,
      imageIcon: "end-date.svg",
      title: "Invoice due",
      label: "May 28, 2020"
    });
    expect(result.From).toEqual({
      visible: true,
      imageIcon: "account.svg",
      title: "From",
      label: "Basic Account (3779) | $43,230.91"
    });
    expect(result.Message).toEqual({
      visible: true,
      imageIcon: "message.svg",
      title: "Message",
      label: "Test"
    });
  });

  it("should render corporate body with no invoice number", () => {
    const noInvoiceData = {
      ...fulfillRequestBusiness,
      invoiceDetail: {
        invoiceNumber: "",
        dueDate: "2020-05-28T16:33:26.909Z"
      }
    };

    const noInvoiceNumberResult = transformFulfillRequest(
      noInvoiceData,
      postData,
      1024
    );

    expect(noInvoiceNumberResult.InvoiceNumber).toEqual({
      visible: "",
      imageIcon: "statement.svg",
      title: "Invoice number",
      label: ""
    });

    expect(noInvoiceNumberResult.InvoiceDate).toEqual({
      visible: true,
      imageIcon: "end-date.svg",
      title: "Invoice due",
      label: "May 28, 2020"
    });
  });

  it("should render corporate body with no invoice date", () => {
    const noInvoiceData = {
      ...fulfillRequestBusiness,
      invoiceDetail: {
        invoiceNumber: "123456",
        dueDate: ""
      }
    };

    const noInvoiceDateResult = transformFulfillRequest(
      noInvoiceData,
      postData,
      1024
    );

    expect(noInvoiceDateResult.InvoiceNumber).toEqual({
      visible: true,
      imageIcon: "statement.svg",
      title: "Invoice number",
      label: "123456"
    });

    expect(noInvoiceDateResult.InvoiceDate).toEqual({
      visible: "",
      imageIcon: "end-date.svg",
      title: "Invoice due",
      label: null
    });
  });
});
