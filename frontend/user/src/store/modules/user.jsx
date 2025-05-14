//用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit';
import { request } from '../../services/request';

const userStore = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token')||'',
        userInfo: null
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    }
})

const { setToken, setUserInfo } = userStore.actions;

//获取reducer函数
const userReducer = userStore.reducer;

//封装异步代码
const fetchLogin = (loginForm) => {
    return async (dispatch) => {
        try {
            const res = await request.post('http://localhost:3001/api/users/login', loginForm);
            // 保存token到localStorage
            localStorage.setItem('token', res.data.token);
            // 保存token和用户信息到Redux
            dispatch(setToken(res.data.token));
            dispatch(setUserInfo(res.data.user));
            return res.data;
        } catch (error) {
            throw error;
        }
    }
}

// 注册action
const fetchRegister = (registerForm) => {
    return async (dispatch) => {
        try {
            const res = await request.post('http://localhost:3001/api/users/register', registerForm);
            return res;
        } catch (error) {
            throw error;
        }
    }
}

export { setToken, setUserInfo, fetchLogin, fetchRegister }
export default userReducer;



