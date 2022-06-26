/* eslint-disable */
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Content, Sider, Header } = Layout;
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    MoreOutlined
} from '@ant-design/icons';

const LayoutPage = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)

    const toggle = () => {
        setCollapsed(!collapsed)
    }

    return (
        <Layout>
            <Sider trigger={null} theme="light" collapsible collapsed={collapsed}>
                <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1" icon={<MoreOutlined />}>
                        <span>Buttons</span>
                        <Link to="/styles/buttons" />
                    </Menu.Item>
                    <Menu.Item key="2" icon={<MoreOutlined />}>
                        <span>Input</span>
                        <Link to="/styles/input" />
                    </Menu.Item>
                    <Menu.Item key="3" icon={<MoreOutlined />}>
                        <span>Forms</span>
                        <Link to="/styles/forms" />
                    </Menu.Item>
                    <Menu.Item key="4" icon={<MoreOutlined />}>
                        <span>Message</span>
                        <Link to="/styles/message" />
                    </Menu.Item>
                    <Menu.Item key="5" icon={<MoreOutlined />}>
                        <span>Typography</span>
                        <Link to="/styles/typography" />
                    </Menu.Item>
                    <Menu.Item key="6" icon={<MoreOutlined />}>
                        <span>Date Picker</span>
                        <Link to="/styles/datepicker" />
                    </Menu.Item>
                    <Menu.Item key="7" icon={<MoreOutlined />}>
                        <span>Select</span>
                        <Link to="/styles/select" />
                    </Menu.Item>
                    <Menu.Item key="8" icon={<MoreOutlined />}>
                        <span>ReadOnly</span>
                        <Link to="/styles/readonly" />
                    </Menu.Item>
                    <Menu.Item key="9" icon={<MoreOutlined />}>                 
                        <span>Text Areas </span>
                        <Link to="/styles/textareas" />
                    </Menu.Item>
                    <Menu.Item key="10" icon={<MoreOutlined />}>
                        <span>Modals </span>
                        <Link to="/styles/modals" />
                    </Menu.Item>
                    <Menu.Item key="11" icon={<MoreOutlined />}>
                        <span>Form Steps </span>
                        <Link to="/styles/form-steps" />
                    </Menu.Item>
                    <Menu.Item key="12" icon={<MoreOutlined />}>
                        <span>Form Steps Pages </span>
                        <Link to="/styles/form-pages" />
                    </Menu.Item>
                    <Menu.Item key="13" icon={<MoreOutlined />}>
                        <span>Checkboxes </span>
                        <Link to="/styles/checkboxes" />
                    </Menu.Item>
                    <Menu.Item key="14" icon={<MoreOutlined />}>
                        <span>Skeleton</span>
                        <Link to="/styles/skeleton" />
                    </Menu.Item>  
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: "#fff", fontSize: "18px" }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        onClick: toggle,
                        style: { padding: "0 24px" }
                    })}
                </Header>
                <Content>
                    <div className="margin-10" style={{ height: "auto", overflowY: "scroll" }}>{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutPage;
