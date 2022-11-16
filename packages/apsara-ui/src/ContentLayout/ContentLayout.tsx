import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Layout, MainContent, SidebarContent } from './ContentLayout.styles';

interface ContentLayoutProps {
    style?: React.CSSProperties;
    className?: string;
    children?: any;
    siderProps?: any;
}

const ContentLayout = ({ children, style, className, siderProps = {} }: ContentLayoutProps) => {
    const theme = useContext(ThemeContext);
    const { siderStyle = { background: theme?.colors?.transparent } } = siderProps;
    const length = React.Children.count(children);

    if (length === 1) {
        return (
            <Layout className={className}>
                {children}
            </Layout>
        );
    }
    if (length > 1) {
        return (
            <Layout className={className}>
                <MainContent className="mainContent">{children[0]}</MainContent>
                <SidebarContent className="sidebarContent" style={{ width: theme?.contentLayout?.sidebarWidth, ...siderStyle }}>{children[1]}</SidebarContent>
            </Layout>

        );
    }

    return (
        <Layout style={style} className={className}>
            <div>{children}</div>
        </Layout>
    );
};

export default ContentLayout;
