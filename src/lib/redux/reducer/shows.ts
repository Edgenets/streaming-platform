import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../index";
import { getShowById } from "../../api/tmdb";

interface ShowsState {
    entities: Record<number, Api.TVDetails>;
    fetchRequests: number[];
}

interface ThunkParams {
    id: number;
}

const initialState: ShowsState = {
    entities: {},
    fetchRequests: [],
};

// 定义异步 Thunk
export const preloadShow = createAsyncThunk<Api.TVDetails | null, ThunkParams>(
    "shows/preloadShow",
    async ({ id }, { getState, dispatch }) => {
        const state = getState() as AppState;

        // 如果实体已存在，返回 null
        if (state.shows.entities[id]) {
            return null;
        }

        // 注册请求
        dispatch(registerFetchRequest(id));

        // 获取数据
        const show = await getShowById(id);
        return show;
    }
);

const showsSlice = createSlice({
    name: "shows",
    initialState,
    reducers: {
        registerFetchRequest(state, action: PayloadAction<number>) {
            state.fetchRequests.push(action.payload);
        },
    },
    extraReducers: builder => {
        builder.addCase(preloadShow.fulfilled, (state, { payload }) => {
            if (!payload) {
                return;
            }

            state.entities = { ...state.entities, [payload.id]: payload };
        });
    },
});

export const { registerFetchRequest } = showsSlice.actions;
export default showsSlice.reducer;
