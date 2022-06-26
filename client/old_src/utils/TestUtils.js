/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* This is file is used for our tests only and jest-when is actually a devDependency so quiet the linter */

import { when, resetAllWhenMocks } from "jest-when";
import mockApi from "api";
import { createMemoryHistory } from "history";
import { Router, MemoryRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { render, queries } from "@testing-library/react";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAtom } from "jotai";

import PromptProvider from "Common/PromptProvider";
import ModalProvider, { ModalContext } from "Common/ModalProvider";
import { MessageContext, MessageProvider } from "StyleGuide/Components";

const domTestingLib = require("@testing-library/dom");

export const resetMockApiData = () => {
  resetAllWhenMocks();
};

export const mockApiData = options => {
  resetAllWhenMocks();

  const methods = {
    REQUEST: mockApi.request,
    HEAD: mockApi.head,
    OPTIONS: mockApi.options,

    GET: mockApi.get,
    POST: mockApi.post,
    PUT: mockApi.put,
    DELETE: mockApi.delete,
    DELETEWITHDATA: mockApi.deleteWithData,
    PATCH: mockApi.patch
  };

  options.forEach(option => {
    const calledWith = [];

    if (option.url instanceof RegExp) {
      calledWith.push(expect.stringMatching(option.url));
    } else {
      calledWith.push(option.url);
    }

    if (option.data) {
      calledWith.push(option.data);
    }

    const method = option.method ? option.method.toUpperCase() : "GET";
    const apiMethodCalled = methods[method];

    if (option.error) {
      when(apiMethodCalled)
        .calledWith(...calledWith)
        .mockRejectedValue(option.error);
    } else {
      when(apiMethodCalled)
        .calledWith(...calledWith)
        .mockResolvedValue({
          data: option.results,
          status: option.status
        });
    }
  });
};

// TODO: Retire this util and tests in ETransferForm, RequestForm, TransferForm to use alts instead of src
export const formatIconSrc = path => {
  return path.substring(path.lastIndexOf("/"), path.length);
};

export const renderWithRouter = (
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    location = ""
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Router history={history} location={location}>
      {children}
    </Router>
  );
  Wrapper.propTypes = {
    children: PropTypes.node.isRequired
  };
  return {
    ...render(ui, { wrapper: Wrapper }),
    history,
    location
  };
};

export const RenderWithProviders = ({
  children,
  location,
  show,
  hide,
  modalComponent,
  showMessage
}) => {
  RenderWithProviders.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.string,
    show: PropTypes.func,
    hide: PropTypes.func,
    modalComponent: PropTypes.func,
    showMessage: PropTypes.func
  };

  RenderWithProviders.defaultProps = {
    location: "/",
    show: () => null,
    hide: () => null,
    modalComponent: null,
    showMessage: null
  };

  return (
    <MemoryRouter initialEntries={[location]}>
      <MessageContext.Provider value={{ show: showMessage }}>
        <ModalContext.Provider value={{ show, hide, modalComponent }}>
          <PromptProvider>{children}</PromptProvider>
        </ModalContext.Provider>
      </MessageContext.Provider>
    </MemoryRouter>
  );
};

/**
 * @deprecated Handled automatically in setupTests
 */
export const windowMatchMediaMock = () => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
};

export const renderHookWithComponent = hookToUse => {
  // eslint-disable-next-line react/prop-types
  const TestComponent = ({ callback }) => {
    callback();
    return <></>;
  };

  let component;
  const testHook = callback => {
    component = render(<TestComponent callback={callback} />);
  };

  let hook;
  testHook(() => {
    hook = hookToUse();
  });

  return [hook, component];
};

const { queryHelpers } = domTestingLib;
const queryByDateTitle = queryHelpers.queryByAttribute.bind(null, "title");
const queryAllByDateTitle = queryHelpers.queryAllByAttribute.bind(
  null,
  "title"
);
export const extraQueries = {
  queryByDateTitle,
  queryAllByDateTitle,
  ...queries
};

// Jotai Atom helpers
export const AtomWrapper = ({ atom, children, handleAtom, initialState }) => {
  AtomWrapper.propTypes = {
    atom: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired,
    handleAtom: PropTypes.shape({}).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    initialState: PropTypes.any
  };
  const [state, setState] = useAtom(atom);

  useEffect(() => {
    if (initialState) setState(initialState);

    // Resets atom to initial state on unmount
    return () => setState(atom.init);
  }, [atom, initialState]);

  handleAtom.get = () => state;
  handleAtom.set = async newState =>
    act(async () => {
      setState(newState);
    });

  return <>{children}</>;
};

// Renders component and returns a getter and setter that allow us to manipulate
// and track the state of an atom
export const renderWithAtom = async (component, { atom, initialState }) => {
  const handleAtom = { set: async () => {}, get: () => {} };

  await act(async () =>
    render(
      <AtomWrapper
        atom={atom}
        handleAtom={handleAtom}
        initialState={initialState}
      >
        {component}
      </AtomWrapper>
    )
  );

  return handleAtom;
};

export const renderWithAtoms = async (component, atoms) => {
  const handleAtoms = [];
  const toRender = atoms.reduce((acc, atom) => {
    const handleAtom = atom.initialState
      ? { set: async () => {}, get: () => {} }
      : { get: () => {} };
    handleAtoms.push(handleAtom);
    return (
      <AtomWrapper
        atom={atom.atom}
        handleAtom={handleAtom}
        initialState={atom.initialState}
      >
        {acc}
      </AtomWrapper>
    );
  }, component);

  await act(async () => render(toRender));

  return handleAtoms;
};

const ResetAtom = ({ atom }) => {
  const [, setState] = useAtom(atom);

  // Resets Atom to initial state on unmount
  useEffect(() => () => setState(atom.init), [atom]);
  return null;
};

// Jotai Atoms don't automatically reset between tests in the same file. Use
// this helper after each test to reset them to their initial values
export const resetAtoms = (...atoms) => {
  atoms.forEach(atom => render(<ResetAtom atom={atom} />));
};

// React Query helpers
// Credit: https://tkdodo.eu/blog/testing-react-query
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

export const renderWithClient = ui => {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <MessageProvider>
          <ModalProvider>
            <PromptProvider>{ui}</PromptProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return {
    ...result,
    rerender: rerenderUi =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          <MemoryRouter initialEntries={["/"]}>
            <MessageProvider>
              <ModalProvider>
                <PromptProvider>{rerenderUi}</PromptProvider>
              </ModalProvider>
            </MessageProvider>
          </MemoryRouter>
        </QueryClientProvider>
      )
  };
};

export const createQueryWrapper = () => {
  const testQueryClient = createTestQueryClient();
  // eslint-disable-next-line react/prop-types
  return ({ children }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};
