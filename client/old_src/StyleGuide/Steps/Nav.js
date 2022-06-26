/* eslint-disable */
import React from "react"
import { Layout, Menu, Card } from 'antd';
import { Link } from "react-router-dom";
const { Sider } = Layout;

const Nav = ({ item }) => {
    return (
        <Card>
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0">
                    <Menu mode="inline" defaultSelectedKeys={[item]} selectedKeys={[item]}>
                        <Menu.Item key="form-one">
                            <span>Form One</span>
                            <Link to="/styles/form-steps/form-one" />
                        </Menu.Item>
                        <Menu.Item key="form-two">
                            <span>Form Two</span>
                            <Link to="/styles/form-steps/form-two" />
                        </Menu.Item>
                        <Menu.Item key="form-three">
                            <span>Form three</span>
                            <Link to="/styles/form-steps/form-three" />
                        </Menu.Item>
                    </Menu>
                </Sider>
            </Layout>
        </Card>)
}

export default Nav