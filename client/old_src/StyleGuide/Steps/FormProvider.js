/* eslint-disable */
import React, { useContext, useEffect, useCallback } from "react";
import { Form, Row, Col, Steps, Card, Modal } from "antd";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import FormThree from "./FormThree"
import { DataContext } from "./DataProvider";
import { useRouteMatch, useHistory } from "react-router-dom";
import useBackButton from "./useBackButton"


import Nav from "./Nav"
const { Step } = Steps

const steps = {
    ["form-one"]: 0,
    ["form-two"]: 1,
    ["form-three"]: 2
}


const FormProvider = () => {
    const {
        submitFormOne,
        submitFormTwo,
        blockLocation,
        blockClosingBrowser,
        onCommit,
        promptState,
        onCancel } = useContext(DataContext);
    // ^ the prompt can come from the hook/provider or can be accessed directly here
    // coming from the hook can simplify commit calls. the important thing is to accessed it in one place

    const match = useRouteMatch(`/styles/form-steps/:form`);
    const history = useHistory()
    const [formOne] = Form.useForm();
    const [formTwo] = Form.useForm();
    const [formThree] = Form.useForm();

    const handleGoBack = useCallback(() => {
        alert(`back buton clicked will redirect to buttons page`)
        history.push('/styles/buttons')

    }, [])
    const goingBack = useBackButton(handleGoBack)


    useEffect(() => { // this can be hidden in a hook
        if (!match) {
            history.push("/styles/form-steps/form-one") // go to the first form route by default
        }
    })
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
            await submitFormOne(data)
            formTwo.setFieldsValue({
                name: formOne.getFieldValue("name")
            });
        }
        if (name === "formTwo") {
            onCommit()
            const data = formOne.getFieldsValue()
            await submitFormTwo(data)
            formThree.setFieldsValue({
                name: formOne.getFieldValue("name"),
                email: formTwo.getFieldValue("email")
            });
        }
        if (name === "formThree") {
            onCommit()
            history.push("/styles/form-steps/form-one")
            formOne.resetFields();
            formTwo.resetFields();
            formThree.resetFields();
        }
    };

    if (!match) {
        return null
    }

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
                <Col span={6}>
                    <Nav item={match.params.form} />
                </Col>
                <Col span={18}>
                    <Card>
                        <Steps current={steps[match.params.form]} progressDot>
                            <Step title="Name" />
                            <Step title="Email" />
                            <Step title="Overview" />
                        </Steps>
                    </Card>
                    <Form.Provider onFormFinish={onFormFinish} onFormChange={onFormChange}>
                        <div style={{
                            display: match.params.form === "form-one" ? "block" : "none"
                        }}>
                            <FormOne form={formOne} />
                        </div>
                        <div style={{
                            display: match.params.form === "form-two" ? "block" : "none"
                        }}>
                            <FormTwo form={formTwo} />
                        </div>
                        <div style={{
                            display: match.params.form === "form-three" ? "block" : "none"
                        }}>
                            <FormThree form={formThree} />
                        </div>
                    </Form.Provider>
                </Col>
            </Row>
        </>
    );
};

export default FormProvider;
