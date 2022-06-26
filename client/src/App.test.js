import React from 'react';
import App from './App';
import { GlobalProvider } from './providers/GlobalProvider';

// TODO: Introduce tests later as soon as we figure out how to deal with Auth0 that is used inside of Appq
describe('App', () => {
  it('renders My Perspective text', () => {
    render(<div>My Perspective</div>);
    const linkElement = Screen.getByText(/My Perspective/i);
    expect(linkElement).toBeInTheDocument();
  });
});
