import styled, {css} from 'styled-components'
import * as SelectPrimitive from '@radix-ui/react-select';

const StyledTrigger = styled(SelectPrimitive.SelectTrigger)`
    all: unset;
    display: inline-flex;
    align-items : center;
    justify-content: space-between;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 13px;
    line-height: 1px;
    height: 35px;
    gap: 5px;
    width:100%;
    box-sizing: border-box;
    background-color: ${({theme})=> theme?.select?.trigger?.bg};
    color: ${({theme})=>theme?.select?.trigger?.color};
    box-shadow: 0 2px 10px ${({theme})=>theme?.select?.trigger?.shadow};
    &:hover { 
      background-color: ${({theme})=>theme?.select?.trigger?.hover}; 
    }
    &:focus {
      box-shadow: 0 0 0 1px ${({theme})=>theme?.select?.trigger?.color};
    }

  `
  
const StyledContent = styled(SelectPrimitive.Content)`
    overflow: hidden;
    background-color: ${({theme})=> theme?.select?.bg};
    border-radius: 6px;
    box-shadow:
      0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  
  `
  
  const StyledViewport = styled(SelectPrimitive.Viewport)`
    padding: 5px;
  `
  
  const StyledItem = styled(SelectPrimitive.Item)`
    all: unset;
    font-size: 13px;
    line-height: 1px;
    color: ${({theme})=>theme?.select?.item?.color};
    border-radius: 3px;
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0 35px 0 25px;
    position: relative;
    user-select: none;
  
    &[data-disabled] {
      color: ${({theme})=>theme?.select?.item?.disabled};
      pointer-events: none;
    }
  
    &:focus {
      background-color: ${({theme})=>theme?.select?.item?.focusBg};
      color: ${({theme})=>theme?.select?.item?.focusColor};
    }
  
  `
  
  const StyledLabel = styled(SelectPrimitive.Label)`
    padding: 0 25px;
    font-size: 12px;
    line-height: 25px;
    color: ${({theme})=>theme?.select?.label};
  `
  
  const StyledSeparator = styled(SelectPrimitive.Separator)`
    height: 1px;
    background-color: ${({theme})=>theme?.select?.separator};
    margin: 5px;
  `
  
  const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator)`
    position: absolute;
    left: 0;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `
  
  const scrollButtonStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    background-color: ${({theme})=> theme?.select?.bg};
    color: ${({theme})=>theme?.select?.scroll};
    cursor: default;
  `
  
  const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton)`
    ${scrollButtonStyles}
  `;
  
  const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton)`
    ${scrollButtonStyles}
  `;
  
  export const SelectRoot = SelectPrimitive.Root;
  export const SelectTrigger = StyledTrigger;
  export const SelectValue = SelectPrimitive.Value;
  export const SelectIcon = SelectPrimitive.Icon;
  export const SelectContent = StyledContent;
  export const SelectViewport = StyledViewport;
  export const SelectGroup = SelectPrimitive.Group;
  export const SelectItem = StyledItem;
  export const SelectItemText = SelectPrimitive.ItemText;
  export const SelectItemIndicator = StyledItemIndicator;
  export const SelectLabel = StyledLabel;
  export const SelectSeparator = StyledSeparator;
  export const SelectScrollUpButton = StyledScrollUpButton;
  export const SelectScrollDownButton = StyledScrollDownButton;