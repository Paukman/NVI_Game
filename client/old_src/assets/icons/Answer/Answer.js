import React from "react";
import Icon from "StyleGuide/Components/Icons";

const AnswerSVG = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path id="h8tk17lg1a" d="M0 20h20V0H0z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="#EFF1F1" d="M-25-473h768v917H-25z" />
        <path fill="#FFF" d="M-25-455h768v884H-25z" />
        <g transform="translate(2 2)">
          <path
            stroke="#63666A"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 10a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"
          />
          <path
            fill="#63666A"
            d="M7.54 14.31L10 8.62l2.461 5.69h2.19l-3.737-8.637a1 1 0 00-.914-.61 1 1 0 00-.914.61L5.35 14.31h2.19z"
          />
          <mask id="m3l2z54l9b" fill="#fff">
            <use xlinkHref="#h8tk17lg1a" />
          </mask>
          <path fill="#63666A" d="M7 12.735h6v-2H7z" mask="url(#m3l2z54l9b)" />
        </g>
      </g>
    </svg>
  );
};

const Answer = props => <Icon component={AnswerSVG} {...props} />;
export default Answer;
