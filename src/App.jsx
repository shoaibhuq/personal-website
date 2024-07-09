//Components
import NavBar from "./components/NavBar";
import AboutMe from "./components/sections/AboutMe";
import Projects from "./components/sections/Projects";
import Footer from "./components/Footer";

function App() {
  return (
    <body className="bg-black h-screen">
      <div className="bg-black h-screen">
        <header className="fixed inset-x-0 top-0 z-50">
          <NavBar />
        </header>
        <main className="bg-black">
          <AboutMe />
          <Projects />
        </main>
        <footer className="bg-black">
          <Footer />
        </footer>
      </div>
    </body>
  );
}

export default App;
