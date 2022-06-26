/* eslint-disable */
import React, { useReducer } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { Button } from "../Components";


import {
    MailOutlined,
    UserOutlined,
    ArrowDownOutlined
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
            <Row>
                <Col span={2}>
                    <div style={{
                        marginTop: "36px"
                    }}>
                        <Row>
                            <Col>
                                <UserOutlined />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{
                                    borderLeft: "1px solid #63666a",
                                    marginLeft: "7px",
                                    height: "62px"
                                }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <MailOutlined />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={22}>
                    <Form.Item
                        label="First Name"
                        name="firstName" // this is required to associate label with the input
                        validateStatus={formData.firstName.validateStatus}
                        help={formData.firstName.errorMsg}
                    >
                        <Input value={formData.firstName.value} name={"firstName"} onChange={handleOnChange} />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        hasFeedback
                        validateStatus={formData.email.validateStatus}
                        help={formData.email.errorMsg}
                    >
                        <Input value={formData.email.value} name={"email"} onChange={handleOnChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item >
                <Button primary htmlType="submit">
                    Submit
               </Button>
            </Form.Item>
        </Form >
    );
};

export default FormManualValidation