import styled from "styled-components";
import { Slider as AntdSlider } from "antd";

const Slider = styled(AntdSlider)`
    &&:not(.ant-slider-disabled) {
        .ant-slider-track {
            background-color: ${({ theme }) => theme?.colors?.primary[5]};
        }
        .ant-slider-handle {
            border: solid 2px ${({ theme }) => theme?.colors?.primary[5]};
            background-color: ${({ theme }) => theme?.colors?.primary[5]};
        }
    }
`;

export default Slider;
