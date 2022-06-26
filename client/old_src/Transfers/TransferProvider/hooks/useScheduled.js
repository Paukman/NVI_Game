import { useState } from "react";

const useScheduled = () => {
  const [viewDetailsState, setViewDetailsState] = useState(false);
  return {
    viewDetailsState,
    setViewDetailsState
  };
};

export default useScheduled;
