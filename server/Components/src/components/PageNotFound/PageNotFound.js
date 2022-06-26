import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledDiv } from './styled';
import FullPageLayout from '../FullPageLayout/FullPageLayout';
import Image from '../Image/Image';
import { ReactComponent as IconSVG } from '../../../assets/Icons/Asset1.svg';

const PageNotFound = memo((props) => {
  const { children, bgColor, bgImage, imageSrc, imageWidth } = props;
  return (
    <StyledDiv>
      <FullPageLayout bgColor={bgColor} bgImage={bgImage}>
        {imageSrc ? <Image src={imageSrc} width={imageWidth} /> : <IconSVG />}
        {children ? (
          <div>{children}</div>
        ) : (
          <div>
            <h1>Oops. Something went adrift.</h1>
            <p>This page no longer exists, or the URL is incorrect.</p>
          </div>
        )}
      </FullPageLayout>
    </StyledDiv>
  );
});

PageNotFound.displayName = 'PageNotFound';

PageNotFound.propTypes = {
  children: PropTypes.node,
  bgColor: PropTypes.string,
  bgImage: PropTypes.string,
  imageSrc: PropTypes.string,
  imageWidth: PropTypes.number,
};

PageNotFound.defaultProps = {
  bgColor: 'white',
};

export default PageNotFound;
