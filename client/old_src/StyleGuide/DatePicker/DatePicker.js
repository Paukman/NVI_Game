/* eslint-disable */
import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Row, Col, Card, Typography, Space, Form } from "antd";
import { DatePicker, FormIconError } from "../Components";
import "./styles.less"


const { Title, Text } = Typography

dayjs.extend(customParseFormat);

const DatePickerComponent = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Date Picker Modal</Title>
                        <Space direction="vertical">
                            <Row>
                                <Col><Text>XXL, XL, LG (Desktop)</Text></Col>
                                <Col>
                                    <div className={"xxl-xl-lg"}></div>
                                </Col>
                            </Row>
                            <Row>
                                <Col><Text>MD (Tablet)</Text></Col>
                                <Col>
                                    <div className={"md"}></div>
                                </Col>
                            </Row>
                            <Row>
                                <Col><Text>SM-XS</Text></Col>
                                <Col>
                                    <div className={"sm-xs"}></div>
                                </Col>
                            </Row>
                        </Space>
                        <Card>
                            <Form layout="vertical">
                                <DatePicker.CalendarIcon classNameGrid={"screen-size-palette"}>
                                    <Form.Item
                                        name={"date-two"}
                                        label="When (mmm/dd/yyyy)">
                                        <DatePicker defaultValue={dayjs("02-17-2020", "MM-DD-YYYY")} >Test</DatePicker>
                                    </Form.Item>
                                </DatePicker.CalendarIcon>
                                <DatePicker.CalendarIcon>
                                    <Form.Item
                                        name={"date-three"}
                                        label="When (mmm/dd/yyyy)"
                                        help={"Number of payments:#"}>
                                        <DatePicker defaultValue={dayjs("02-17-2020", "MM-DD-YYYY")} >Test</DatePicker>
                                    </Form.Item>
                                </DatePicker.CalendarIcon>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Inline error</Title>
                        <Card>
                            <Form layout="vertical">
                                <DatePicker.CalendarIcon>
                                    <Form.Item
                                        name={"date-four"}
                                        label="End date (mmm/dd/yyyy)"
                                        validateStatus={"error"}
                                        help={<FormIconError>Error</FormIconError>}>
                                        <DatePicker defaultValue={dayjs("02-17-2020", "MM-DD-YYYY")} >Test</DatePicker>
                                    </Form.Item>
                                </DatePicker.CalendarIcon>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Disabled</Title>
                        <Card>
                            <Form layout="vertical">
                                <DatePicker.CalendarIcon>
                                    <Form.Item
                                        name={"date-five"}
                                        label="End date (mmm/dd/yyyy)"
                                        help={"Number of payments:#"}>
                                        <DatePicker disabled defaultValue={dayjs("02-17-2020", "MM-DD-YYYY")} >Test</DatePicker>
                                    </Form.Item>
                                </DatePicker.CalendarIcon>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Default size no icon</Title>
                        <Card>
                            <Form layout="vertical">
                                <Form.Item
                                    name={"date-one"}
                                    label="When (mmm/dd/yyyy)">
                                    <DatePicker defaultValue={dayjs("02-17-2020", "MM-DD-YYYY")}>Test</DatePicker>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default DatePickerComponent;

