//Components
import NavBar from "./components/NavBar";
import AboutMe from "./components/sections/AboutMe";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-black h-screen">
      <header className="fixed inset-x-0 top-0 z-50">
        <NavBar />
      </header>
      <main className="bg-black">
        <AboutMe />
      </main>
      <footer className="bg-black">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
