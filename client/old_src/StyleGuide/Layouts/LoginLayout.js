/* eslint-disable react/prop-types */

import React from "react";
import { Col, Divider, Row, Typography, Layout } from "antd";
import "./styles.less";
import { AtbJewel } from "assets/icons";

const { Title } = Typography;
const { Content } = Layout;

const LoginLayout = ({ title = "", leftContent = "" }) => {
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Content>
        <Row>
          <Col xs={24} sm={0}>
            <div style={{ height: 40, backgroundColor: "#9756b3" }} />
          </Col>
        </Row>

        <Row style={{ minHeight: "100vh" }}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 10 }}
            xl={{ span: 9 }}
          >
            <Row>
              <Col
                offset={2}
                span={20}
                className="text-align-center padding-top-60"
              >
                <div className="login-layout-left">
                  <AtbJewel />

                  <Title className="margin-top-20" level={2}>
                    {title}
                  </Title>
                  <Divider style={{ margin: "10px 0px 20px" }} />
                  {/* <div style={{ height: 1200, backgroundColor: "red" }} /> */}
                  {leftContent}
                </div>
              </Col>
            </Row>

            <div style={{ textAlign: "center" }} />
          </Col>
          <Col
            xs={{ span: 0 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 14 }}
            xl={{ span: 15 }}
          >
            <Row
              className="login-layout-right"
              justify="space-around"
              align="middle"
            >
              <Col>
                <Title
                  style={{
                    padding: "0 80px",
                    color: "white",
                    textAlign: "center"
                  }}
                >
                  Welcome to ATB Personal Banking
                </Title>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginLayout;
