import React from "react";

type Props = {
  variant?: "small" | "large";
};

export default function Logo({ variant = "small" }: Props) {
  const size = variant === "small" ? 24 : 60;
  return (
    <img
      src="https://apsara.raystack.org/logo.svg"
      width={size}
      height={size}
    />
  );
}
