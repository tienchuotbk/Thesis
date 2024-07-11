import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface SortI {
    order: string
}

export const defaultSort: SortI = {
    order: "fit"
}
export type typeActionSort = keyof SortI

export const sortSlice = createSlice({
    name: 'sort',
    initialState: defaultSort,
    reducers: {
        setOrder: (state, action: PayloadAction<Partial<string>>) => ({ ...state, order: action.payload }) },
})

export const { setOrder } = sortSlice.actions

export const selectOrder = (state: RootState) => state.order;

const orderReducer = sortSlice.reducer

export default orderReducer;


