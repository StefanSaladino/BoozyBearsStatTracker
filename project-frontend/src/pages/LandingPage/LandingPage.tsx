import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../LandingPage/LandingPage.css";
import mainLogo from "../../assets/main-logo-half.png";
import champs from "../../assets/champions.jpg";
import GameCountdown from "../../components/GameCountdown";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGliding, setIsGliding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleEnter = () => {
    setIsGliding(true);
    setTimeout(() => {
      navigate("/roster");
    }, 2000);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 991);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="wrapper">
      <section className="landing-section">
        {!isMobileView && (
          <div className="landing-image">
            <img id="bear-logo" src={mainLogo} alt="Boozy Bears Logo" />
          </div>
        )}
        <div className="landing-text">
          <h1 className="landing-title">
            Welcome to
            {!isMobileView && <br />} Boozy Bears Hockey
          </h1>
          <button
            className={`landing-button ${
              !isMobileView && isGliding ? "gliding" : ""
            }`}
            onClick={handleEnter}>
            {isMobileView ? "Meet the squad →" : "ROSTER"}
          </button>
        </div>
      </section>

      <div className="boozy-info">
        <div className="carousel-container w-75 position-relative">
          <div className="carousel-inner-custom">
            <div
              className={`carousel-item-custom ${
                currentSlide === 0 ? "active" : ""
              }`}>
              <div className="card boozy-card shadow slide-glide">
                <img
                  rel="preload"
                  src={champs}
                  className="card-img-top"
                  alt="Boozy Bears Championship"
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Facility Champions 🏆</h5>
                  <p className="card-text">
                    After a weekend of blood, sweat, and tears, the Boozy Bears
                    pulled through as York Facility champs!
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`carousel-item-custom ${
                currentSlide === 1 ? "active" : ""
              }`}>
              <div className="card boozy-card shadow slide-glide">
                <div className="ratio ratio-16x9">
                  <iframe
                    rel="preload"
                    src="https://www.youtube.com/embed/revA-TOOkh8"
                    title="Facilities Championship Moment"
                    allowFullScreen></iframe>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Moment of Triumph 🎥</h5>
                  <p className="card-text">
                    Watch the Boozy Bears win the facility championship!
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`carousel-item-custom ${
                currentSlide === 2 ? "active" : ""
              }`}>
              <div className="card boozy-card shadow slide-glide">
                <div className="ratio ratio-16x9">
                  <iframe
                    rel="preload"
                    src="https://www.youtube.com/embed/LPKQG9thR_A"
                    title="YouTube short"
                    allowFullScreen></iframe>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">The GWG 🚨</h5>
                  <p className="card-text">
                    Raff nets the GWG to clinch the facility championships for
                    Boozy in their inaugural season!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Controls */}
          <button className="carousel-control-prev-custom" onClick={handlePrev}>
            ❮
          </button>
          <button className="carousel-control-next-custom" onClick={handleNext}>
            ❯
          </button>
        </div>
      </div>

      <div className="countdown">
        <GameCountdown />
      </div>
    </div>
  );
};

export default LandingPage;
