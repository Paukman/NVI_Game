/* eslint-disable */
import React, { useContext } from "react";
import { Form, Typography, Card } from "antd";
import { Input, Button } from "../Components"
import { DataContext } from "./DataProvider";
const { Text } = Typography

const FormTwo = ({ form }) => {
    const { data } = useContext(DataContext);
    const { saving } = data;

    return (
        <Card>
            <Text>Entered Name: {form.getFieldValue("name")}</Text>
            <Form
                name="formTwo"
                layout={"vertical"}
                form={form}>
                <Form.Item
                    label="email"
                    name="email"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button primary loading={saving} htmlType="submit">
                        {saving ? "Saving" : "Submit"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default FormTwo;
