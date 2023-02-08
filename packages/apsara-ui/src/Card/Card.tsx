import classNames from "classnames";
import React from "react";
import { DetailsSkeleton } from "../Skeleton";
import { CardWrapper } from "./Card.styles";

export type CardSize = "default" | "small";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    extra?: React.ReactNode;
    bordered?: boolean;
    loading?: boolean;
    size?: CardSize;
    headStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    style?: React.CSSProperties;
}

const Card = ({
    title,
    children,
    className,
    extra,
    bordered = true,
    loading = false,
    size = "default",
    headStyle = {},
    bodyStyle = {},
    ...props
}: CardProps) => {
    const prefixCls = "apsara-card";
    const mergedSize = size;
    const divProps = { ...props };

    const classString = classNames(
        prefixCls,
        {
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-bordered`]: bordered,
            [`${prefixCls}-${mergedSize}`]: mergedSize,
        },
        className,
    );

    const head: React.ReactNode = (
        <div className={`${prefixCls}-head`} style={headStyle}>
            <div className={`${prefixCls}-head-wrapper`}>
                {title && <div className={`${prefixCls}-head-title`}>{title}</div>}
                {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
            </div>
        </div>
    );
    const body = (
        <div className={`${prefixCls}-body`} style={bodyStyle}>
            {loading ? <DetailsSkeleton /> : children}
        </div>
    );

    return (
        <CardWrapper>
            <div className={classString} {...divProps}>
                {head}
                {body}
            </div>
        </CardWrapper>
    );
};

export default Card;
