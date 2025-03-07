"use client";

import { Info, Home, Laugh, X, Ban } from "lucide-react";
import styles from "./styles.module.css";
import {
  ComponentPropsType,
  ControlsType,
  PropChangeHandlerType,
} from "./types";
import { cx } from "class-variance-authority";

type PropControlsProps = {
  controls: ControlsType;
  componentProps: ComponentPropsType;
  onPropChange: PropChangeHandlerType;
};

const ICONS_MAP = {
  none: { icon: <Ban size={16} />, value: "" },
  info: { icon: <Info size={16} />, value: "<Info size={16} />" },
  close: { icon: <X size={16} />, value: "<X size={16} />" },
  home: { icon: <Home size={16} />, value: "<Home size={16} />" },
  laugh: { icon: <Laugh size={16} />, value: "<Laugh size={16} />" },
};
export default function DemoControls({
  controls,
  componentProps,
  onPropChange,
}: PropControlsProps) {
  return (
    <form className={styles.form}>
      {Object.entries(controls).map(([prop, control]) => {
        const propValue = componentProps?.[prop] ?? "";
        return (
          <label className={styles.label} key={prop}>
            {prop}
            {control.type === "text" && (
              <input
                className={styles.input}
                type="text"
                value={propValue}
                onChange={e => onPropChange(prop, e.target.value)}
              />
            )}
            {control.type === "icon" && (
              <div className={styles.iconContainer}>
                {Object.values(ICONS_MAP).map((icon, index) => (
                  <button
                    className={cx(
                      styles.iconButton,
                      propValue === icon.value && styles.active,
                    )}
                    key={index}
                    onClick={e => {
                      onPropChange(prop, String(icon.value));
                      e.preventDefault();
                      e.stopPropagation();
                    }}>
                    {icon.icon}
                  </button>
                ))}
              </div>
            )}
            {control.type === "number" && (
              <input
                className={styles.input}
                type="number"
                min={control.min}
                max={control.max}
                value={Number(propValue)}
                onChange={e => onPropChange(prop, Number(e.target.value))}
              />
            )}
            {control.type === "select" && (
              <select
                className={styles.select}
                value={propValue}
                onChange={e => onPropChange(prop, e.target.value)}>
                {control.options?.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {control.type === "checkbox" && (
              <input
                type="checkbox"
                checked={!!componentProps[prop]}
                onChange={e => onPropChange(prop, e.target.checked)}
              />
            )}
          </label>
        );
      })}
    </form>
  );
}
