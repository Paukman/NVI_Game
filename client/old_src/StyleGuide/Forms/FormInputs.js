/* eslint-disable */
import React, { useReducer } from 'react';
import { Form, Input } from 'antd';
import { Button } from "../Components";


import {
    MailOutlined,
    UserOutlined,
} from '@ant-design/icons';


// available message statuses 
const SUCCESS = 'success'
const WARNING = 'warning'
const ERROR = 'error'
const VALIDATING = 'validating'



const validateFirstName = name => {
    if (name) {
        return {
            validateStatus: SUCCESS,
            errorMsg: null,
            value: name
        };
    }
    return {
        validateStatus: ERROR,
        errorMsg: `First Name is required!`,
    };
}

const initialState = {
    firstName: {
        value: "",
        errorMsg: null,
        validateStatus: SUCCESS
    },
    email: {
        value: "",
        errorMsg: null,
        validateStatus: SUCCESS
    }
}


const validateEmail = email => {
    if (email) {
        return {
            validateStatus: SUCCESS,
            errorMsg: null,
            value: email
        };
    }
    return {
        validateStatus: ERROR,
        errorMsg: `Email is required!`,

    }
}


const reducer = (state, action) => {
    let newState = state
    if (action.type === "ON_CHANGE") {
        const { name, value } = action.data;
        if (name === "firstName") {
            return {
                ...newState,
                "firstName": validateFirstName(value),
            };
        }
        if (name === "email") {
            return {
                ...newState,
                "email": validateEmail(value)
            };
        }
        return newState
    }
    return newState
}

const FormManualValidation = () => {
    const [formData, setFormData] = useReducer(reducer, initialState)

    const handleOnChange = async event => {
        setFormData({
            type: "ON_CHANGE", data: {
                name: event.target.name,
                value: event.target.value
            }
        })
    };

    return (
        <Form
            layout={"vertical"}>
            <Form.Item
                label="Label"
                name="firstName" // this is required to associate label with the input
                validateStatus={formData.firstName.validateStatus}
                help={formData.firstName.errorMsg || "Helper text"}
            >
                <Input value={formData.firstName.value} name={"firstName"} onChange={handleOnChange} />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                validateStatus={formData.email.validateStatus}
                help={formData.email.errorMsg || "Enter email"}
            >
                <Input value={formData.email.value} name={"email"} onChange={handleOnChange} />
            </Form.Item>
            <Form.Item >
                <Button primary htmlType="submit">
                    Submit
               </Button>
            </Form.Item>
        </Form>
    );
};

export default FormManualValidation