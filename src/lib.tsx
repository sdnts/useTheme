import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const LOCALSTORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (import.meta?.env?.SSR) {
      return "light";
    }

    const localStorageTheme = localStorage?.getItem(LOCALSTORAGE_KEY); // `?` ensures this works correctly with SSR
    if (localStorageTheme) {
      return localStorageTheme as Theme;
    }

    if (window?.matchMedia("(prefers-color-scheme: dark)")) {
      // `?` ensures this works correctly with SSR
      return "dark";
    }

    return "light";
  });

  // Set up side-effects for theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Set up persistence
  useEffect(() => {
    const isOSDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isOSLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;

    if ((theme === "dark" && isOSDark) || (theme === "light" && isOSLight)) {
      localStorage.removeItem(LOCALSTORAGE_KEY);
    } else {
      localStorage.setItem(LOCALSTORAGE_KEY, theme);
    }
  }, [theme]);

  // Set up listeners for theme changes
  useEffect(() => {
    // Change this pasge's theme if the OS theme was changed
    const prefersColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const onOSThemeChange = () =>
      setTheme((t) => (t === "light" ? "dark" : "light"));
    prefersColorScheme.addEventListener("change", onOSThemeChange);

    // Change this page's theme if this domain's theme on another tab was changed
    const onStorageEvent = () =>
      setTheme(localStorage.getItem(LOCALSTORAGE_KEY) as Theme);
    window.addEventListener("storage", onStorageEvent);

    return () => {
      prefersColorScheme.removeEventListener("change", onOSThemeChange);
      window.removeEventListener("storage", onStorageEvent);
    };
  }, []);

  return { theme, setTheme };
}
