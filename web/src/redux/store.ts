import { configureStore } from  "@reduxjs/toolkit";
import filterJobReducer from "./slice/filter.slice";
import paginationJobReducer from "./slice/pagination.slice";
import analysisFilterReducer from "./slice/analysisFilter.slice";
import userReducer from "./slice/user.slice";


export const store = configureStore({
    reducer: {
        filterJob: filterJobReducer,
        paginationJob: paginationJobReducer,
        analysisFilter: analysisFilterReducer,
        user: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch