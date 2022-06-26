import { renderHook, act } from "@testing-library/react-hooks";
import mixpanel from "mixpanel-browser";
import useMoveMoneyAnalytics, {
  moneyMovementType
} from "./useMoveMoneyAnalytics";
import { mapBillPayment } from "./mapMoveMoney";

const mockedTrack = jest.fn();
jest.spyOn(mixpanel, "track").mockImplementation(mockedTrack);

jest.mock("./mapMoveMoney");

describe("Testing useMoveMoneyAnalytics", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should track `Money Movement Started` when started is called", async () => {
    const { result } = renderHook(() =>
      useMoveMoneyAnalytics(moneyMovementType.BILL_PAYMENT)
    );
    await act(async () => {
      await result.current.started();
    });

    expect(mockedTrack).toHaveBeenCalled();
    expect(mockedTrack).toHaveBeenCalledWith("Money Movement Started", {
      transferType: moneyMovementType.BILL_PAYMENT
    });
  });

  it("should track `Money Movement Information Completed` when review is called", async () => {
    mapBillPayment.mockReturnValue({});

    const { result } = renderHook(() =>
      useMoveMoneyAnalytics(moneyMovementType.BILL_PAYMENT)
    );
    await act(async () => {
      await result.current.review();
    });

    expect(mockedTrack).toHaveBeenCalled();
    expect(mockedTrack).toHaveBeenCalledWith(
      "Money Movement Information Completed",
      {
        transferType: moneyMovementType.BILL_PAYMENT
      }
    );
  });

  it("should track `Money Movement Confirm Transaction` when confirm is called", async () => {
    mapBillPayment.mockReturnValue({});

    const { result } = renderHook(() =>
      useMoveMoneyAnalytics(moneyMovementType.BILL_PAYMENT)
    );
    await act(async () => {
      await result.current.confirm();
    });

    expect(mockedTrack).toHaveBeenCalled();
    expect(mockedTrack).toHaveBeenCalledWith(
      "Money Movement Confirm Transaction",
      {
        transferType: moneyMovementType.BILL_PAYMENT
      }
    );
  });

  it("should track `Money Movement Success` when success is called", async () => {
    mapBillPayment.mockReturnValue({});

    const { result } = renderHook(() =>
      useMoveMoneyAnalytics(moneyMovementType.BILL_PAYMENT)
    );
    await act(async () => {
      await result.current.success();
    });

    expect(mockedTrack).toHaveBeenCalled();
    expect(mockedTrack).toHaveBeenCalledWith("Money Movement Success", {
      transferType: moneyMovementType.BILL_PAYMENT
    });
  });

  it("should track `Money Movement Failed` when success is called", async () => {
    mapBillPayment.mockReturnValue({});

    const { result } = renderHook(() =>
      useMoveMoneyAnalytics(moneyMovementType.BILL_PAYMENT)
    );
    await act(async () => {
      await result.current.failed();
    });

    expect(mockedTrack).toHaveBeenCalled();
    expect(mockedTrack).toHaveBeenCalledWith("Money Movement Failed", {
      transferType: moneyMovementType.BILL_PAYMENT
    });
  });
});
