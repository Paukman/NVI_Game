import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Typography } from "antd";
import PageHeader from "Common/PageHeader";
import { Input, Button } from "StyleGuide/Components";
import { User, Email } from "StyleGuide/Components/Icons";
import { validateEmail, validateName } from "./utils";
import useProfile from "./useProfile";

const { Text } = Typography;

const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 7 },
    lg: { span: 5 }
  }
};

const colLayout = {
  wrapperCol: {
    xs: { span: 24 }
  }
};
const xsProp = {
  offset: 1,
  span: 22
};
const smProp = {
  offset: 1,
  span: 22
};
const mdProp = {
  offset: 2,
  span: 20
};

const InteracUserProfile = ({ next }) => {
  InteracUserProfile.propTypes = {
    next: PropTypes.func.isRequired
  };
  const [form] = Form.useForm();
  const { profile, createProfile } = useProfile();

  const onFinish = async values => {
    const error = await createProfile(values);
    if (!error) {
      next();
    }
  };

  return (
    <Row>
      <Col xs={xsProp} sm={smProp} md={mdProp}>
        <PageHeader>
          Create <i>Interac</i> Profile
        </PageHeader>
        <Text>
          Your profile lets <em>Interac</em> and your recipients know who is
          sending or requesting funds by <em>Interac</em> e-Transfer.
        </Text>
        <Form
          className="margin-top-20 max-width-600 form-bottom-space"
          layout="vertical"
          form={form}
          onFinish={onFinish}
          hideRequiredMark
        >
          <Form.Item
            label="Name"
            className="input-group padding-bottom-4"
            {...colLayout}
          >
            <User className="input-group-icon" />
            <Form.Item
              name="name"
              noStyle
              rules={[{ validator: validateName }]}
            >
              <Input maxLength={80} />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Email" className="input-group" {...colLayout}>
            <Email className="input-group-icon" />
            <Form.Item
              name="email"
              noStyle
              rules={[{ validator: validateEmail }]}
            >
              <Input maxLength={60} />
            </Form.Item>
          </Form.Item>

          <Form.Item {...tailLayout} className="padding-top-30">
            <Button primary block htmlType="submit" loading={profile.saving}>
              {profile.saving ? null : "Next"}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default InteracUserProfile;
