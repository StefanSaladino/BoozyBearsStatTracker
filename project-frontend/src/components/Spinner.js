import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import spinnerImage from "../assets/main-logo.png";
const Spinner = () => {
    return (_jsxs("div", { className: "spinner-overlay d-flex justify-content-center align-items-center flex-column", style: {
            width: "100%",
            height: "100%",
            minHeight: "400px", // prevents collapse on short pages
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            position: "relative",
            padding: "15px"
        }, children: [_jsx("div", { style: {
                    width: "5em",
                    height: "5em",
                    borderRadius: "50%",
                    padding: "15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }, children: _jsx("img", { src: spinnerImage, alt: "Loading...", style: {
                        width: "80px",
                        height: "80px",
                        animation: "spin 1s linear infinite",
                    } }) }), _jsx("style", { children: `
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          ` }), _jsx("p", { className: "mt-4", children: "Loading..." })] }));
};
export default Spinner;
