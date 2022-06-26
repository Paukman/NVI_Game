import React, { createContext } from "react";
import PropTypes from "prop-types";
import useAddPayee from "./useAddPayee";

export const AddPayeeContext = createContext();

const AddPayeeProvider = ({
  children,
  handleAddPayee = () => null,
  initialPayee
}) => {
  AddPayeeProvider.propTypes = {
    children: PropTypes.node.isRequired,
    handleAddPayee: PropTypes.func,
    initialPayee: PropTypes.shape({
      id: PropTypes.string,
      accountNumber: PropTypes.string
    })
  };

  const {
    addPayeeState,
    onInputChange,
    handleResultSelect,
    handleSearchChange,
    addPayee
  } = useAddPayee(handleAddPayee, initialPayee);

  return (
    <AddPayeeContext.Provider
      value={{
        addPayeeState,
        onInputChange,
        handleSearchChange,
        handleResultSelect,
        addPayee
      }}
    >
      {children}
    </AddPayeeContext.Provider>
  );
};
export default AddPayeeProvider;
