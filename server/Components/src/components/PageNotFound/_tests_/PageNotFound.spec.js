import React from 'react';
import PageNotFound from '../PageNotFound';

let props = {
  imageSrc: '../../../assets/Images/img.jpeg',
};

describe('Page Not Found Component', () => {
  it('Render children', () => {
    render(
      <PageNotFound {...props}>
        <div>404</div>
      </PageNotFound>,
    );
    expect(document.querySelector('div > div > div').textContent).toEqual('404');
  });
  it('Render Image', () => {
    render(<PageNotFound {...props} />);
    expect(document.querySelector('div > div > div > img')).toHaveAttribute('src', '../../../assets/Images/img.jpeg');
  });
});
