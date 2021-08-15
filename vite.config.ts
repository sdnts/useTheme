import reactRefresh from "@vitejs/plugin-react-refresh";
import * as path from "path";
import { defineConfig } from "vite";

const isDemo = process.env.BUILD_AS_DEMO === "true";

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    emptyOutDir: true,
    lib: isDemo
      ? undefined
      : {
          entry: path.resolve(__dirname, "src/lib.tsx"),
          name: "useTheme",
          formats: ["cjs", "es", "umd", "iife"],
          fileName: (format) => `lib.${format}.js`,
        },
    rollupOptions: isDemo
      ? {}
      : {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
            },
          },
        },
  },
});
