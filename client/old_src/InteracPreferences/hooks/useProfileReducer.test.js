import { renderHook, act } from "@testing-library/react-hooks";
import useProfileReducer, {
  initialState,
  LOADING_USER_PROFILE,
  LOADED_USER_PROFILE,
  USER_PROFILE_FAILED,
  ON_USER_PROFILE_CHANGE,
  SAVING_USER_PROFILE,
  USER_PROFILE_SAVED,
  SAVING_USER_PROFILE_FAILED,
  CANCEL_PROFILE_EDIT,
  CANCEL_PROFILE_CREATE
} from "./useProfileReducer";
import { extractProfile } from "./utils";

const dataWithProfile = {
  enabled: true,
  customerName: {
    registrationName: "James Bond"
  },
  notificationPreference: [
    {
      notificationHandleType: "Email",
      notificationHandle: "james_bond@saveworld.com"
    }
  ]
};
describe("useProfile hook", () => {
  it(">> should set the correct state when user is with success or error", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);

    act(() => dispatch({ type: LOADING_USER_PROFILE }));
    const [loadingState] = result.current;
    expect(loadingState.loading).toBe(true);

    act(() => dispatch({ type: LOADED_USER_PROFILE, data: dataWithProfile }));
    const [loadedProfile] = result.current;
    expect(loadedProfile).toEqual({
      editProfile: {
        email: "james_bond@saveworld.com",
        name: "James Bond"
      },
      editing: false,
      email: "james_bond@saveworld.com",
      enabled: true,
      error: { type: null },
      loading: false,
      name: "James Bond",
      profileUpdated: false,
      dataLoaded: true,
      saving: false,
      success: false
    });

    act(() => dispatch({ type: USER_PROFILE_FAILED, data: "Server Error" }));
    const [errorState] = result.current;
    expect(errorState).toEqual({
      ...initialState,
      error: { type: "Server Error" }
    });
  });
  it(">> on input changed", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const dispatch = result.current[1];
    act(() => dispatch({ type: LOADED_USER_PROFILE, data: dataWithProfile }));
    const changes = {
      name: "email",
      value: "bond_james@email.com"
    };
    act(() => dispatch({ type: ON_USER_PROFILE_CHANGE, data: changes }));
    const [changedEmail] = result.current;
    expect(changedEmail.editProfile).toEqual({
      name: "James Bond",
      email: "bond_james@email.com"
    });
  });
  it(">> updated profile state on success", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const [state, dispatch] = result.current;
    expect(state.profileUpdated).toEqual(false);
    act(() => dispatch({ type: USER_PROFILE_SAVED, data: dataWithProfile }));
    const [newState] = result.current;
    expect(newState.profileUpdated).toEqual(true);
  });
  it(">> resets the profileUpdate back to false", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const [state, dispatch] = result.current;
    expect(state.profileUpdated).toEqual(false);
    act(() => dispatch({ type: USER_PROFILE_SAVED, data: dataWithProfile }));
    const [newState] = result.current;
    expect(newState.profileUpdated).toEqual(true);
    // act(() => dispatch({ type: UPDATING_USER_PROFILE, data: dataWithProfile }));
    // const [nextState] = result.current;
    // expect(nextState.profileUpdated).toEqual(false);
  });

  it(">> sets saving state", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const [state, dispatch] = result.current;
    expect(state.saving).toEqual(false);
    act(() => dispatch({ type: SAVING_USER_PROFILE }));
    const [nextState] = result.current;
    expect(nextState.saving).toEqual(true);
  });

  it(">> saving user profile failed", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const [state, dispatch] = result.current;
    expect(state.saving).toEqual(false);
    act(() => dispatch({ type: SAVING_USER_PROFILE }));
    const [nextState] = result.current;
    expect(nextState.saving).toEqual(true);
    act(() =>
      dispatch({ type: SAVING_USER_PROFILE_FAILED, error: "Server Error" })
    );
    const [failedOneSaveState] = result.current;
    expect(failedOneSaveState.saving).toEqual(false);
    expect(failedOneSaveState.error).toEqual({ type: "Server Error" });
  });

  it(">>  cancel edit profile", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const dispatch = result.current[1];
    act(() => dispatch({ type: LOADED_USER_PROFILE, data: dataWithProfile }));
    const changes = {
      name: "email",
      value: "bond_james@email.com"
    };
    act(() => dispatch({ type: ON_USER_PROFILE_CHANGE, data: changes }));
    const [changedEmail] = result.current;
    expect(changedEmail.editProfile).toEqual({
      name: "James Bond",
      email: "bond_james@email.com"
    });
    act(() => dispatch({ type: CANCEL_PROFILE_EDIT }));
    const [cancelState] = result.current;
    expect(cancelState.name).toEqual("James Bond");
    expect(cancelState.email).toEqual("james_bond@saveworld.com");
    expect(cancelState.editProfile).toEqual({
      name: "James Bond",
      email: "james_bond@saveworld.com"
    });
  });
  it(">>  cancel create profile", async () => {
    const { result } = renderHook(() => useProfileReducer());
    const dispatch = result.current[1];
    const changes = {
      name: "email",
      value: "bond_james@email.com"
    };
    act(() => dispatch({ type: ON_USER_PROFILE_CHANGE, data: changes }));
    const [changedEmail] = result.current;
    expect(changedEmail.editProfile).toEqual({
      name: "",
      email: "bond_james@email.com"
    });
    act(() => dispatch({ type: CANCEL_PROFILE_CREATE }));
    const [cancelState] = result.current;
    expect(cancelState.email).toEqual("");
    expect(cancelState.name).toEqual("");
  });
  describe(">> extractProfile function", () => {
    it(">> should set proper state when fetches user with no profile ", async () => {
      let profile = extractProfile(dataWithProfile, initialState);
      expect(profile).toEqual({
        name: "James Bond",
        email: "james_bond@saveworld.com",
        enabled: true
      });
      profile = extractProfile(undefined, initialState);
      expect(profile).toEqual(initialState);
      profile = extractProfile(null, initialState);
      expect(profile).toEqual(initialState);

      profile = extractProfile(
        {
          enabled: true,
          customerName: {
            registrationName: "James Bond"
          }
        },
        initialState
      );
      expect(profile).toEqual({
        email: "",
        enabled: true,
        name: "James Bond"
      });
      expect(profile).toEqual({
        email: "",
        enabled: true,
        name: "James Bond"
      });
      profile = extractProfile(
        {
          enabled: true,
          customerName: {
            registrationName: "James Bond",
            notificationPreference: [
              {
                notificationHandleType: "Phone",
                notificationHandle: "1-SAVE-WORLD-007-007"
              }
            ]
          }
        },
        initialState
      );
      expect(profile).toEqual({
        email: "",
        enabled: true,
        name: "James Bond"
      });
    });
  });
});
