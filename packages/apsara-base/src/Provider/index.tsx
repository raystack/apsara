import React from "react";
import "../../styles/app.less";
import { createGlobalStyle } from "styled-components";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoItalic from "../../assets/fonts/Roboto-Italic.ttf";
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";
import RobotoBoldItalic from "../../assets/fonts/Roboto-BoldItalic.ttf";
import RobotoBlack from "../../assets/fonts/Roboto-Black.ttf";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoRegular}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    src: url(${RobotoItalic}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: bold;
    src: url(${RobotoBold}) format('truetype');
  }
  @font-face {
    font-family: 'Roboto';
    font-weight: bold;
    font-style: italic;
    src: url(${RobotoBoldItalic}) format('truetype');
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: 900;
    src: url(${RobotoBlack}) format('truetype');
  }
`;

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
    return (
        <>
            <GlobalStyle />
            {children}
        </>
    );
};

export default Provider;
