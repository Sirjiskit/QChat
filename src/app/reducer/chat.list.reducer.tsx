import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { IAllChatList, IChatsList } from '../../interface/chats.list';
import { AppThunk } from '../store';
export const initialState: IAllChatList = {
    isEmpty: true,
    isLoading: false,
    list: [],
    error: { message: 'An Error occurred' }
};
export const chatsListSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setLoading: (state: { isLoading: boolean; }, { payload }: PayloadAction<boolean>) => {
            state.isLoading = payload;
        },
        setLoaded: (state: any, { payload }: PayloadAction<any>) => {
            state.list = payload;
            state.isEmpty = false;
        },
        setFailed: (state: any, { payload }: PayloadAction<any>) => {
            state.error = payload;
            state.isEmpty = true;
        },
    },
});

export const { setLoaded, setLoading, setFailed } =
    chatsListSlice.actions;
export default chatsListSlice;

export const loadChatList = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const u = query(collection(db, "users"));
        const uSnapshort = await getDocs(u);
        const list: Array<IChatsList> = [];
        let i = 0;
        uSnapshort.forEach(async (res: { id: any; data: () => any; }) => {
            const q = query(collection(db, "ChatList"), where("chatId", "in", [`${auth.currentUser?.email}${res.id}`, `${res.id}${auth.currentUser?.email}`]));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: { id: any; data: () => any; }) => {
                const obj: IChatsList = {
                    chatId: doc.data().chatId,
                    userId: doc.data().userId,
                    myId: doc.data().myId,
                    unread: 0
                };
                list.push(obj);
            });
            i++;
            if (i == uSnapshort.size) {
                dispatch(setLoaded(list));
            }
        });
        if (uSnapshort.empty) {
            dispatch(setLoaded([]));
        }
    } catch (error) {
        dispatch(setFailed(error));
    } finally {
        dispatch(setLoading(false));
    }
};
