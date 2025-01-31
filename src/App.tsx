// Components
import HomePage from "./components/sections/HomePage";
import NavBar from "./components/NavBar";
import Photography from "./components/sections/Photography";
import Contact from "./components/sections/Contact";
import NotFound from "./components/sections/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
      </BrowserRouter>
    </>
  );
}

export default App;
