import { useState } from "react";
import "./App.css";
import XlsxVisualizer from "./Components/XlsxVisualizer.jsx";
import ParticlesBackground from "./Components/ParticlesBackground.jsx";
import LogoAnimation from "./Components/LogoAnimation.jsx";
function App() {
  return (
    <>
      <ParticlesBackground />
      <XlsxVisualizer />
      <LogoAnimation />
    </>
  );
}

export default App;
