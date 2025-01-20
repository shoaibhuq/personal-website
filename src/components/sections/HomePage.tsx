import NavBar from "./../NavBar";
import AboutMe from "./AboutMe";
import Projects from "./Projects";
import Footer from "./../Footer";

const HomePage = () => {
  return (
    <>
      <body className="bg-black h-screen">
        <div className="bg-black h-screen">
          <main className="bg-black ">
            <AboutMe />
            <Projects />
          </main>
          <footer className="bg-black">
            <Footer />
          </footer>
        </div>
      </body>
    </>
  );
};

export default HomePage;
