import styled from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

export const Overlay = styled(Dialog.Overlay)`
    background: ${(props) => props.style?.background && props.style.background}
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    overflow-y: auto;
`;

export const Content = styled(Dialog.Content)`
    width: ${(props) => props.style?.width};
    background: white;
    padding: 30px;
    border-radius: 4px;
`;

export const Title = styled(Dialog.Title)`
    display: flex;
    justify-content: space-between;
`;

export const CloseDiv = styled.div`
    float: right;
`;

export const HeadingWrapper = styled.div`
    display: inline-block;
    width: 100%;
`;
