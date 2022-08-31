import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoggerInfo } from '../../interface/logger.info';
import { AppThunk } from '../store';
export const initialState: ILoggerInfo = {
    isAuth: false,
    isLoading: false,
    error: { message: 'An Error occurred' },
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state: { isLoading: boolean; }, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        },
        setAuthSuccess: (state: any, { payload }: PayloadAction<any>) => {
            state.currentUser = payload;
            state.isAuth = true;
        },
        setLogOut: (state: any) => {
            state.isAuth = false;
            state.currentUser = undefined;
        },
        setAuthFailed: (state: any, { payload }: PayloadAction<any>) => {
            state.error = payload;
            state.isAuth = false;
        },
    },
});

export const { setAuthSuccess, setLogOut, setLoading, setAuthFailed } =
    authSlice.actions;
export default authSlice;

export const loadCurrentUser = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const currentUser = await AsyncStorage.getItem('@UserLogger');
        if (currentUser !== null) {
            dispatch(setAuthSuccess(JSON.parse(currentUser)));
        } else {
            dispatch(setAuthFailed({ message: 'User not login' }));
        }
    } catch (error) {
        dispatch(setAuthFailed(error));
    } finally {
        dispatch(setLoading(false));
    }
};