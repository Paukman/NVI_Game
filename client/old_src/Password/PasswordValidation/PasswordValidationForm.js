/* eslint-disable */
import React, { useContext } from 'react';
import { Form, Space } from "antd";
import { Button, Input } from "StyleGuide/Components";

import usePasswordReducer from "../usePasswordReducer"
import { validateForm } from "../usePasswordReducer"
import { authenticationErrors } from "utils/MessageCatalog";
import { ON_CHANGE, ON_BLUR } from "../constants";
import { VALIDATE_FORM } from "../constants";

import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import { showLogoutModal, onChangePassword } from "./utils"
import ValidationContent from "./ValidationContent"
import { ModalContext } from "Common/ModalProvider";
import { PromptContext } from "Common/PromptProvider";
import { useLocation } from "react-router-dom"


const PasswordValidationForm = () => {
    const [formData, setFormData] = usePasswordReducer();
    const modal = useContext(ModalContext);
    const { blockLocation, blockClosingBrowser, onCommit, promptState, onCancel } = useContext(
        PromptContext
    );
    const { showModal } = promptState;
    const location = useLocation()
    const { logout } = useAuth0();

    const handleOnChange = async event => {
        blockLocation()
        setFormData({
            type: ON_CHANGE, data: {
                name: event.target.name,
                value: event.target.value
            }
        })
    };

    const handleOnBlur = async event => {
        setFormData({
            type: ON_BLUR, data: {
                name: event.target.name,
                value: event.target.value
            }
        })
    };

    const handleCancel = () => {
        onCommit();
        showLogoutModal(modal, logout);
    };
    const handleChangePassword = () => {
        //Check if Page Valid
        blockClosingBrowser();
        const isValid = validateForm(formData);
        setFormData({ type: VALIDATE_FORM });
        if (isValid) {
            onCommit();
            onChangePassword(formData, setFormData, logout, modal, location.transactionToken, onCommit);
        }
    };

    return (
        <>
            {modal.modalComponent({
                show: showModal,
                content: authenticationErrors.MSG_RB_AUTH_025(),
                actions: (
                    <>
                        <button
                            type="button"
                            className="ui button basic"
                            onClick={() => onCancel()}>
                            Cancel
                          </button>
                        <button
                            type="button"
                            className="ui button basic"
                            onClick={async () => {
                                onCommit()
                                logout({
                                    returnTo: `${window.location.origin}/logout?loggedOutMessage=manual`
                                });
                            }}>
                            Log out
                      </button>
                    </>
                )
            })}
            <Form
                layout={"vertical"}>
                <Form.Item
                    label="Current password"
                    name="currentPassword"
                    validateStatus={formData.currentPassword.validateStatus}
                    help={<Space direction="vertical" size={13} >{formData.currentPassword.errorMsg}</Space>}
                >
                    <Input.Password value={formData.currentPassword.value} onChange={handleOnChange}
                        name={"currentPassword"} onBlur={handleOnBlur} />
                </Form.Item>
                <Form.Item
                    label="New password"
                    name="password"
                    validateStatus={formData.password.validateStatus}
                    help={<ValidationContent passwordStatus={formData.password} lostFocus={formData.lostFocus} isValidPassword={formData.isNewPasswordValid} isEmptyPassword={!formData.password.value} />}>
                    <Input.Password value={formData.password.value} name={"password"} onBlur={handleOnBlur} onChange={handleOnChange} />
                </Form.Item>
                <Form.Item
                    label="Re-enter new password"
                    name="confirmPassword"
                    validateStatus={formData.confirmPassword.validateStatus}
                    help={<Space direction="vertical" size={15} >{formData.confirmPassword.errorMsg}</Space>}
                    className={"margin-top-26"}
                >
                    <Input.Password value={formData.confirmPassword.value} onChange={handleOnChange}
                        name={"confirmPassword"} onBlur={handleOnBlur} />
                </Form.Item>
                <Form.Item
                    className={"margin-top-26"}>
                    <Button primary block htmlType="submit" loading={formData.isPosting} onClick={handleChangePassword}>
                        Reset password
                  </Button>
                </Form.Item>
                <Form.Item>
                    <Button text block onClick={handleCancel} unclickable={formData.isPosting}>
                        Cancel
                  </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default PasswordValidationForm