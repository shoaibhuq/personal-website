// Components
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/sections/HomePage";
import Photography from "./components/sections/Photography";

function App() {
  const host = window.location.hostname;
  const subdomain = host.split(".")[0];

  return (
    <Router>
      <Routes>
        {subdomain === "photography" ? (
          <Route path="/" element={<Photography />} />
        ) : (
          <Route path="/" element={<HomePage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
