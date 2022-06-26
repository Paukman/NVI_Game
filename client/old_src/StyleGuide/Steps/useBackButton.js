import { useEffect, useState } from "react";

const useBackButton = (handleGoBack, once = true) => {
  const [goBack, setGoBack] = useState(false);

  useEffect(() => {
    const callListener = () => {
      handleGoBack();
      setGoBack(true);
      if (once) {
        window.removeEventListener("popstate", callListener);
      }
    };
    window.addEventListener("popstate", callListener);
    return () => {
      window.removeEventListener("popstate", callListener);
    };
  }, [handleGoBack, once]);

  return goBack;
};

export default useBackButton;
