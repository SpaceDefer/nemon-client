import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface LogState {
    log: string;
    entries: 0;
}

const initialState: LogState = {
    log: "",
    entries: 0,
};

export const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        addEntry: (state, action: PayloadAction<string>) => {
            state.log += action.payload;
            state.entries += 1;
        },
    },
});

export const { addEntry } = logSlice.actions;

// export const selectEntries = (state: RootState) => state.log.entries;

export default logSlice.reducer;
