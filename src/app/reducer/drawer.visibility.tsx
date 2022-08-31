import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IVisibility {
    visibility: boolean;
}
const initialState: IVisibility = {
    visibility: false,
};
const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        setVisibility: (state: { visibility: boolean; }, { payload }: PayloadAction<boolean>) => {
            state.visibility = payload;
        },
    },
});
export const { setVisibility } = drawerSlice.actions
export default drawerSlice;