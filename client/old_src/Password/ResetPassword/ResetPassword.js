import React from "react";
import { Col, Row, Typography, Divider, Layout } from "antd";
import { AtbJewel } from "assets/icons";
import PasswordValidationForm from "../PasswordValidation/PasswordValidationForm";
import { LoginBrandArea, TopBrandArea } from "../LoginBrandArea";
import "./styles.less";

const { Title } = Typography;
const { Content } = Layout;

const ResetPassword = () => {
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Content>
        <Row>
          <Col xs={24} sm={0}>
            <TopBrandArea />
          </Col>
        </Row>
        <Row justify="center">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 10 }}
            xl={{ span: 8 }}
          >
            <div className="password-reset-container">
              <Row justify="center">
                <Col>
                  <AtbJewel />
                </Col>
              </Row>
              <Row align="bottom" className="margin-top-20" justify="center">
                <Col>
                  <Title level={3}>Reset password</Title>
                </Col>
              </Row>
              <Divider className="margin-top-2 margin-bottom-32" />
              <PasswordValidationForm />
            </div>
          </Col>
          <Col
            xs={{ span: 0 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 14 }}
            xl={{ span: 16 }}
          >
            <LoginBrandArea />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ResetPassword;
