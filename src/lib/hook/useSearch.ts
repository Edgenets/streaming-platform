import { useDebouncedCallback } from "use-debounce";
import { useEffect, useRef, useState, useTransition } from "react";
import { getShowByString } from "@lib/api/tmdb";

export const useSearch = () => {
    const inputFocusRef = useRef<HTMLInputElement | null>(null);
    const [, startTransition] = useTransition();
    const [suggestions, setSuggestions] = useState<Api.TV[]>([]);

    useEffect(() => {
        if (inputFocusRef.current) {
            inputFocusRef.current.focus();
        }
    }, []);

    const handleQuery = async (value: string) => {
        if (!value) {
            setSuggestions([]);
            return;
        }

        const res = await getShowByString(value);
        startTransition(() => setSuggestions(res));
    };

    const handleInput = useDebouncedCallback(handleQuery, 150);

    return { inputFocusRef, suggestions, handleInput };
};