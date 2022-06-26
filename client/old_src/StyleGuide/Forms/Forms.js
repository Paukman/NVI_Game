/* eslint-disable */
import React from "react";
import "./styles.less"
import { Row, Col, Card, Divider, Form, Typography, Space, Input as AntInput } from "antd";
import { Input, FormIconError, DatePicker } from "../Components"
import {
    CheckCircleOutlined,
    StopOutlined,
    LoadingOutlined,
    MailOutlined,
    PoundOutlined,
    PayCircleOutlined,
    DollarOutlined,
    BugOutlined,
    CalendarOutlined,
    FireOutlined
} from '@ant-design/icons';
const { Title, Text } = Typography



const Forms = () => {
    const rowProps = { gutter: [{ xs: 8, sm: 16 }, 1] };
    const colProps = {
      xs: { offset: 1, span: 22 },
      md: { offset: 2, span: 21 }
    };
  
    const { TextArea } = AntInput;

    return (
        <>
        <Card>
        <Form layout="vertical">
            <Row {...rowProps}>
                <Col {...colProps}>
                    <Space direction="vertical" size="large">
                        <Title level={3}>An example form using antd Form</Title>
                    </Space>
                </Col>
            </Row>
            <Row {...rowProps}>
                <Col {...colProps}>
                    <MailOutlined className="form-icon" />
                    <Form.Item label="Test Label" help="some helper text"><AntInput size="large" allowClear/></Form.Item>
                </Col>
            </Row>
            <Row {...rowProps}>
                <Col {...colProps}>
                    <MailOutlined className="form-icon" />
                    <Form.Item label="A text area" help="some helper text">
                        <TextArea rows={4} />
                    </Form.Item>
                </Col>
            </Row>
            <Row {...rowProps}>
                <Col {...colProps}>
                    <CalendarOutlined className="form-icon" />
                    <Form.Item label="From date" help="pick the start date">
                        <DatePicker className="fixed-width" />
                    </Form.Item>
                </Col>
            </Row>
            <Row {...rowProps}>
                <Col {...colProps}>
                    <CalendarOutlined className="form-icon" />
                    <Form.Item label="End date" help="you must select a date" validateStatus="error">
                        <DatePicker className="fixed-width" />
                    </Form.Item>
                </Col>
            </Row>
            <Row {...rowProps}>
                <Col {...colProps}>
                    <DollarOutlined className="form-icon" />
                    <Form.Item label="A Small Amount Field">
                        <AntInput className="fixed-width" prefix="$" suffix="CAD" size="large" />
                    </Form.Item>
                </Col>
            </Row>
            <Row {...rowProps} className="read-only">
                <Col {...colProps}>
                    <FireOutlined className="form-icon" />
                    <Form.Item label="A read only field">
                        <Text>Testing putting a label in as read only</Text>
                    </Form.Item>
                </Col>
            </Row>
            <Row {...rowProps}>
                <Col {...colProps}>
                    <BugOutlined className="form-icon" />
                    <Form.Item label="An error field" help="fix the issues with this" validateStatus="error"><AntInput size="large"/></Form.Item>
                </Col>
            </Row>
        </Form>
        </Card>

            <Row gutter={[16, 16]}>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Basic</Title>
                            <Text>Input</Text>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Label"
                                    help={"Helper text"}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Active / In focus</Title>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Label"
                                    help={"Helper text"}
                                >
                                    <Input className="ant-input-focus" defaultValue="text" />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Error</Title>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    validateStatus={"error"}
                                    label="Label"
                                    help={<FormIconError>Error</FormIconError>}
                                >
                                    <Input defaultValue="text" />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Text level={4}><CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />Allow for up to 3 lines of helper text if required </Text>
                            <Card>
                                <Form layout="vertical">
                                    <Form.Item
                                        label="Account Number"
                                        help={<Text>Lorem Ipsum Please check your bill or statement to find the relevant account number and enter it above</Text>}
                                    >
                                        <Input defaultValue="text" />
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Space>
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
                            <Form layout="vertical">
                                <Form.Item
                                    label="Label"
                                >
                                    <Input staticInput defaultValue="text" />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Disabled</Title>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Label"
                                >
                                    <Input disabled defaultValue="text" />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Text level={4}><CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />Allow for up to 3 lines of error text if required </Text>

                            <Card>
                                <Form layout="vertical">
                                    <Form.Item
                                        validateStatus={"error"}
                                        label="Label"
                                        help={<FormIconError><Text type="danger">Lorem ipsum dolor sit amet,
                                            consectetur  dolor sit amet,
                                            consectetur adipiscing elit ullam nulla ligul finibus.Lorem ipsum dolor sit amet,
                                        consectetur  dolor sit amet.</Text></FormIconError>}>
                                        <Input defaultValue="text" />
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Space>
                    </Card>
                </Col>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Password Box</Title>
                            <Text>Input</Text>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Password"
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Text level={4}><CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />Allow for up to 3 lines of error text if required </Text>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    validateStatus={"error"}
                                    label="Label"
                                    help={<>
                                        <Space direction="vertical" size={10} >
                                            <Text type="danger">Error</Text>

                                            <Row>

                                                <Col span={24}>
                                                    <Space direction="horizontal" align={"start"}>
                                                        <CheckCircleOutlined
                                                            style={{ color: "green", fontSize: "16px" }} /><Text>The password should be 6 characters!</Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Space direction="horizontal" align={"start"}>
                                                        <StopOutlined style={{ color: "red", fontSize: "16px" }} /><Text>The password should contain at least one special character!</Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Space direction="horizontal" align={"start"}>
                                                        <LoadingOutlined style={{ color: "grey", fontSize: "16px" }} /><Text>Verifying password please wait!</Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Space>

                                    </>}>
                                    <Input.Password defaultValue="123456" />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Text level={4}><CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />Input and icon</Text>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    className={"margin-left-50"}
                                    label="Label"
                                    help={"Helper text"}>
                                    <Input defaultValue="text" prefix={<Input.PrefixLeftIcon component={MailOutlined} />} />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Prefix and Suffix</Title>
                            <Text>Input</Text>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Amount"
                                    help={"Helper text"}
                                >
                                    <Input prefix={<Input.PrefixText>$</Input.PrefixText>} />
                                </Form.Item>
                                <Form.Item
                                    label="Amount"
                                    help={"Helper text"}
                                >
                                    <Input prefix={<Input.PrefixText>$</Input.PrefixText>} defaultValue="20.00" suffix={<Input.SuffixText>CAD</Input.SuffixText>} />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Active / In focus</Title>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Amount"
                                    help={"Helper text"}
                                >
                                    <Input prefix={<Input.PrefixText>$</Input.PrefixText>} defaultValue="300" suffix={<Input.SuffixText>USD</Input.SuffixText>} />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Card>
                        <Space direction="vertical">
                            <Title level={4}>Prefix and Suffix with icons</Title>
                            <Text>Input</Text>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    label="Amount"
                                    help={"Helper text"}
                                >
                                    <Input prefix={<LoadingOutlined className="margin-right-4" style={{
                                        width: 18,
                                        height: 18
                                    }} />}
                                        suffix={<LoadingOutlined className="margin-right-4" style={{
                                            width: 18,
                                            height: 18
                                        }} />} />
                                </Form.Item>
                                <Form.Item
                                    label="Amount"
                                    help={"Helper text"}
                                >
                                    <Input prefix={<PoundOutlined className="margin-right-4" style={{
                                        width: 18,
                                        height: 18
                                    }} />} defaultValue="20.00" suffix={<PayCircleOutlined style={{
                                        width: 18,
                                        height: 18
                                    }} />} />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default Forms;
