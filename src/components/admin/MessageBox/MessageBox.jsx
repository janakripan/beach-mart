import React, { useEffect, useState } from "react";
import { useMessageStore } from "./useMessageStore";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const MessageBox = () => {
    const messages = useMessageStore((state) => state.messages);
    const hideMessage = useMessageStore((state) => state.hideMessage);

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {messages.map((msg) => (
                <Message key={msg.id} {...msg} onClose={() => hideMessage(msg.id)} />
            ))}
        </div>
    );
};

const Message = ({ id, type, message, duration, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (duration <= 0) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            // setProgress(remaining);

            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Match animation duration
    };

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: "bg-green-50",
            borderColor: "border-green-500",
            textColor: "text-green-800",
            iconColor: "text-green-500",
            progressColor: "bg-green-500",
        },
        error: {
            icon: XCircle,
            bgColor: "bg-red-50",
            borderColor: "border-red-500",
            textColor: "text-red-800",
            iconColor: "text-red-500",
            progressColor: "bg-red-500",
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-500",
            textColor: "text-blue-800",
            iconColor: "text-blue-500",
            progressColor: "bg-blue-500",
        },
        warning: {
            icon: AlertTriangle,
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-500",
            textColor: "text-yellow-800",
            iconColor: "text-yellow-500",
            progressColor: "bg-yellow-500",
        },
    };

    const style = config[type] || config.info;
    const Icon = style.icon;

    return (
        <div
            className={`
        ${style.bgColor} ${style.borderColor} ${style.textColor}
        border-l-4 shadow-lg rounded-lg p-4 pr-12 relative overflow-hidden
        transition-all duration-300 ease-in-out font-manrope
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
        ${!isExiting ? "animate-slide-in" : ""}
      `}
        >
            {/* Close button */}
            <button
                onClick={handleClose}
                className={`absolute top-2 right-2 ${style.iconColor} hover:opacity-70 transition-opacity`}
            >
                <X size={16} />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
                <Icon className={`${style.iconColor} shrink-0`} size={20} />
                <p className="text-sm leading-relaxed pr-4">{message}</p>
            </div>

            {/* Progress bar */}
            {/* {duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                        className={`h-full ${style.progressColor} transition-all ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )} */}
        </div>
    );
};

export default MessageBox;
