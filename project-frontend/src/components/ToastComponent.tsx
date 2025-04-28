// src/components/ToastNotification.tsx
import React from "react";

interface ToastNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ show, message, onClose }) => {
  return (
    <div
      className={`toast-container position-fixed bottom-0 end-0 p-3`}
      style={{ zIndex: 1055 }}
    >
      <div
        className={`toast align-items-center text-bg-success ${show ? "show" : ""}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
