import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.png",
        "Keeper-logo.png",
      ],

      manifest: {
        name: "Keeper Notes",
        short_name: "Keeper",
        description: "Smart Note Taking App",
        theme_color: "#facc15",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",

        icons: [
  {
    src: "icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
});