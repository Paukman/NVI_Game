import React from "react";
import Icon from "..";

const CalculatorSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path
        fill="#63666A"
        fillRule="evenodd"
        d="M20.182 2A1.82 1.82 0 0122 3.818v16.364A1.82 1.82 0 0120.192 22H3.808A1.82 1.82 0 012 20.182V3.818A1.82 1.82 0 013.818 2zm-9.091 10.91H3.818v7.272h7.273V12.91zm9.089 0h-7.271v7.272h7.27l.001-7.272zM8.515 14.324l1.162 1.16-1.062 1.062 1.062 1.06-1.162 1.162-1.06-1.062-1.062 1.062-1.16-1.161 1.06-1.061-1.06-1.062 1.16-1.16 1.061 1.06 1.061-1.06zM18.501 17v1.5h-4V17h4zm0-2.5V16h-4v-1.5h4zm-7.41-10.682H3.818v7.273h7.273V3.818zm9.091 0h-7.273v7.273h7.271l.002-7.273zM8.195 5.233v1.48h1.483v1.483H8.195v1.48H6.714v-1.48H5.233V6.714h1.48V5.233h1.482zm10.572 1.313v1.818h-4.444V6.546h4.444z"
      />
    </svg>
  );
};

const Calculator = props => <Icon component={CalculatorSVG} {...props} />;
export default Calculator;
