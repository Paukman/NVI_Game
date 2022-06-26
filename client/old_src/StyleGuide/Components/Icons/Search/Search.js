import React from "react";
import Icon from "..";

const SearchSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
    >
      <path
        d="M8.307 13.787c-1.463 0-2.84-.57-3.875-1.604a5.446 5.446 0 01-1.605-3.876c0-1.463.57-2.84 1.605-3.875 1.035-1.035 2.412-1.605 3.875-1.605s2.84.57 3.875 1.605a5.446 5.446 0 011.605 3.875c0 1.464-.57 2.84-1.605 3.876a5.449 5.449 0 01-3.875 1.604zM19 17.708l-4.925-4.925a7.247 7.247 0 001.54-4.476 7.257 7.257 0 00-2.142-5.166A7.252 7.252 0 008.307 1c-1.952 0-3.787.76-5.166 2.141A7.258 7.258 0 001 8.307c0 1.952.76 3.787 2.141 5.166a7.254 7.254 0 005.166 2.141c1.643 0 3.2-.544 4.476-1.54L17.708 19 19 17.708z"
        fill="#63666A"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Search = props => <Icon component={SearchSVG} {...props} />;
export default Search;