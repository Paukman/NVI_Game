import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'regenerator-runtime/runtime';

global.cleanup = cleanup;
global.render = render;
global.Screen = screen;
global.fireEvent = fireEvent;
global.waitFor = () => waitFor;
