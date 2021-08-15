import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

/**
 * Stores the currently active theme, and a way to change it.
 *
 * Themes must be in a Context (as opposed to a hook) because they work with localStorage.
 * Putting them inside a context ensures there aren't multiple readers / writers to / from localStorage.
 */
const ThemeContext = createContext<{
  theme?: Theme | null;
  setTheme: Dispatch<Theme>;
}>({ theme: null, setTheme: () => {} });

export const isLightOS = () =>
  window.matchMedia("(prefers-color-scheme: light)").matches;
export const isDarkOS = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const [localStorageTheme, setLocalStorageTheme] = useState<Theme | null>();
  const [OSTheme, setOSTheme] = useState<Theme | null>();
  const appTheme = localStorageTheme || OSTheme;

  /**
   * 1. `OSTheme` stores what theme the OS wants us to set
   * 2. `localStorageTheme` stores what theme the localStorage wants us to set
   * 3. `appTheme` is derived from `OSTheme` & `localStorageTheme`:
   */

  // Set up side-effects for OSTheme & localStorageTheme
  useEffect(() => {
    if (!OSTheme) {
      // This will only happen on first render
      setOSTheme(isLightOS() ? "light" : "dark");
      setLocalStorageTheme(localStorage.getItem("theme") as Theme | null);
    }

    if (!localStorageTheme) {
      return;
    }

    if (OSTheme === localStorageTheme) {
      // If the current (non-null) OS theme is the same as the one in localStorage, remove the localStorage theme
      // This will cause the appTheme to "snap" back to the OS preference (instead of overriding it)
      setLocalStorageTheme(null);
    }
  }, [OSTheme, localStorageTheme]);

  // Set up persistence
  useEffect(() => {
    if (localStorageTheme) {
      localStorage.setItem("theme", localStorageTheme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [localStorageTheme]);

  // Set up a listener that will change the theme as the user's OS theme changes
  useEffect(() => {
    const watchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const onOSThemeChange = () =>
      setOSTheme((t) => (t === "light" ? "dark" : "light"));
    watchMedia.addEventListener("change", onOSThemeChange);

    return () => {
      watchMedia.removeEventListener("change", onOSThemeChange);
    };
  }, []);

  // Set up side-effects for appTheme
  useEffect(() => {
    appTheme === "light"
      ? document.documentElement.classList.remove("dark")
      : document.documentElement.classList.add("dark");
  }, [appTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: appTheme,
        setTheme: setLocalStorageTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
