import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Photography from "./components/sections/Photography";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/photography",
    element: <Photography />,
  },
]);

const host = window.location.hostname;
const subdomain = host.split(".")[0];

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
