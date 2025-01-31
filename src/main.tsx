import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Photography from "./components/sections/Photography";
import Contact from "./components/sections/Contact";
import NotFound from "./components/sections/NotFound";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}
