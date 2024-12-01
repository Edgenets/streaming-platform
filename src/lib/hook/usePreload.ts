import { useRouter } from "next/router";
import { useRef } from "react";
import { preloadShow } from "../redux/reducer/shows";
import { useAppDispatch } from "../redux"; // 使用自定义的 dispatch

interface PrefetchData {
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

/**
 * React hook to prefetch data on hover.
 *
 * @param {number} id - The item's id.
 * @returns {PrefetchData} An object containing functions to trigger data fetching.
 */
export const usePreload = (id: number): PrefetchData => {
    const router = useRouter();
    const dispatch = useAppDispatch(); // 使用类型化的 dispatch
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const onClick = () => {
        return router.push({ query: { ...router.query, id: id } }, undefined, {
            shallow: true,
        });
    };

    const onMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            dispatch(preloadShow({ id })); // 确保 dispatch 类型匹配
        }, 400);
    };

    const onMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return {
        onClick,
        onMouseEnter,
        onMouseLeave,
    };
};