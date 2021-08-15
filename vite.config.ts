import reactRefresh from "@vitejs/plugin-react-refresh";
import * as path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib.tsx"),
      name: "useTheme",
      formats: ["cjs", "es", "umd", "iife"],
      fileName: (format) => `lib.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
