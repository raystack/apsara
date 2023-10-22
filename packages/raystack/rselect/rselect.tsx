import { cva, cx } from "class-variance-authority";
import React, { forwardRef } from "react";
import CustomSelect, { ClassNamesConfig, Props } from "react-select";
import styles from "./rselect.module.css";

const select = cva(styles.select);
type SelectRef = React.ElementRef<typeof CustomSelect>;

const classNames: ClassNamesConfig = {
  control: () => cx(styles.control),
  option: () => cx(styles.option),
  input: () => cx(styles.input),
  placeholder: () => cx(styles.placeholder),
  singleValue: () => cx(styles.singleValue),
  indicatorsContainer: () => cx(styles.indicatorsContainer),
};

export const RSelect: React.ForwardRefExoticComponent<
  Props & React.RefAttributes<SelectRef>
> = forwardRef<SelectRef, Props>(({ className, ...props }, ref) => {
  return (
    <CustomSelect
      className={select({ className })}
      ref={ref}
      {...props}
      classNames={classNames}
      components={{
        IndicatorSeparator: () => null,
        IndicatorsContainer: () => null,
      }}
    />
  );
});

export default RSelect;
