import React from "react";
import { ThemeProvider as ThemeProviderBase } from "styled-components";
import { createGlobalStyle } from "styled-components";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import RobotoItalic from "../../assets/fonts/Roboto-Italic.ttf";
import RobotoBold from "../../assets/fonts/Roboto-Bold.ttf";
import RobotoBoldItalic from "../../assets/fonts/Roboto-BoldItalic.ttf";
import RobotoBlack from "../../assets/fonts/Roboto-Black.ttf";
import "../../styles/app.less";

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

type ThemePropsVars = {
    variables?: { [key: string]: string };
    spaces?: number[];
    breakpoints?: string[];
};

export interface ThemeProviderProps {
    theme?: ThemePropsVars & {
        [key: string]: any;
    };
    children?: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props: ThemeProviderProps) => {
    const { theme, children } = props;
    return (
        <ThemeProviderBase
            theme={{
                ...theme,
            }}
        >
            <>
                <GlobalStyle />
                {children}
            </>
        </ThemeProviderBase>
    );
};

ThemeProvider.defaultProps = {
    theme: {},
};
export default ThemeProvider;
