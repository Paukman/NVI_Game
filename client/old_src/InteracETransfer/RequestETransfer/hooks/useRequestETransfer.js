import { useState } from "react";

const useRequestETransfer = () => {
  const [requestState, setState] = useState({
    from: "",
    showAddRecipient: false
  });

  const onChange = ({ name, value }) => {
    setState(state => ({
      ...state,
      [name]: value
    }));
  };

  const onCleanForm = () => {
    setState(state => ({
      ...state,
      from: "",
      showAddRecipient: false
    }));
  };

  const showAddRecipient = value => {
    setState(state => ({
      ...state,
      showAddRecipient: value
    }));
  };

  return {
    requestState,
    onChange,
    onCleanForm,
    showAddRecipient
  };
};

export default useRequestETransfer;
