import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useQualtrics = () => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      if (window.QSI && window.QSI.API) {
        window.QSI.API.unload();
        window.QSI.API.load();
      }
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return [history, window.QSI];
};

export default useQualtrics;
