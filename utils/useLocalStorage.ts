import { useState } from "react";
import { useMount, useUpdateEffect } from "react-use";

// Inspired by https://upmostly.com/next-js/using-localstorage-in-next-js
export default function useLocalStorage<T>(key: string, fallbackValue: T) {
    const [value, setValue] = useState(fallbackValue);
    useMount(() => {
        const stored = localStorage.getItem(key);
        try {
            setValue(stored ? JSON.parse(stored) : fallbackValue);
        } catch (e) {
            setValue(fallbackValue)
        }
    }, [fallbackValue, key]);

    useUpdateEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}
