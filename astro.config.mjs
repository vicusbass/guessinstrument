// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  i18n: {
      locales: ["ro", "en"],
      defaultLocale: "ro",
    },

  vite: {
    plugins: [tailwindcss()]
  }
});