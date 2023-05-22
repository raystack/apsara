import React, { useRef } from "react";
import { RangePicker as RCRangePicker } from "rc-picker";
import "rc-picker/assets/index.css";
import enUS from "rc-picker/lib/locale/en_US";
import { CalendarOutlined, ClockCircleOutlined, CloseCircleFilled } from "@ant-design/icons/";
import SwapRightOutlined from "@ant-design/icons/SwapRightOutlined";
import { GenerateConfig } from "rc-picker/lib/generate/index";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { RangePickerWrapper, PickerDropdownWrapper } from "./DatePicker.styles";
import { Moment } from "moment";

const prefixCls = "apsara-picker";

interface RangePickerProps {
    className?: string;
    placeholder?: [string, string];
    picker?: any;
    generateConfig?: GenerateConfig<Moment>;
    showToday?: boolean;
    showNow?: boolean;
    showTime?: any;
    disabledDate?: any;
    width?: any;
}
const RangePicker = ({
    className,
    placeholder = ["Start date", "End date"],
    picker = "date",
    generateConfig = momentGenerateConfig,
    width = "100%",
    ...props
}: RangePickerProps) => {
    const rangePickerDropdownWrapperRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <RangePickerWrapper $props={{ width: width }}>
                <RCRangePicker<Moment>
                    separator={
                        <span aria-label="to" className={`${prefixCls}-separator`}>
                            <SwapRightOutlined />
                        </span>
                    }
                    placeholder={placeholder}
                    suffixIcon={picker === "time" ? <ClockCircleOutlined /> : <CalendarOutlined />}
                    clearIcon={<CloseCircleFilled />}
                    allowClear
                    {...props}
                    className={className}
                    prefixCls={prefixCls}
                    locale={enUS}
                    picker={picker}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    getPopupContainer={() => rangePickerDropdownWrapperRef!.current!}
                    generateConfig={generateConfig}
                    prevIcon={<span className={`${prefixCls}-prev-icon`} />}
                    nextIcon={<span className={`${prefixCls}-next-icon`} />}
                    superPrevIcon={<span className={`${prefixCls}-super-prev-icon`} />}
                    superNextIcon={<span className={`${prefixCls}-super-next-icon`} />}
                />
            </RangePickerWrapper>
            <PickerDropdownWrapper ref={rangePickerDropdownWrapperRef} />
        </>
    );
};

export default RangePicker;
