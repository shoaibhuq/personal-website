// Components
import HomePage from "./components/sections/HomePage";
import NavBar from "./components/NavBar";
function App() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <NavBar />
      </header>
      <main>
        <HomePage />
      </main>
    </>
  );
}

export default App;
