/* eslint-disable */
/* eslint-disable */
import React from "react";
import { Form, Typography, Card } from "antd";
import { Button } from "../Components"
const { Text } = Typography;

const FormThree = ({ form }) => {
    return (
        <Card>
            <Text>Overview</Text>
            <Form
                name="formThree"
                form={form}>
                <Text>Name: {form.getFieldValue("name")}</Text>
                <br />
                <Text>Email: {form.getFieldValue("email")}</Text>
                <Form.Item>
                    <Button primary htmlType="submit">
                        Start Over
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default FormThree;
