import React, { useEffect, useState } from "react";
import "./CustomCSS.css"; // Import your CSS
import logoImage from "../assets/IndieCoreLogoPack/Beyaz.png"; // Import the logo image

const LogoAnimation = () => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Trigger the shake animation for all elements
    const timer = setTimeout(() => {
      setShake(true);
      // Reset shaking after the animation duration
      setTimeout(() => setShake(false), 1000); // Shake lasts 1 second
    }, 1500); // Start shaking after 1.5 seconds

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, []);

  return (
    <div className="page-container">
      <div className="logo-container">
        <div id="logo" className={shake ? "shake" : ""}>
          <img src={logoImage} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default LogoAnimation;
