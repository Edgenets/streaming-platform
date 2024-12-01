import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import reducer from "./reducer";

export const REDUX_INITIAL_STATE = "__REDUX_STATE__";

// 创建 Redux Store
export const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== "production",
});

// 类型定义
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 自定义 Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default store;