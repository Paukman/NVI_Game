import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { ModalContext } from "Common/ModalProvider";
import AddEditPayeeForm from "./AddEditPayeeForm";

const AddPayee = () => {
  const { modalComponent } = useContext(ModalContext);
  const history = useHistory();

  const handleModal = () => {
    history.goBack();
  };

  return (
    <>
      {modalComponent({
        show: true,
        size: "large",
        content: <AddEditPayeeForm handleModal={handleModal} />
      })}
    </>
  );
};

export default AddPayee;
