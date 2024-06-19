import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface IAnalysisFiter {
    exp: null| number,
    level: null | number,
    career: null | string
}



export const defaultFilter: IAnalysisFiter = {
    exp: null,
    level: null,
    career: ''
}
export type typeActionAnalysisFilter = keyof IAnalysisFiter

export const analysisFilterSlice = createSlice({
    name: 'filter-analysis',
    initialState: defaultFilter,
    reducers: {
        setAnalysisFilter: (state, action: PayloadAction<Partial<IAnalysisFiter>>) => ({ ...state, ...action.payload }),
        clearAnalysisFilter: () => defaultFilter
    },
})

export const { setAnalysisFilter, clearAnalysisFilter } = analysisFilterSlice.actions

export const selectFilter = (state: RootState) => state.analysisFilter;

const analysisFilterReducer = analysisFilterSlice.reducer

export default analysisFilterReducer;


