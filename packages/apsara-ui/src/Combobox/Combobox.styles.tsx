import styled, { css } from "styled-components";
import Select from 'rc-select'

export const DropdownStyle = css`
    .rc-select{
        box-sizing: border-box;
        position: relative;
        vertical-align: middle;
        width: 100%;
    }

    .rc-select-dropdown-hidden{
        display: none;
    }

    .rc-select-dropdown{
        background-color: ${({theme})=>theme?.combobox?.dropdown};
        border: 1px solid ${({theme})=>theme?.combobox?.border};
        box-shadow: 0 0px 10px ${({theme})=>theme?.combobox?.border};
        border-radius: 2px;
        z-index: 99999;
        position: absolute;
    }

    .rc-select-item{
        padding: 5px;
        padding-left: 10px;
        width: 100%;
        color: ${({theme})=>theme?.combobox?.color}
    }

    .rc-select-item-option-active{
        background-color: ${({theme})=>theme?.combobox?.active};
        cursor: pointer;
        color: ${({theme})=>theme?.combobox?.activeClr};
    }

    .rc-select-item-option-selected{
        color: ${({theme})=>theme?.combobox?.optionClr};
        background-color: ${({theme})=>theme?.combobox?.optionBg};
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
    }

    .rc-select-focused{
        .rc-select-selector{
            border-color: ${({theme})=>theme?.combobox?.focus};
        }
    }

    .rc-select-dropdown-slide-enter,
    .rc-select-dropdown-slide-appear {
    animation-duration: .3s;
    animation-fill-mode: both;
    transform-origin: 0 0;
    opacity: 0;
    animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
    animation-play-state: paused;
    }
    .rc-select-dropdown-slide-leave {
    animation-duration: .3s;
    animation-fill-mode: both;
    transform-origin: 0 0;
    opacity: 1;
    animation-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.34);
    animation-play-state: paused;
    }
    .rc-select-dropdown-slide-enter.rc-select-dropdown-slide-enter-active.rc-select-dropdown-placement-bottomLeft,
    .rc-select-dropdown-slide-appear.rc-select-dropdown-slide-appear-active.rc-select-dropdown-placement-bottomLeft {
    animation-name: rcSelectDropdownSlideUpIn;
    animation-play-state: running;
    }
    .rc-select-dropdown-slide-leave.rc-select-dropdown-slide-leave-active.rc-select-dropdown-placement-bottomLeft {
    animation-name: rcSelectDropdownSlideUpOut;
    animation-play-state: running;
    }
    .rc-select-dropdown-slide-enter.rc-select-dropdown-slide-enter-active.rc-select-dropdown-placement-topLeft,
    .rc-select-dropdown-slide-appear.rc-select-dropdown-slide-appear-active.rc-select-dropdown-placement-topLeft {
    animation-name: rcSelectDropdownSlideDownIn;
    animation-play-state: running;
    }
    .rc-select-dropdown-slide-leave.rc-select-dropdown-slide-leave-active.rc-select-dropdown-placement-topLeft {
    animation-name: rcSelectDropdownSlideDownOut;
    animation-play-state: running;
    }
    @keyframes rcSelectDropdownSlideUpIn {
    0% {
        opacity: 0;
        transform-origin: 0% 0%;
        transform: scaleY(0);
    }
    100% {
        opacity: 1;
        transform-origin: 0% 0%;
        transform: scaleY(1);
    }
    }
    @keyframes rcSelectDropdownSlideUpOut {
    0% {
        opacity: 1;
        transform-origin: 0% 0%;
        transform: scaleY(1);
    }
    100% {
        opacity: 0;
        transform-origin: 0% 0%;
        transform: scaleY(0);
    }
    }
    @keyframes rcSelectDropdownSlideDownIn {
    0% {
        opacity: 0;
        transform-origin: 0% 100%;
        transform: scaleY(0);
    }
    100% {
        opacity: 1;
        transform-origin: 0% 100%;
        transform: scaleY(1);
    }
    }
    @keyframes rcSelectDropdownSlideDownOut {
    0% {
        opacity: 1;
        transform-origin: 0% 100%;
        transform: scaleY(1);
    }
    100% {
        opacity: 0;
        transform-origin: 0% 100%;
        transform: scaleY(0);
    }
    }

    

`

export const StyledMultiSelect = styled(Select)<{showInputIcon?:boolean}>`
    

    .rc-select-selection-search-input {
        width: auto;
        border: none;
        font-size: 100%;
        background: transparent;
        padding-left: 10px;
        outline: 0;

        ${({mode})=> (!mode || mode=='combobox') && 
            css`position:absolute;
            top:0;
            height:100%;
            z-index: 2;` }

        
    }

    .rc-select-selector {
        box-sizing: border-box;
        position:relative;
        min-height: 32px;
        box-sizing: border-box;
        display:flex;
        border-radius: 2px;
        align-items: center;
        z-index:1;
        background: transparent;
        border: 1px solid ${({theme})=>theme?.combobox?.border};
        padding-right:45px;
        overflow-x : hidden;

        &:hover{
            border-color:${({theme})=>theme?.combobox?.focus};
            cursor: pointer;
        }
    }

    .rc-select-selection-placeholder{
        position: absolute;
        top:0;
        left:0px;
        padding-left: 10px;
        display:flex;
        align-items:center;
        width:100%;
        height:100%;
        color: ${({theme})=>theme?.combobox?.placeholder};
    }

    .rc-select-selection-overflow{
        position: relative;
        z-index:2;
        width:100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: start;
        flex-wrap: wrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rc-select-selection-search-mirror{
        display: none;
    }

    .rc-select-selection-item{
        box-sizing: border-box;
        margin-left: 10px;
        
        
        ${({mode,theme})=> (mode=='multiple' || mode=='tags') ? 
            css`
                color:${theme?.combobox?.tagClr};
                background-color:${theme?.combobox?.tagBg};
                padding: 0px 6px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top:3px;
                margin-bottom:3px;
                border: 1px solid ${theme?.combobox?.border};
                border-radius: 2px;
                font-size : 12px;
            `:
            css`color: ${theme?.combobox?.color}`
        }
    }

    .rc-select-selection-item-remove-icon{
        margin-left: 3px;
        font-size: 17px;

        &:hover{
            cursor: pointer;
        }
    }

    .rc-select-clear{
        position: absolute;
        top:3px;
        right:20px;
        z-index: 3;
        &:hover{
            cursor: pointer;
        }

        .rc-select-clear-icon{
            font-size:17px;
        }
    }

    .rc-select-arrow{ 
        
        ${({showInputIcon,open,showSearch})=>!showInputIcon ? css`display: none` :
            open ? showSearch ? css`position: absolute;
                top:6px;
                right:20px;` 
                : 
                css`display: none;`
                :
                css`position: absolute;
                top:3px;
                right:20px;
                transform: rotate(90deg);
                `
        }       
    }
`

export const NotFoundContent = styled('div')`
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    z-index: 99999;
    margin-bottom : 0px;
`