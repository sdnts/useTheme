import React from "react";
import ReactDOM from "react-dom";
import { useTheme } from "./lib";
import moon from "./moon.svg";
import sun from "./sun.svg";

/**
 * Demo app
 */
ReactDOM.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
  document.getElementById("root")
);

function Demo() {
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemeSwitch />
    </div>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <span
        id="current-theme"
        style={{
          fontSize: 16,
          fontFamily: "monospace",
          margin: "40px",
        }}
      >
        Current theme: {theme}
      </span>
      <button
        id="theme-switch"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" && <img src={moon} id="moon-icon" />}
        {theme === "dark" && <img src={sun} id="sun-icon" />}
      </button>
    </>
  );
}
