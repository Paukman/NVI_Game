import React from 'react';
import { act, render, screen, fireEvent, cleanup, waitForElementToBeRemoved } from '@testing-library/react';
import { act as actHook, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import cache from "./cache";

import '@testing-library/jest-dom';

jest.mock('axios');

global.React = React;
global.render = render;
global.Screen = screen;
global.fireEvent = fireEvent;
global.cleanup = cleanup;
global.renderHook = renderHook;
global.waitForElementToBeRemoved = waitForElementToBeRemoved;
global.act = act;
global.actHook = actHook;
global.mockApi = axios;
global.MemoryRouter = MemoryRouter;
global.cache = cache;

afterEach(() => {
  jest.clearAllMocks();
});
