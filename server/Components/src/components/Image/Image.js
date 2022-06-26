import PropTypes from 'prop-types';
import { StyledImage } from './styled';

const Image = StyledImage;

Image.displayName = 'Image';

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Image.defaultProps = {
  alt: '',
};

export default Image;
