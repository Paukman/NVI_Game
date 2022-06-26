/* eslint-disable */
import React from "react"
import { Form, Input } from "antd";
import { Button } from "../Components";

import {
    MailOutlined,
    UserOutlined,
} from '@ant-design/icons';

const FormBasicValidation = () => {
    const onFinish = values => {
        console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            layout={"vertical"}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password iconRender={(visible) => visible ? <span>Hide </span> : <span>Show </span>} />
            </Form.Item>
            <Form.Item >
                <Button primary htmlType="submit">
                    Submit
               </Button>
            </Form.Item>
        </Form>
    );
};

export default FormBasicValidation