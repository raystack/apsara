import { Button as AntButton } from "antd";
import { NativeButtonProps } from "antd/lib/button/button";
import * as React from "react";
import styled from "styled-components";

const Button: React.FC<NativeButtonProps> = styled(AntButton)`
  // custom-props
`;
export default Button;
