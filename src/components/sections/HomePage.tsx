import AboutMe from "./AboutMe";
import Projects from "./Projects";
import Footer from "./../Footer";
import LiquidEther from "../ui/LiquidEther";

const HomePage = () => {
  return (
    <div className="relative bg-black min-h-screen overflow-x-hidden">
      {/* Light cursor-tracking fluid background */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
      >
        <LiquidEther
          colors={["#8b5cf6", "#ec4899", "#a855f7"]}
          mouseForce={18}
          cursorSize={90}
          resolution={0.4}
          autoDemo
          autoSpeed={0.4}
          autoIntensity={1.6}
          takeoverDuration={0.3}
          autoResumeDelay={2000}
          className="h-full w-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Content sits above the background */}
      <div className="relative z-10">
        <main>
          <AboutMe />
          <Projects />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
