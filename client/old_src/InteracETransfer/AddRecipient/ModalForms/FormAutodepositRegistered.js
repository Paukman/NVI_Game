import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Form, Typography, Checkbox, Row, Col } from "antd";
import { Button } from "StyleGuide/Components";
import { AddRecipientContext } from "../AddRecipientProvider";

import { AUTODEPOSIT_REGISTERED_FORM } from "../utils";

const { Title, Text } = Typography;

const FormAutodepositRegistered = ({ form }) => {
  FormAutodepositRegistered.propTypes = {
    form: PropTypes.shape({}).isRequired
  };
  const { addRecipient } = useContext(AddRecipientContext);
  const { state } = addRecipient;
  return (
    <Form
      name={AUTODEPOSIT_REGISTERED_FORM}
      layout="vertical"
      form={form}
      initialValues={{
        saveRecipient: true
      }}
    >
      <Title level={5}>Autodeposit</Title>
      <Text className="font-size-14">
        {state.legalName} has registered for Autodeposit of funds sent by{" "}
        <em>Interac</em> e-Transfer, so a security question isn&apos;t required.
        This transaction can&apos;t be cancelled.
      </Text>
      <Form.Item
        name="saveRecipient"
        valuePropName="checked"
        className="checkbox-tap-height"
      >
        <Checkbox className="margin-top-20">
          Save recipient to contacts
        </Checkbox>
      </Form.Item>
      <Row data-testid="addRecipient">
        <Col xs={24} sm={10}>
          <Button
            primary
            block
            htmlType="submit"
            loading={state.loadingAddRecipient}
          >
            {state.loadingAddRecipient ? null : "Add recipient"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default FormAutodepositRegistered;
