import { receiveETransferErrors } from "utils/MessageCatalog";
import { handleError } from "./utils";

describe("Testing handleError", () => {
  it(">> should return proper error for ETRN0019", () => {
    const error = { response: { data: { code: "ETRN0019" } } };
    const ret = handleError(error);
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_006
    });
  });
  it(">> should return proper error for ETRN0020", () => {
    const error = { response: { data: { code: "ETRN0020" } } };
    const ret = handleError(error);
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_006B()
    });
  });
  it(">> should return proper error for ETRN0015", () => {
    const error = { response: { data: { code: "ETRN0015" } } };
    const senderName = "someUser";
    const ret = handleError(error, senderName);
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_043(senderName)
    });
  });
  it(">> should return proper error for ETRN0018", () => {
    const error = { response: { data: { code: "ETRN0018" } } };
    const ret = handleError(error);
    expect(ret).toMatchObject({
      invalidAnswer: "inline",
      message: receiveETransferErrors.MSG_RBET_017s
    });
  });
  it(">> should return proper error for ETRN0003", () => {
    const error = { response: { data: { code: "ETRN0003" } } };
    const ret = handleError(error);
    expect(ret).toMatchObject({
      message: null
    });
  });
  it(">> should return all other errors", () => {
    const error = { response: { data: { code: "some other error" } } };
    let ret = handleError(error);
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_014
    });
    ret = handleError(null);
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_014
    });
    ret = handleError("");
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_014
    });
    ret = handleError(undefined);
    expect(ret).toMatchObject({
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_014
    });
  });
});
