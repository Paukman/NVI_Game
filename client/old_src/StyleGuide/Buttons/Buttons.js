/* eslint-disable */
import React, { useState } from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import { Button } from "../Components";
import "./styles.less"


import {
    RetweetOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography
const Buttons = () => {
    const [saving, setSaving] = useState(false)

    const handleOnClick = () => {
        if (!saving) {
            setSaving(true)
        }
        setTimeout(() => {
            setSaving(false)
        }, 3000)
    }

    return (<>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Primary</Title>
                        <Text>md- xxl breakpoints</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button primary>Default</Button>
                            <Button primary className={"btn-primary-hover"}>Hover</Button>
                            <Button primary className={"btn-primary-active"}>Pressed</Button>
                            <Button primary loading>Loading</Button>
                            <Button primary loading></Button>
                            <Button primary disabled>Disabled</Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Primary</Title>
                        <Text>xs - sm breakpoints, or restricted containers</Text>
                    </Space>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button primary block>Default</Button>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button primary block className={"btn-primary-hover"}>Hover</Button>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button primary block className={"btn-primary-active"}>Pressed</Button>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button primary block loading>Loading</Button>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button primary block loading></Button>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button primary block disabled>Disabled</Button>
                            </Col>
                        </Row>
                    </Card>
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Secondary</Title>
                        <Text>md- xxl breakpoints</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button secondary>Default</Button>
                            <Button secondary className={"btn-secondary-hover"}>Hover</Button>
                            <Button secondary className={"btn-secondary-active"}>Pressed</Button>
                            <Button secondary loading>Loading</Button>
                            <Button secondary loading block></Button>
                            <Button secondary disabled>Disabled</Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Secondary</Title>
                        <Text>xs - sm breakpoints, or restricted containers</Text>
                    </Space>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button secondary block>Default</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button secondary block className={"btn-secondary-hover"}>Hover</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button secondary block className={"btn-secondary-active"}>Pressed</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button secondary block loading>Loading</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button secondary block loading></Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button secondary block disabled>Disabled</Button>
                            </ Col>
                        </Row>
                    </Card>
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Text</Title>
                        <Text>States</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button text>Default</Button>
                            <Button text className={"btn-text-hover"}>Hover</Button>
                            <Button text className={"btn-text-active"}>Pressed</Button>
                            <Button text loading>Loading</Button>
                            <Button text loading></Button>
                            <Button text disabled>Disabled</Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Text</Title>
                        <Text>xs - sm breakpoints, or restricted containers</Text>
                    </Space>
                    <Card>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button text block>Default</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button text block className={"btn-text-hover"}>Hover</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button text block className={"btn-text-active"}>Pressed</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button text block loading>Loading</Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button text block loading></Button>
                            </ Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col lg={24}>
                                <Button text block disabled>Disabled</Button>
                            </ Col>
                        </Row>
                    </Card>
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Link</Title>
                        <Space direction="vertical">
                            <Card>
                                <Button size="sm-link" link>Small 12px</Button>
                            </Card>
                            <Card>
                                <Button link>Medium 14px</Button>
                            </Card>
                            <Card>
                                <Button size="lg-link" link>Large 16px</Button>
                            </Card>
                        </Space>
                    </Space>
                </Card>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Link Loading</Title>
                        <Space direction="vertical">
                            <Card>
                                <Button size="sm-link" loading link >Small 12px</Button>
                            </Card>
                            <Card>
                                <Button loading link >Medium 14px</Button>
                            </Card>
                            <Card>
                                <Button size="lg-link" loading link>Large 16px</Button>
                            </Card>
                        </Space>
                    </Space>
                </Card>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Icon Link</Title>
                        <Space direction="vertical">
                            <Card>
                                <Button size="sm-link" onClick={handleOnClick} loading={saving} link icon={<RetweetOutlined />}>Small 12px</Button>
                            </Card>
                            <Card>
                                <Button size="md-link" onClick={handleOnClick} loading={saving} link icon={<RetweetOutlined />}>Medium 14px</Button>
                            </Card>
                            <Card>
                                <Button size="lg-link" loading={saving} onClick={handleOnClick} link icon={<RetweetOutlined />}>Large 16px</Button>
                            </Card>
                        </Space>
                    </Space>
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Un-Clickable state</Title>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button block primary unclickable>Primary</Button>
                            <Button block secondary unclickable >Secondary</Button>
                            <Button block text unclickable >Text</Button>
                            <Button size="sm-link" link unclickable >Small Link</Button>
                            <Button size="md-link" link unclickable >Medium Link</Button>
                            <Button size="lg-link" link unclickable >Large Link</Button>
                            <Button block primary unclickable loading></Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
        </Row>
    </>)
};
export default Buttons;
