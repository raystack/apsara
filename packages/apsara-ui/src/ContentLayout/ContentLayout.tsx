import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Layout } from "./ContentLayout.styles";

const { Sider, Content } = Layout;

interface ContentLayoutProps {
    style?: React.CSSProperties;
    className?: string;
    children?: any;
    siderProps?: any;
}

const ContentLayout = ({ children, style, className, siderProps = {} }: ContentLayoutProps) => {
    const theme = useContext(ThemeContext);
    const { siderStyle = { background: theme?.colors?.transparent }, ...restSiderProps } = siderProps;
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
                <Sider width={theme?.contentLayout?.sidebarWidth} style={siderStyle} {...restSiderProps}>
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
