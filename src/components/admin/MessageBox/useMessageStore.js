import { create } from "zustand";

let messageIdCounter = 0;

export const useMessageStore = create((set, get) => ({
    messages: [],

    showMessage: ({ type, message, duration = 3000 }) => {
        const id = ++messageIdCounter;

        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id,
                    type, // 'success' | 'error' | 'info' | 'warning'
                    message,
                    duration,
                },
            ],
        }));

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                get().hideMessage(id);
            }, duration);
        }

        return id;
    },

    hideMessage: (id) => {
        set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== id),
        }));
    },

    clearAll: () => {
        set({ messages: [] });
    },
}));
