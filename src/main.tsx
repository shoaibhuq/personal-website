import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Photography from "./components/sections/Photography";
import Contact from "./components/sections/Contact";
import NotFound from "./components/sections/NotFound";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/photography",
    element: <Photography />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <NotFound />,
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
