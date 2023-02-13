// import React from "react";
import { violet } from "@radix-ui/colors";
// import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
// import React from "react";
import styled from "styled-components";

export const Container = styled.div`
    font-size: 12px;
    width: fit-content;
    margin: -12px -16px;
`;

export const Content = styled.div`
    padding: 16px;
`;

export const Title = styled.div`
    font-weight: bold;
    letter-spacing: 0.3px;
    line-height: 16px;
    margin-bottom: 8px;
`;

export const Message = styled.div`
    min-height: 30px;
    letter-spacing: 0.3px;
`;

export const Footer = styled.div`
    padding: 12px 16px;
    border-top: 1px solid ${({ theme }) => theme?.colors?.black[4]};
    button {
        font-size: 12px;
    }
    button + button {
        margin-left: 16px;
    }
`;

export const StyledContent = styled(PopoverPrimitive.Content)`
    border-radius: 4px;
    padding: 20px;
    width: max-content;
    background-color: white;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    @media (prefers-reduced-motion: no-preference) {
        animation-duration: 400ms;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform opacity;
        &[data-state="open"] {
            &[data-side="top"] {
                animation-name: slideDownAndFade;
            }
            &[data-side="right"] {
                animation-name: slideLeftAndFade;
            }
            &[data-side="bottom"] {
                animation-name: slideUpAndFade;
            }
            &[data-side="left"] {
                animation-name: slideRightAndFade;
            }

            @keyframes slideDownAndFade {
                0% {
                    opacity: 0;
                    transform: translateY(-2px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideLeftAndFade {
                0% {
                    opacity: 0;
                    transform: translateX(2px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideUpAndFade {
                0% {
                    opacity: 0;
                    transform: translateY(2px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideRightAndFade {
                0% {
                    opacity: 0;
                    transform: translateX(-2px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        }
    }
`;

export const StyledArrow = styled(PopoverPrimitive.Arrow)`
    fill: white;
`;

const StyledClose = styled(PopoverPrimitive.Close)`
    all: unset;
    font-family: inherit;
    border-radius: 100%;
    height: 25px;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${violet.violet11};
    position: absolute;
    top: 5px;
    right: 5px;

    &:hover {
        background-color: ${violet.violet4};
    }
    &:focus {
        box-shadow: 0 0 0 2px ${violet.violet7};
    }
`;

// Exports
export const StyledPopover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = StyledClose;
