import styled, { keyframes } from "styled-components";
import FieldForm from "rc-field-form";

const explainShowHelpIn = keyframes`
0% {
	transform: translateY(-5px);
	opacity: 0;
}
100% {
	transform: translateY(0);
	opacity: 1;
}
`;
const explainShowHelpOut = keyframes`
to {
	transform: translateY(-5px);
	opacity: 0;
}
`;

export const StyledFieldForm: typeof FieldForm = styled(FieldForm)`
&.custom-form-inline {
	display: flex;
	flex-wrap: wrap;
	.custom-form-item {
		flex: none;
		flex-wrap: nowrap;
		margin-right: 16px;
		margin-bottom: 0;
		>.custom-form-item-label {
			display: inline-block;
			vertical-align: top;
			flex: none;
		}
		>.custom-form-item-control {
			display: inline-block;
			vertical-align: top;
		}
		.custom-form-text {
			display: inline-block;
		}
		.custom-form-item-has-feedback {
			display: inline-block;
		}
	}
	.custom-form-item-with-help {
		margin-bottom: 24px;
	}
}
&.custom-form-horizontal {
	.custom-form-item-label {
		flex-grow: 0;
	}
	.custom-form-item-control {
		flex: 1 1 0;
		min-width: 0;
	}
	.custom-form-item-label[class$='-24'] {
		+ {
			.custom-form-item-control {
				min-width: unset;
			}
		}
	}
	.custom-form-item-label[class*='-24 {
		'] {
			+ {
				.custom-form-item-control {
					min-width: unset;
				}
			}
		}
	}
}
&.custom-form-vertical {
	.custom-form-item {
		flex-direction: column;
		.custom-form-item-control {
			width: 100%;
		}
	}
	.custom-form-item-label {
		>label {
			height: auto;
			font-size: 12px;
			margin: 0;
			&::after {
				display: none;
			}
		}
		padding: 0 0 8px;
		line-height: 1.5715;
		white-space: initial;
		text-align: left;
	}
}
&.custom-form-rtl.custom-form-vertical {
	.custom-form-item-label {
		text-align: right;
	}
}
.custom-form-item-explain.custom-form-item-explain-error {
	color: #ff4d4f;
}
.custom-form-item-explain-warning {
	color: #faad14;
}
.custom-form-item-has-warning {
	.custom-form-item-split {
		color: #faad14;
	}
}
.custom-form-item-has-error {
	.custom-form-item-split {
		color: #ff4d4f;
	}
}
&.custom-form {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	color: rgba(0, 0, 0, 0.85);
	font-size: 14px;
	font-variant: tabular-nums;
	line-height: 1.5715;
	list-style: none;
	font-feature-settings: 'tnum';
	legend {
		display: block;
		width: 100%;
		margin-bottom: 20px;
		padding: 0;
		color: rgba(0, 0, 0, 0.45);
		font-size: 16px;
		line-height: inherit;
		border: 0;
		border-bottom: 1px solid #d9d9d9;
	}
	label {
		font-size: 14pxe;
	}
	input[type='search'] {
		box-sizing: border-box;
	}
	input[type='radio'] {
		line-height: normal;
		&:focus {
			outline: thin dotted;
			outline: 5px auto -webkit-focus-ring-color;
			outline-offset: -2px;
		}
	}
	input[type='checkbox'] {
		line-height: normal;
		&:focus {
			outline: thin dotted;
			outline: 5px auto -webkit-focus-ring-color;
			outline-offset: -2px;
		}
	}
	input[type='file'] {
		display: block;
		&:focus {
			outline: thin dotted;
			outline: 5px auto -webkit-focus-ring-color;
			outline-offset: -2px;
		}
	}
	input[type='range'] {
		display: block;
		width: 100%;
	}
	select[multiple] {
		height: auto;
	}
	select[size] {
		height: auto;
	}
	output {
		display: block;
		padding-top: 15px;
		color: rgba(0, 0, 0, 0.85);
		font-size: 14pxe;
		line-height: 1.5715;
	}
	.custom-form-text {
		display: inline-block;
		padding-right: 8px;
	}
}
&.custom-form-small {
	.custom-form-item-label {
		>label {
			height: 24px;
		}
	}
	.custom-form-item-control-input {
		min-height: 24px;
	}
}
&.custom-form-large {
	.custom-form-item-label {
		>label {
			height: 32px;
		}
	}
	.custom-form-item-control-input {
		min-height: 32px;
	}
}
.custom-form-item {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	color: rgba(0, 0, 0, 0.85);
	font-size: 14px;
	font-variant: tabular-nums;
	line-height: 1.5715;
	list-style: none;
	font-feature-settings: 'tnum';
	margin-bottom: 24px;
	vertical-align: top;
}
.custom-form-item-with-help {
	margin-bottom: 0;
	transition: none;
	.custom-form-item-explain {
		height: auto;
		opacity: 1;
	}
}
.custom-form-item-hidden {
	display: none;
}
.custom-form-item-hidden.custom-row {
	display: none;
}
.custom-form-item-label {
	display: inline-block;
	flex-grow: 0;
	overflow: hidden;
	white-space: nowrap;
	text-align: right;
	vertical-align: middle;
	>label {
		position: relative;
		display: inline-flex;
		align-items: center;
		max-width: 100%;
		height: 28px;
		color: rgba(0, 0, 0, 0.85);
		font-size: 14px;
		text-transform: uppercase;
		.custom-form-item-optional {
			display: inline-block;
			margin-left: 4px;
			color: rgba(0, 0, 0, 0.45);
		}
		.custom-form-item-tooltip {
			color: rgba(0, 0, 0, 0.45);
			cursor: help;
			writing-mode: horizontal-tb;
			margin-inline-start: 4px;
		}
		&::after {
			content: ':';
			position: relative;
			top: -0.5px;
			margin: 0 8px 0 2px;
		}
	}
	>label.custom-form-item-required {
		&:not(.custom-form-item-required-mark-optional) {
			&::before {
				display: inline-block;
				margin-right: 4px;
				color: #f5222d;
				font-size: 14px;
				font-family: SimSun, sans-serif;
				line-height: 1;
				content: '*';
			}
		}
	}
	>label.custom-form-item-no-colon {
		&::after {
			content: ' ';
		}
	}
}
.custom-form-item-label-left {
	text-align: left;
}
.custom-form-item-label-wrap {
	overflow: unset;
	line-height: 1.3215em;
	white-space: unset;
}
&.custom-form-hide-required-mark {
	.custom-form-item-label {
		>label.custom-form-item-required {
			&:not(.custom-form-item-required-mark-optional) {
				&::before {
					display: none;
				}
			}
		}
		>label {
			.custom-form-item-optional {
				display: none;
			}
		}
	}
}
.custom-form-item-control {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	&:first-child {
		&:not([class^=~"'custom-col-'"]) {
			&:not([class*=~"'custom-col-'"]) {
				width: 100%;
			}
		}
	}
}
.custom-form-item-control-input {
	position: relative;
	display: flex;
	align-items: center;
	min-height: 32px;
}
.custom-form-item-control-input-content {
	flex: auto;
	max-width: 100%;
}
.custom-form-item-explain {
	clear: both;
	color: rgba(0, 0, 0, 0.45);
	min-height: 24px;
	font-size: 14px;
	line-height: 1.5715;
	transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.custom-form-item-extra {
	clear: both;
	color: rgba(0, 0, 0, 0.45);
	min-height: 24px;
	font-size: 14px;
	line-height: 1.5715;
	transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
	min-height: 24px;
}
.custom-form-item-explain-connected {
	width: 100%;
}
.custom-form-item-feedback-icon {
	font-size: 14pxe;
	text-align: center;
	visibility: visible;
	animation: zoomIn 0.3s cubic-bezier(0.12, 0.4, 0.29, 1.46);
	pointer-events: none;
}
.custom-form-item-feedback-icon-success {
	color: #52c41a;
}
.custom-form-item-feedback-icon-error {
	color: #ff4d4f;
}
.custom-form-item-feedback-icon-warning {
	color: #faad14;
}
.custom-form-item-feedback-icon-validating {
	color: #1890ff;
}
.explain-show-help-enter {
	animation-duration: 0.3s;
	animation-fill-mode: both;
	animation-play-state: paused;
	opacity: 0;
	animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
}
.explain-show-help-appear {
	animation-duration: 0.3s;
	animation-fill-mode: both;
	animation-play-state: paused;
	opacity: 0;
	animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
}
.explain-show-help-leave {
	animation-duration: 0.3s;
	animation-fill-mode: both;
	animation-play-state: paused;
	animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
}
.explain-show-help-enter.explain-show-help-enter-active {
	animation-name: ${explainShowHelpIn};
	animation-play-state: running;
}
.explain-show-help-appear.explain-show-help-appear-active {
	animation-name: ${explainShowHelpIn};
	animation-play-state: running;
}
.explain-show-help-leave.explain-show-help-leave-active {
	animation-name: ${explainShowHelpOut};
	animation-play-state: running;
	pointer-events: none;
}
.custom-motion-collapse {
	overflow: hidden;
	transition: height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
}
&.custom-form-rtl {
	direction: rtl;
	.custom-form-item-label {
		text-align: left;
		>label.custom-form-item-required {
			&::before {
				margin-right: 0;
				margin-left: 4px;
			}
		}
		>label {
			&::after {
				margin: 0 2px 0 8px;
			}
			.custom-form-item-optional {
				margin-right: 4px;
				margin-left: 0;
			}
		}
	}
	.custom-form-item-has-feedback.custom-form-item-has-success {
		.custom-form-item-children-icon {
			right: auto;
			left: 0;
		}
	}
	.custom-form-item-has-feedback.custom-form-item-has-warning {
		.custom-form-item-children-icon {
			right: auto;
			left: 0;
		}
	}
	.custom-form-item-has-feedback.custom-form-item-has-error {
		.custom-form-item-children-icon {
			right: auto;
			left: 0;
		}
	}
	.custom-form-item-has-feedback.custom-form-item-is-validating {
		.custom-form-item-children-icon {
			right: auto;
			left: 0;
		}
	}
}
&.custom-form-rtl.custom-form-inline {
	.custom-form-item {
		margin-right: 0;
		margin-left: 16px;
	}
}
`;
