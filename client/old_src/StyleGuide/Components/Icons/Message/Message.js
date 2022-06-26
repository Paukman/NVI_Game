import * as React from "react";
import Icon from "..";

const MessageSVG = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24">
      <path
        d="M4.293 19H12c4.411 0 8-3.14 8-7s-3.589-7-8-7c-4.41 0-8 3.14-8 7 0 1.537.568 3 1.642 4.232.336.386.327.963-.02 1.338L4.292 19zM12 21H2a1 1 0 01-.733-1.68l2.306-2.484C2.541 15.392 2 13.735 2 12c0-4.962 4.486-9 10-9s10 4.038 10 9-4.486 9-10 9z"
        fill="#63666A"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Message = props => <Icon component={MessageSVG} {...props} />;
export default Message;
