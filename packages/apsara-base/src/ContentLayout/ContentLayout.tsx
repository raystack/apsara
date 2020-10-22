import React from "react";
import { Layout } from "antd";
import * as Theme from "../theme";

const { Sider, Content } = Layout;
const RIGHT_SIDEBAR_WIDTH = Theme["@datlantis-right-sidebar-width"];

interface ContentLayoutProps {
    style?: any;
    className?: any;
    children?: any;
    siderProps?: any;
}
const ContentLayout = ({
    children,
    style,
    className,
    siderProps: { siderStyle = { background: "#fff" }, ...restSiderProps },
}: ContentLayoutProps) => {
    const length = React.Children.count(children);
    const getContentStyle = () =>
        window.innerWidth <= 1680 ? { minWidth: "480px", maxWidth: "480px", flex: 1 } : { minWidth: "414px", flex: 1 };

    if (length === 1) {
        return (
            <Layout style={style} className={className}>
                <Content style={getContentStyle()}>{children}</Content>
            </Layout>
        );
    }
    if (length > 1) {
        return (
            <Layout style={style} className={className}>
                <Content>{children[0]}</Content>
                <Sider width={RIGHT_SIDEBAR_WIDTH} style={siderStyle} {...restSiderProps}>
                    {children[1]}
                </Sider>
            </Layout>
        );
    }

    return (
        <Layout style={style} className={className}>
            <Content>{children}</Content>
        </Layout>
    );
};

export default ContentLayout;
