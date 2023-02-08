import classNames from "classnames";
import omit from "rc-util/lib/omit";
import React from "react";
import { LoaderWrapper } from "./Loader.styles";

const SpinSizes = ["small", "default", "large"];
export type SpinSize = typeof SpinSizes[number];
export type SpinIndicator = React.ReactElement<HTMLElement>;

export interface SpinProps {
    className?: string;
    spinning?: boolean;
    style?: React.CSSProperties;
    size?: SpinSize;
    wrapperClassName?: string;
    indicator?: SpinIndicator;
}

function renderIndicator(prefixCls: string, props: SpinProps): React.ReactNode {
    const { indicator } = props;
    const dotClassName = `${prefixCls}-dot`;

    if (indicator === null) {
        return null;
    }

    return (
        <span className={classNames(dotClassName, `${prefixCls}-dot-spin`)}>
            <i className={`${prefixCls}-dot-item`} />
            <i className={`${prefixCls}-dot-item`} />
            <i className={`${prefixCls}-dot-item`} />
            <i className={`${prefixCls}-dot-item`} />
        </span>
    );
}

export default function Loader(props: any) {
    const { className, size, tip, spinning = true, style, ...restProps } = props;
    const prefixCls = "apsara-loader";
    const spinClassName = classNames(
        prefixCls,
        {
            [`${prefixCls}-sm`]: size === "small",
            [`${prefixCls}-lg`]: size === "large",
            [`${prefixCls}-spinning`]: spinning,
            [`${prefixCls}-show-text`]: !!tip,
        },
        className,
    );
    const divProps = omit(restProps, ["spinning", "delay", "indicator"]);

    const spinElement = (
        <LoaderWrapper>
            <div {...divProps} style={style} className={spinClassName}>
                {renderIndicator(prefixCls, props)}
                {tip ? <div className={`${prefixCls}-text`}>{tip}</div> : null}
            </div>
        </LoaderWrapper>
    );
    return spinElement;
}
