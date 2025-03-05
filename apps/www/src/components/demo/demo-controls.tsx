"use client";

import styles from "./styles.module.css";
import {
  ComponentPropsType,
  ControlsType,
  PropChangeHandlerType,
} from "./types";

type PropControlsProps = {
  controls: ControlsType;
  componentProps: ComponentPropsType;
  onPropChange: PropChangeHandlerType;
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
