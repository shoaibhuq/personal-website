import { useEffect } from "react";
import NavBar from "./../NavBar";
import AboutMe from "./AboutMe";
import Projects from "./Projects";
import Footer from "./../Footer";

const HomePage = () => {
  useEffect(() => {
    document.body.classList.add("bg-black", "h-screen");
    return () => {
      document.body.classList.remove("bg-black", "h-screen");
    };
  }, []);

  return (
    <div className="bg-black h-screen">
      <NavBar />
      <main className="bg-black ">
        <AboutMe />
        <Projects />
      </main>
      <footer className="bg-black">
        <Footer />
      </footer>
    </div>
  );
};

export default HomePage;
