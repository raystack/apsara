import React from "react";
import { LearnWindow, LearnHead, LearnBody, LearnTitle, LearnCloseBtn } from "./Learn.styles";

interface LearnProps {
    content: any;
    isVisible: boolean;
    style?: any;
    setVisibility?: (visibility: boolean) => void;
}
const Learn = ({ isVisible, content, setVisibility = () => null, style }: LearnProps) => (
    <React.Fragment>
        <LearnWindow isVisible={isVisible} id="learn-panel" style={style}>
            <LearnHead>
                <LearnTitle strong size={16}>
                    Learn
                </LearnTitle>
                <LearnCloseBtn onClick={() => setVisibility(false)}>
                    <span>&times;</span>
                </LearnCloseBtn>
            </LearnHead>

            <LearnBody>{content}</LearnBody>
        </LearnWindow>
    </React.Fragment>
);

export default Learn;
