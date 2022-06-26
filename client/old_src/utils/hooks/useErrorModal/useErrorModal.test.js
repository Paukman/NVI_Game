import { renderHook, act } from "@testing-library/react-hooks";
import { Modal } from "antd";
import { eTransferErrors, SYSTEM_ERROR } from "utils/MessageCatalog";
import useErrorModal from "./useErrorModal";

const mockHistory = jest.fn();

jest.mock("react-router-dom", () => ({
  useHistory: () => mockHistory
}));
jest.mock("antd", () => ({
  Modal: {
    info: jest.fn()
  }
}));

describe("useGenericErrorModal", () => {
  beforeEach(() => {
    mockHistory.mockClear();
  });

  it("should call show modal from modal context when function is called", () => {
    const { result } = renderHook(() => useErrorModal());
    act(() => {
      result.current.showErrorModal();
    });
    expect(Modal.info).toHaveBeenCalledWith({
      content: eTransferErrors.MSG_REBAS_000_CONTENT,
      title: SYSTEM_ERROR,
      autoFocusButton: null,
      centered: true,
      icon: null,
      okButtonProps: {
        className: "ant-btn-link md-link"
      },
      okType: "link",
      afterClose: expect.any(Function)
    });
  });
});
