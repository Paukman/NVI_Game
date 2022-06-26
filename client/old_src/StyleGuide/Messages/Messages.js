/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import useIsMounted from "utils/hooks/useIsMounted";
import { Button, MessageContext } from "../Components";

const { Title, Text } = Typography

import {
    CheckCircleOutlined,

} from '@ant-design/icons';

const Messages = () => {
    const { show } = useContext(MessageContext);
    const [timer, setTimer] = useState(0);
    const isMounted = useIsMounted();
    const timerId = useRef()
    const time = useRef()

    const run = (duration) => {
        if (timerId.current) {
            clearInterval(timerId.current)
            timerId.current = null
        }
        time.current = duration
        setTimer(time.current)
        timerId.current = setInterval(() => {
            time.current = time.current - 1
            if (time.current === 0 || time.current < 0) {
                time.current = 0
                clearInterval(timerId.current)
                timerId.current = null
                return
            }
            setTimer(time.current)
        }, 1000)
    }

    const handleOnClose = () => {
        clearInterval(timerId.current)
        timerId.current = null
        if (isMounted()) {
            time.current = 0
            setTimer(0)
        }
    }

    useEffect(() => {
        return () => {
            clearInterval(timerId.current)
        }
    }, [])


    return (<>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Default</Title>
                        <Text>s - xxl breakpoints - width based on message</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button primary block onClick={() => show({ type: "success", content: "This is a success message.", duration: 1000 })}> Success</Button>
                            <Button primary block onClick={() => show({ type: "info", content: "This is a informational message.", duration: 1000 })}>Info</Button>
                            <Button primary block onClick={() => show({ type: "warning", content: "This is a warning message.", duration: 1000 })}>Warning</Button>
                            <Button primary block onClick={() => show({ type: "error", content: "This is a error message.", duration: 1000 })}>Error</Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
            <Col sx={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Title level={4}>Duration</Title>
                        <Text level={4}><CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />A Message will self-dismiss after allowed time</Text>
                        <Text>3 sec under 17 char(approx one line in mobile)</Text>
                        <Text>6 sec between 17 - 32 char</Text>
                        <Text>10 sec over 32 char</Text>
                        <Text type="danger">Duration time in seconds : {timer}</Text>
                        <Card>
                            <Space direction="vertical">
                                <Button primary block onClick={() => {
                                    run(3)
                                    show({ type: "info", content: "Payee added.", onClose: handleOnClose })
                                }}>Info</Button>
                                <Button primary block onClick={() => {
                                    run(6)
                                    show({ type: "success", content: "We've sent the code to <device>.", onClose: handleOnClose })
                                }}>Success</Button>
                                <Button primary block onClick={() => {
                                    run(10)
                                    show({ type: "error", content: "We've sent the code to this house phone number by automated phone call.", onClose: handleOnClose })
                                }}>Error</Button>
                            </Space>
                        </Card>
                    </Space>
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Text>sm - xxl have max width of 536px to fit within the sm breakpoint</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">

                            <Button primary block onClick={() => show({ type: "warning", content: "Sm-Xl This is a very long message and is not encouraged, as you only have time to read and understand it once.", duration: 1000 })}>Warning</Button>
                            <Button primary block onClick={() => show({ type: "warning", content: "SXS Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae porttitor leo. Nulla mattis pellentesque eros eu placerat.", duration: 1000 })}>Warning</Button>
                            <Button primary block onClick={() => show({ type: "success", content: "OK", duration: 1000 })}>Small</Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Text>xs breakpoint - width based on space available.</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button primary block onClick={() => show({ type: "success", content: "This is a success message.", duration: 1000 })}> Success</Button>
                            <Button primary block onClick={() => show({ type: "info", content: "This is a informational message.", duration: 1000 })}>Info</Button>
                            <Button primary block onClick={() => show({ type: "warning", content: "This is a warning message.", duration: 1000 })}>Warning</Button>
                            <Button primary block onClick={() => show({ type: "error", content: "This is a error message.", duration: 1000 })}>Error</Button>
                        </Space>
                    </Card>
                </Card>
            </Col>
        </Row>
        <Row gutter={[16, 16]}>
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Text>Messages do not have to be read or acknowledged, so make sure do not block navigational elements</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button primary block onClick={() => {
                                show({ type: "success", content: "New recipient added", top: snackbarTop, duration: 1000 })
                            }
                            }>Success</Button>

                        </Space>
                    </Card>
                </Card>
            </Col>
            {/* 
            // for now, for devs only
            <Col sm={{ span: 24 }} lg={{ span: 8 }}>
                <Card>
                    <Space direction="vertical">
                        <Text>Use native ANT interactions for launching multiple elements</Text>
                    </Space>
                    <Card>
                        <Space direction="vertical">
                            <Button primary block onClick={() => {
                                show({ type: "success", content: "We’ve sent the code to <device> by <method>.", top: snackbarTop, duration: 1000 })
                                setTimeout(() => {
                                    show({ type: "success", content: "We've sent the code to this house phone number by automated phone call.", duration: 1000 })
                                }, 1000)

                            }
                            }> Launch Multiple</Button>

                        </Space>
                    </Card>
                </Card>
            </Col>
            */}
        </Row>

    </>)
};
export default Messages;
