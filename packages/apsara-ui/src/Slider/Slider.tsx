import styled from "styled-components";
import { Slider as AntdSlider } from "antd";
import Colors from "../Colors";

const Slider = styled(AntdSlider)`
    &&:not(.ant-slider-disabled) {
        .ant-slider-track {
            background-color: ${Colors.primary[500]};
        }
        .ant-slider-handle {
            border: solid 2px ${Colors.primary[500]};
            background-color: ${Colors.primary[500]};
        }
    }
`;

export default Slider;
