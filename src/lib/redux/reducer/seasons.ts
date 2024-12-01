import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SeasonsState {
    seasonResults: Record<number, Record<number, Api.Episode[]>>;
}

interface ThunkParams {
    showId: number;
    seasonNumber: number;
}

const initialState: SeasonsState = {
    seasonResults: {},
};

export const fetchEpisodes = createAsyncThunk<Api.Episode[] | null, ThunkParams>(
    "seasons/fetchEpisodes",
    async ({ showId, seasonNumber }) => {
        const response = await fetch(`/api/shows/${showId}/seasons/${seasonNumber}/episodes`);
        if (!response.ok) {
            throw new Error("Failed to fetch episodes");
        }
        return await response.json();
    }
);

const seasonsSlice = createSlice({
    name: "seasons",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchEpisodes.fulfilled, (state, { meta, payload }) => {
            if (!payload) {
                return;
            }

            state.seasonResults = {
                ...state.seasonResults,
                [meta.arg.showId]: {
                    ...state.seasonResults[meta.arg.showId],
                    [meta.arg.seasonNumber]: payload,
                },
            };
        });
    },
});

export default seasonsSlice.reducer;
