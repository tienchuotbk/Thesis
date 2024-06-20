import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
export interface UserInterace {
    uid: string
}
export const defaultUser: UserInterace = {
    uid: ""
}
export const userSlice = createSlice({
    name: 'user',
    initialState: defaultUser,
    reducers: {
        setUser: (state: UserInterace, action: PayloadAction<Partial<string>>) => ({ ...state, uid: action.payload })

    },
})

export const { setUser } = userSlice.actions
export const selectUser= (state: RootState) => state.user.uid;

const userReducer = userSlice.reducer

export default userReducer;
