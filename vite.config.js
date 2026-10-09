import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/plant-care-calendar/",
    build: { sourcemap: false },
    plugins: [react()],
});