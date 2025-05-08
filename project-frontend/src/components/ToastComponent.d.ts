import React from "react";
interface ToastNotificationProps {
    show: boolean;
    message: string;
    onClose: () => void;
}
declare const ToastNotification: React.FC<ToastNotificationProps>;
export default ToastNotification;
