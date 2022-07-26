import styled from "styled-components";
import { textStyles } from "../mixin";



export const StyledTag = styled('div')<{ type: "round" | "rect" , color: string, closable: boolean, icon: boolean}>`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    ${({ theme }) => textStyles("11px", theme?.tag?.text, "0.11px", "normal")}
    border-radius: ${({ type }) => (type === "round" ? "10.5px" : "2px")};
    border-color: ${({color}) => color};
    border-width: 1px;
    border-style: solid;
    background-color: ${({color}) => color};
    padding: 3px ${({closable})=> closable?"0px":"10px" } 3px ${({icon})=> icon?"0px":"10px" };
`;

