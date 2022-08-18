import styled from "styled-components";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export const StyledSwitch = styled(SwitchPrimitive.Root)`
    all: unset;
    width: 44px;
    height: 22px;
    background-color: ${({ theme }) => theme?.switch?.bg};
    border-radius: 9999px;
    position: relative;
    box-shadow: 0 2px 10px ${({ theme }) => theme?.switch?.shadow};
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    transition: box-shadow 0.5s ease;
    &:focus {
        box-shadow: 0 0 0 2px #d9d9d9;
    }
    &[data-state="checked"] {
        background-color: ${({ color, theme }) => (color ? color : theme?.switch?.color)};
    }
    &:hover {
        cursor: pointer;
    }
`;

export const StyledThumb = styled(SwitchPrimitive.Thumb)`
    display: block;
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 9999px;
    box-shadow: 0 2px 2px ${({ theme }) => theme?.switch?.shadow};
    transition: transform 0.3s ease;
    transform: translateX(2px);
    will-change: transform;
    &[data-state="checked"] {
        transform: translateX(24px);
    }
`;
