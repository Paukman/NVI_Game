/* eslint-disable */
import React from "react";

import { Row, Col, Card, Divider, Typography, Space } from "antd";

const { Title, Link, Text, Paragraph } = Typography;

const TypographyComponent = () => {
  return (
    <>
      <Divider
        orientation="left"
        style={{ color: "#005EB8", fontWeight: "normal" }}
      >
        Typography
      </Divider>
      <Row className="margin-bottom-10">
        <Col lg={{ span: 24 }}>
          <Card title="Title Component">
            <Title>H1 Text</Title>
            <Title level={2}> H2 Text</Title>
            <Title level={3}> H3 Text</Title>
            <Title level={4}> H4 Text</Title>
            <Title level={5}> H5 Text</Title>
          </Card>
        </Col>
      </Row>
      <Row className="margin-bottom-10">
        <Col lg={{ span: 24 }}>
          <Card title="Text Component">
            <Space direction="vertical">
              <Text>Contact us (default)</Text>
              <Text type="secondary">Contact us (secondary)</Text>
              <Text type="warning">Contact us (warning)</Text>
              <Text type="danger">Contact us (danger)</Text>
              <Text disabled>Contact us (disabled)</Text>
              <Text mark>Contact us (mark)</Text>
              <Text code>Contact us (code)</Text>
              <Text keyboard>Contact us (keyboard)</Text>
              <Text underline>Contact us (underline)</Text>
              <Text delete>Contact us (delete)</Text>
              <Text strong>Contact us (strong)</Text>
              <Link href={null}>Contact us (link)</Link>
            </Space>
          </Card>
        </Col>
      </Row>
      <Row className="margin-bottom-10">
        <Col lg={{ span: 24 }}>
          <Card title="Paragraph Component">
            <Space direction="vertical">
              <Text>
                Paragraph with ellipsis and expandable with symbol 'more'
              </Text>
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
              >
                You’ve got a busy life, don’t let banking get in the way of it.
                Open an account in just a few minutes and bank whenever,
                wherever and however you like. We’ve got what you need. We love
                to simplify investing because it makes reaching your savings and
                retirement goals that much easier. The future may seem far off.
                Spoiler alert: it's not. But we can help.
              </Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TypographyComponent;
