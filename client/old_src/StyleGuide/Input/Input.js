/* eslint-disable */
import React from "react";
import "./styles.less"
import { Row, Col, Card, Typography, Space } from "antd";
import { Input } from "../Components"
import {
  CheckCircleOutlined,
  MailOutlined
} from '@ant-design/icons';
const { Title, Text } = Typography



const InputComponent = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>Basic</Title>
              <Text>Input</Text>
            </Space>
            <Card>
              <Input />
            </Card>
          </Card>
        </Col>
        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>Active / In focus</Title>
            </Space>
            <Card>
              <Input className="ant-input-focus" defaultValue="text" />
            </Card>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>Static</Title>
            </Space>
            <Card>
              <Input staticInput defaultValue="text" />
            </Card>
          </Card>
        </Col>
        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>Disabled</Title>
            </Space>
            <Card>
              <Input disabled defaultValue="text" />
            </Card>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Card>
            <Space direction="vertical">
              <Title level={4}>Password Box</Title>
              <Text>Input</Text>
            </Space>
            <Card>
              <Input.Password />
            </Card>
          </Card>
        </Col>
        <Col sm={{ span: 24 }} lg={{ span: 12 }}>
          <Card>
            <Space direction="vertical">
              <Text level={4}><CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />Input and icon</Text>
            </Space>
            <Card>
              <div className={"margin-left-50"}>
                <Input defaultValue="text" prefix={<MailOutlined className="input-inline-icon-left" />} />
              </div>
            </Card>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default InputComponent;
