import React from "react";
import Icon from "StyleGuide/Components/Icons";

const QuestionSVG = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd">
        <path fill="#EFF1F1" d="M-25-413h768v917H-25z" />
        <path fill="#FFF" d="M-25-395h768v884H-25z" />
        <path
          stroke="#63666A"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 9.171a4 4 0 11-5.658 5.657 4 4 0 015.658-5.657z"
        />
        <path
          fill="#63666A"
          d="M17 15.586L15.586 17l-3.293-3.293 1.414-1.414z"
        />
        <path
          stroke="#63666A"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"
        />
      </g>
    </svg>
  );
};

const Question = props => <Icon component={QuestionSVG} {...props} />;
export default Question;
