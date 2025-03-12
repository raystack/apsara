"use client";
import { Tabs } from "@raystack/apsara/v1";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTheme as useApsaraTheme } from "@raystack/apsara/v1";
import {
  type HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import styles from "./theme-toggle.module.css";

const themes = [
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "dark", label: "Dark", icon: <Moon /> },
] as const;

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setTheme: setApsaraTheme } = useApsaraTheme();
  const [mounted, setMounted] = useState(false);

  const updateTheme = () => {
    let newTheme = resolvedTheme ?? "light";
    if (resolvedTheme === "light") newTheme = "dark";
    else newTheme = "light";
    setTheme(newTheme);
    setApsaraTheme(newTheme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  const currentTheme = mounted ? resolvedTheme : "light";

  return (
    <Tabs.Root value={currentTheme} onValueChange={updateTheme}>
      <Tabs.List>
        {themes.map(({ value, label, icon }) => (
          <Tabs.Trigger key={value} value={value} icon={icon}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
