import React from "react";

const CaretDownOutlinedSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      xlinkHref="#a"
    >
      <path
        d="M5 7.5l5.239 5.755L15.478 7.5z"
        fill="#63666A"
        fillRule="evenodd"
      />
    </svg>
  );
};

const CaretDownOutlined = props => <CaretDownOutlinedSVG {...props} />;
export default CaretDownOutlined;
