/* eslint-disable */
import React, { useContext, useCallback } from "react";
import { Form, Row, Col, Steps, Card, Modal } from "antd";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import FormThree from "./FormThree"
import { DataContext } from "./DataProvider";
import useBackButton from "./useBackButton"
const { Step } = Steps

const steps = {
    ["one"]: 0,
    ["two"]: 1,
    ["three"]: 2
}

const FormPageProvider = () => {
    const {
        goToPage,
        blockLocation,
        blockClosingBrowser,
        onCommit,
        promptState,
        onCancel,
        data
    } = useContext(DataContext);
    // ^ the prompt can come from the hook/provider or can be accessed directly here
    // coming from the hook can simplify commit calls. the important thing is to accessed it in one place

    const [formOne] = Form.useForm();
    const [formTwo] = Form.useForm();
    const [formThree] = Form.useForm();

    const handleGoBack = useCallback(() => {
        alert(`back buton clicked will redirect to buttons page`)
    }, [])
    const goingBack = useBackButton(handleGoBack)

    const { showModal } = promptState
    const onFormChange = () => {
        blockLocation()
        blockClosingBrowser()
    }

    const onFormFinish = async (name, { values, forms }) => {
        const { formOne, formTwo, formThree } = forms;
        if (name === "formOne") {
            onCommit()
            const data = formOne.getFieldsValue()
            await goToPage(data, "two")
            formTwo.setFieldsValue({
                name: formOne.getFieldValue("name")
            });
        }
        if (name === "formTwo") {
            onCommit()
            const data = formOne.getFieldsValue()
            await goToPage(data, "three")
            formThree.setFieldsValue({
                name: formOne.getFieldValue("name"),
                email: formTwo.getFieldValue("email")
            });
        }
        if (name === "formThree") {
            await goToPage(data, "one")
            formOne.resetFields();
            formTwo.resetFields();
            formThree.resetFields();
        }
    };

    return (
        <>
            <Modal
                title="Are sure you wanna leave?"
                visible={showModal}
                onOk={() => onCommit()}
                onCancel={() => onCancel()}
            >
            </Modal>
            <Row>
                <Col span={18}>
                    <Card>
                        <Steps current={steps[data.page]} progressDot >
                            <Step title="Name" />
                            <Step title="Email" />
                            <Step title="Overview" />
                        </Steps>
                    </Card>
                    <Form.Provider onFormFinish={onFormFinish} onFormChange={onFormChange}>
                        <div style={{
                            display: data.page === "one" ? "block" : "none"
                        }}>
                            <FormOne form={formOne} />
                        </div>
                        <div style={{
                            display: data.page === "two" ? "block" : "none"
                        }}>
                            <FormTwo form={formTwo} />
                        </div>
                        <div style={{
                            display: data.page === "three" ? "block" : "none"
                        }}>
                            <FormThree form={formThree} />
                        </div>
                    </Form.Provider>
                </Col>
            </Row>
        </>
    );
};

export default FormPageProvider;
