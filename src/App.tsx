// Components
import HomePage from "./components/sections/HomePage";
import NavBar from "./components/NavBar";
import Photography from "./components/sections/Photography";
import Contact from "./components/sections/Contact";
import NotFound from "./components/sections/NotFound";
import TrashToss from "./components/ui/TrashToss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
    errorElement: <NotFound />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <NotFound />,
  },
]);

// const host = window.location.hostname;
// const subdomain = host.split(".")[0];

// if (
//   (subdomain === "photo" || subdomain === "photography") &&
//   window.location.pathname !== "/photography"
// ) {
//   window.location.pathname = "/photography";
// }

function App() {
  return (
    <>
      <BrowserRouter>
        <header className="fixed inset-x-0 top-0 z-50">
          <NavBar />
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {/* Trash Toss mini-game — fixed bottom bar, visible on every route */}
        <TrashToss />
      </BrowserRouter>
      <SpeedInsights />
    </>
  );
}

export default App;
