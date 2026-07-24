import { Toaster } from "react-hot-toast";
import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: "10px",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
registerSW({
  onNeedRefresh() {
    console.log("New version available.");
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});