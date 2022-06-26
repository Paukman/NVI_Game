import { renderHook, act } from "@testing-library/react-hooks";
import dayjs from "dayjs";
import useRecurringReducer, {
  initialState,
  UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE
} from "./useRecurringReducer";
import { LOADING_DATA_FAILED, ON_CHANGE } from "./constants";
import { endingOptions } from "../../constants";

describe("useTransfersReducer hook", () => {
  it(">> should return default state", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: "Some gibberish type" }));
    expect(result.current[0]).toEqual(initialState);
  });

  it(">> loading data failed", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    const failedState = {
      ...initialState,
      error: true,
      loading: false
    };
    act(() => dispatch({ type: LOADING_DATA_FAILED }));
    expect(result.current[0]).toEqual(failedState);
  });

  it(">> should reduce UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "frequency", value: "weekly" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "starting",
          value: dayjs("Apr 01, 2020", "MMM DD, YYYY")
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "ending",
          value: dayjs("May 01, 2020", "MMM DD, YYYY")
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "endingOption", value: endingOptions.endDate }
      })
    );

    act(() => dispatch({ type: UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE }));
    expect(result.current[0].endDateNoOfTransfersMessage).toEqual(
      "Number of transfers: 5"
    );
    expect(result.current[0].reviewNumberOfTransfers).toEqual(5);
    // have to do this way because of discrepancy between local and pipeline
    expect(result.current[0].reviewEnding.toString()).toContain(
      "Fri, 01 May 2020"
    );

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "endingOption", value: endingOptions.numberOfTransfers }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "numberOfTransfers", value: 5 }
      })
    );
    act(() => dispatch({ type: UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE }));
    expect(result.current[0].endDateNoOfTransfersMessage).toEqual(
      "End date: Apr 29, 2020"
    );
    expect(result.current[0].reviewNumberOfTransfers).toEqual(5);
    expect(result.current[0].reviewEnding).toEqual("Apr 29, 2020");
  });
});
