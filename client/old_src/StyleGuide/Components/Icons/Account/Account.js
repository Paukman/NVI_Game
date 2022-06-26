import React from "react";
import Icon from "..";

const AccountSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path
        d="M14.628 2.071a1.001 1.001 0 011.266.482L17.618 6H18c1.103 0 2 .897 2 2v2h1a1 1 0 011 1v6a1 1 0 01-1 1h-1v2c0 1.103-.897 2-2 2H4c-1.103 0-2-.897-2-2V8c0-1.103.897-2 2-2h.807zM18 8.001H4v12h13.997l.001-2H15c-.265 0-.519-.107-.707-.293l-3-3a1 1 0 010-1.415l3-3A1 1 0 0115 10h3V8zm2 4h-4.586l-2 2 2 2H20v-4zm-4 1a1 1 0 110 2 1 1 0 010-2zm-1.483-8.73L10.193 6h5.189l-.865-1.73z"
        fill="#63666A"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Account = props => <Icon component={AccountSVG} {...props} />;
export default Account;
