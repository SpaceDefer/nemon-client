import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        log: logReducer,
        applications: applicationsReducer,
        machines: machinesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
