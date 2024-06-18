import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface IPagination {
    currentPage: number,
    totalPage: number,
    pageSize: number,
    totalCount: number,
}



export const defaultPagination: IPagination = {
    currentPage: 1,
    totalPage: 1,
    pageSize: 10,
    totalCount: 0,
}
export type typeActionPagination = keyof IPagination

export const paginationJobSlice = createSlice({
    name: 'pagination-job',
    initialState: defaultPagination,
    reducers: {
        setPagination: (state: IPagination, action: PayloadAction<Partial<IPagination>>) =>  ({...state,...action.payload}),
        clearPagination: () => defaultPagination
    }
})

export const { setPagination, clearPagination } = paginationJobSlice.actions

export const selectPagination = (state: RootState) => state.paginationJob;

const paginationJobReducer = paginationJobSlice.reducer

export default paginationJobReducer;


