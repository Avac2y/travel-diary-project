//组合redux子模块
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './modules/user';
import diaryReducer from './modules/diary';
export default configureStore({
    reducer: {
        diary: diaryReducer,
        user: userReducer,
    }
})