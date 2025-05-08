import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ToastNotification = ({ show, message, onClose }) => {
    return (_jsx("div", { className: `toast-container position-fixed bottom-0 end-0 p-3`, style: { zIndex: 1055 }, children: _jsx("div", { className: `toast align-items-center text-bg-success ${show ? "show" : ""}`, role: "alert", "aria-live": "assertive", "aria-atomic": "true", children: _jsxs("div", { className: "d-flex", children: [_jsx("div", { className: "toast-body", children: message }), _jsx("button", { type: "button", className: "btn-close btn-close-white me-2 m-auto", "aria-label": "Close", onClick: onClose })] }) }) }));
};
export default ToastNotification;
