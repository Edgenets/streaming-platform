import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../index";
import { getShowsByGenre } from "@lib/api/tmdb";

export const INFINITE_SCROLL_SKIP = 4;

interface GenreState {
    genres: Api.Genre[];
    genreResults: Record<string, Api.TV[]>;
    page: number;
    loading: boolean;
    hasNextPage: boolean;
}

const initialState: GenreState = {
    genres: [],
    genreResults: {},
    page: 0,
    loading: false,
    hasNextPage: true,
};

// 异步操作：加载下一页的 genre 数据
export const fetchGenrePage = createAsyncThunk(
    "genre/fetchGenrePage",
    async (_, { getState }) => {
        const { genre } = getState() as AppState;
        const { genres, page } = genre;

        const genrePage = genres.slice(
            INFINITE_SCROLL_SKIP * page,
            INFINITE_SCROLL_SKIP * (page + 1)
        );

        // 处理可能的返回类型
        const results = await Promise.all(
            genrePage.map(async item => {
                const result = await getShowsByGenre(item);

                // 如果结果是数组，直接返回
                if (Array.isArray(result)) {
                    return result as Api.TV[];
                }

                // 如果结果是 Record<string, Api.TV[]>，解构成数组
                return Object.values(result).flat();
            })
        );

        return results.reduce<Record<string, Api.TV[]>>(
            (acc, shows, index) => {
                acc[genrePage[index].name] = shows;
                return acc;
            },
            {}
        );
    }
);

const genreSlice = createSlice({
    name: "genre",
    initialState,
    reducers: {
        setGenres(state, action: PayloadAction<Api.Genre[]>) {
            state.genres = action.payload;
        },
        resetGenreState(state) {
            state.genreResults = {};
            state.page = 0;
            state.loading = false;
            state.hasNextPage = true;
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchGenrePage.pending, state => {
            state.loading = true;
        });

        builder.addCase(fetchGenrePage.fulfilled, (state, { payload }) => {
            state.genreResults = { ...state.genreResults, ...payload };
            state.hasNextPage = state.genres.length > Object.keys(state.genreResults).length;
            state.page += 1;
            state.loading = false;
        });

        builder.addCase(fetchGenrePage.rejected, state => {
            state.loading = false;
        });
    },
});

export const { setGenres, resetGenreState } = genreSlice.actions;
export default genreSlice.reducer;