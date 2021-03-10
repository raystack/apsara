import React from "react";
import Text from "../Text";

import "./index.less";

interface LearnProps {
    content: any;
    isVisible: boolean;
    style?: any;
    setVisibility?: (visibility: boolean) => void;
}
const Learn = ({ isVisible, content, setVisibility = () => null, style }: LearnProps) => {
    const classNames = isVisible ? "learn-window show" : "learn-window";
    return (
        <React.Fragment>
            <div className={classNames} id="learn-panel" style={style}>
                <div className="learn-head">
                    <Text strong size={16} className="learn-title">
                        Learn
                    </Text>
                    <div className="learn-close-btn" onClick={() => setVisibility(false)}>
                        <span>&times;</span>
                    </div>
                </div>

                <div className="learn-body">{content}</div>
            </div>
        </React.Fragment>
    );
};

export default Learn;
