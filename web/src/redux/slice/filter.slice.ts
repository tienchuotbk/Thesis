import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface IFiterJob {
    type: null | number,
    role: null | number,
    sex: null | number,
    exp: null| number,
    age: undefined | number,
    salary: undefined | number,
    level: null | number,
    career: null | string,
    text: string,
    province: string
}



export const defaultFilter: IFiterJob = {
    type: null,
    role: null,
    sex: null,
    exp: null,
    age: undefined,
    salary: undefined,
    level: null,
    career: '',
    text: '',
    province: 'all'
}
export type typeActionFilter = keyof IFiterJob

export const filterJobSlice = createSlice({
    name: 'filter-job',
    initialState: defaultFilter,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<IFiterJob>>) => ({ ...state, ...action.payload }),
        clearFilter: () => defaultFilter
    },
})

export const { setFilter, clearFilter } = filterJobSlice.actions

export const selectFilter = (state: RootState) => state.filterJob;

const filterJobReducer = filterJobSlice.reducer

export default filterJobReducer;


