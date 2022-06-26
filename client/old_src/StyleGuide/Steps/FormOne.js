/* eslint-disable */
import React, { useContext, useEffect } from "react";
import { Form, Card, Skeleton } from "antd";
import { Input, Button } from "../Components"
import { DataContext } from "./DataProvider";

const FormOne = ({ form }) => {
    const { data } = useContext(DataContext);
    const { name, loading, saving } = data;

    useEffect(() => {
        form.setFieldsValue({
            name
        })// not great but initial form values can be set only once
    }, [name])
    return (

        <Card>

            <Skeleton loading={loading} active round paragraph={{ rows: 1 }}>
                <Form
                    name="formOne"
                    layout={"vertical"}
                    form={form}>
                    <Form.Item
                        label="name"
                        name="name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button primary loading={saving} htmlType="submit">
                            {saving ? "Saving" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Skeleton >
            {loading && <Skeleton.Button active shape="round" size="large" />}
        </Card>

    );
};

export default FormOne;
