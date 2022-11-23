import styled from "styled-components";

export const Layout = styled.div`
    display: flex;
    box-sizing: border-box;
    background: transparent;
    height: inherit;
    flex: auto;
`;

export const MainContent = styled.div`
    flex: auto;
    min-height: 0;
    box-sizing: border-box;
    width: 0;
`;

export const SidebarContent = styled.div`
    background: rgba(255, 255, 255, 0);
    flex: 0 0 310px;
    max-width: 310px;
    min-width: 310px;
    width: 310px;
    position: relative;
    transition: all 0.2s;
    box-sizing: border-box;
`;
