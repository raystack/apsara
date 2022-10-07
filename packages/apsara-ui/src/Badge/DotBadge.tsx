import classNames from "classnames";
import CSSMotion from "rc-motion";
import * as React from "react";
import { useMemo, useRef } from "react";
import "./index.style.less";

type CompoundedComponent = React.FC<BadgeProps>;

export interface BadgeProps {
    dot?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const Badge: CompoundedComponent = ({ children, dot = false, style, ...restProps }) => {
    const isHidden = useMemo(() => {
        return !dot;
    }, [dot]);

    const isDotRef = useRef(dot);
    if (!isHidden) {
        isDotRef.current = dot;
    }
    const mergedStyle = useMemo<React.CSSProperties>(() => {
        return { ...style };
    }, [style]);

    const reactNode: React.ReactNode = undefined;
    const component = "sup";
    return (
        <span {...restProps}>
            {children}
            <CSSMotion visible={!isHidden} motionName={`zoom`} motionAppear={false} motionDeadline={1000}>
                {({ className: motionClassName }) => {
                    const isDot = isDotRef.current;
                    const dotClassNames = classNames({
                        [`badge-dot`]: isDot,
                        [`badge-dot-pos`]: isDot,
                    });
                    const newProps = {
                        "data-show": !isHidden,
                        style: { ...mergedStyle },
                        className: classNames(dotClassNames, motionClassName),
                    };
                    return React.createElement(component as any, newProps, reactNode);
                }}
            </CSSMotion>
        </span>
    );
};

export default Badge;
