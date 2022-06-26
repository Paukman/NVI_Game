import * as React from "react";
import Icon from "..";

const CircledDollarSignSVG = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24">
      <path
        d="M13 7v1h2v2h-3.5a.5.5 0 000 1h1c1.379 0 2.5 1.122 2.5 2.5 0 1.207-.86 2.217-2 2.449V17h-2v-1H9v-2h3.5a.5.5 0 000-1h-1A2.503 2.503 0 019 10.5c0-1.207.86-2.217 2-2.449V7h2zm-1 13c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm0-18c5.515 0 10 4.486 10 10s-4.485 10-10 10C6.486 22 2 17.514 2 12S6.486 2 12 2z"
        fill="#63666A"
        fillRule="evenodd"
      />
    </svg>
  );
};

const CircledDollarSign = props => (
  <Icon component={CircledDollarSignSVG} {...props} />
);
export default CircledDollarSign;
