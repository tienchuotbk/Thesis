import { configureStore } from  "@reduxjs/toolkit";
import filterJobReducer from "./slice/filter.slice";
import paginationJobReducer from "./slice/pagination.slice";


export const store = configureStore({
    reducer: {
        filterJob: filterJobReducer,
        paginationJob: paginationJobReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch