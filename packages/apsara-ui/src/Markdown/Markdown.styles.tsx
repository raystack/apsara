import styled from "styled-components";
import { textStyles } from "../mixin";

export const Wrapper = styled.div`
    // list
    ol {
        list-style: none;
        padding: 0;

        li {
            margin-top: 8px;
            padding: 0px 16px 0px 16px;

            :first-child {
                margin-top: 0;
            }
        }

        ul {
            ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.markdown?.text, "0.35px")}
            padding: 0;
            list-style: none;
            li {
                padding: 0;
                line-height: 1em;
            }
        }
    }

    p {
        &:first-child {
            padding-top: 22px;
        }

        ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.markdown?.text, "0.35px")}
        letter-spacing: 0.35px;
        line-height: 1.35; // ? text looks congested without line-height
    }

    a,
    p:first-child {
        ${({ theme }) => textStyles(theme?.fontSizes[1], theme?.markdown?.heading, "0.35px", "bold")}
        margin-bottom: 8px;
    }
    a {
        color: ${({ theme }) => theme?.markdown?.link} !important;
    }
`;
