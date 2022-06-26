import { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PromptContext } from "Common/PromptProvider";

const useData = () => {
  const [data, setData] = useState({
    name: "",
    loading: false,
    saving: false,
    page: "one"
  });
  const {
    blockLocation,
    blockClosingBrowser,
    onCommit,
    promptState,
    onCancel
  } = useContext(PromptContext);

  const history = useHistory();
  const isMounted = useRef();
  useEffect(() => {
    isMounted.current = true;
    const fetchData = () => {
      setData(state => {
        return {
          ...state,
          loading: true
        };
      });
      setTimeout(() => {
        if (isMounted.current) {
          setData(state => {
            return {
              ...state,
              name: "some name from server",
              loading: false
            };
          });
        }
      }, 1000);
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const submitFormOne = formData => {
    const { name } = formData;
    setData(state => {
      return {
        ...state,
        saving: true
      };
    });

    setTimeout(() => {
      setData(state => {
        return {
          ...state,
          name,
          saving: false
        };
      });
      history.push("form-two");
    }, 1000);
  };

  const submitFormTwo = formData => {
    const { email } = formData;
    setData(state => {
      return {
        ...state,
        saving: true
      };
    });

    setTimeout(() => {
      setData(state => {
        return {
          ...state,
          email,
          saving: false
        };
      });
      history.push("form-three");
    }, 1000);
  };

  const goToPage = (formData, page) => {
    const { email } = formData;
    setData(state => {
      return {
        ...state,
        saving: true
      };
    });

    setTimeout(() => {
      setData(state => {
        return {
          ...state,
          email,
          saving: false,
          page
        };
      });
    }, 1000);
  };

  return {
    data,
    submitFormOne,
    submitFormTwo,
    blockLocation,
    blockClosingBrowser,
    onCommit,
    promptState,
    onCancel,
    goToPage
  };
};

export default useData;
