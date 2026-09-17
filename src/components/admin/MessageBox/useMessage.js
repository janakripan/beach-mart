import { useMessageStore } from "./useMessageStore";

export const useMessage = () => {
    const showMessage = useMessageStore((state) => state.showMessage);

    return {
        success: (message, duration) =>
            showMessage({ type: "success", message, duration }),

        error: (message, duration) =>
            showMessage({ type: "error", message, duration }),

        info: (message, duration) =>
            showMessage({ type: "info", message, duration }),

        warning: (message, duration) =>
            showMessage({ type: "warning", message, duration }),
    };
};
