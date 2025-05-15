import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../LandingPage/LandingPage.css";
import mainLogo from "../../assets/main-logo-half.png";
import champs from "../../assets/champions.jpg";
import GameCountdown from "../../components/GameCountdown";
const LandingPage = () => {
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
            setIsMobileView(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Call once on mount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (_jsxs("div", { className: "wrapper", children: [_jsxs("section", { className: "landing-section", children: [!isMobileView && (_jsx("div", { className: "landing-image", children: _jsx("img", { id: "bear-logo", src: mainLogo, alt: "Boozy Bears Logo" }) })), _jsxs("div", { className: "landing-text", children: [_jsxs("h1", { className: "landing-title", children: ["Welcome to", !isMobileView && _jsx("br", {}), " Boozy Bears Hockey"] }), _jsx("button", { className: `landing-button ${!isMobileView && isGliding ? "gliding" : ""}`, onClick: handleEnter, children: isMobileView ? "Meet the squad →" : "ROSTER" })] })] }), _jsxs("div", { className: "boozy-info", children: [_jsxs("div", { className: "carousel-container position-relative", children: [_jsxs("div", { className: "carousel-inner-custom", children: [_jsx("div", { className: `carousel-item-custom ${currentSlide === 0 ? "active" : ""}`, children: _jsxs("div", { className: "card boozy-card shadow slide-glide", children: [_jsx("img", { rel: "preload", src: champs, className: "card-img-top", alt: "Boozy Bears Championship" }), _jsxs("div", { className: "card-body", children: [_jsx("h5", { className: "card-title fw-bold", children: "Facility Champions \uD83C\uDFC6" }), _jsx("p", { className: "card-text", children: "After a weekend of blood, sweat, and tears, the Boozy Bears pulled through as York Facility champs!" })] })] }) }), _jsx("div", { className: `carousel-item-custom ${currentSlide === 1 ? "active" : ""}`, children: _jsxs("div", { className: "card boozy-card shadow slide-glide", children: [_jsx("div", { className: "ratio ratio-16x9", children: _jsx("iframe", { rel: "preload", src: "https://www.youtube.com/embed/revA-TOOkh8", title: "Facilities Championship Moment", allowFullScreen: true }) }), _jsxs("div", { className: "card-body", children: [_jsx("h5", { className: "card-title fw-bold", children: "Moment of Triumph \uD83C\uDFA5" }), _jsx("p", { className: "card-text", children: "Watch the Boozy Bears win the facility championship!" })] })] }) }), _jsx("div", { className: `carousel-item-custom ${currentSlide === 2 ? "active" : ""}`, children: _jsxs("div", { className: "card boozy-card shadow slide-glide", children: [_jsx("div", { className: "ratio ratio-16x9", children: _jsx("iframe", { rel: "preload", src: "https://www.youtube.com/embed/LPKQG9thR_A", title: "YouTube short", allowFullScreen: true }) }), _jsxs("div", { className: "card-body", children: [_jsx("h5", { className: "card-title fw-bold", children: "The GWG \uD83D\uDEA8" }), _jsx("p", { className: "card-text", children: "Raff nets the GWG to clinch the facility championships for Boozy in their inaugural season!" })] })] }) })] }), _jsx("button", { className: "carousel-control-prev-custom", onClick: handlePrev, children: "\u276E" }), _jsx("button", { className: "carousel-control-next-custom", onClick: handleNext, children: "\u276F" })] }), _jsx("span", { className: "underline", "aria-hidden": "true" })] }), _jsx("div", { className: "countdown", children: _jsx(GameCountdown, {}) })] }));
};
export default LandingPage;
