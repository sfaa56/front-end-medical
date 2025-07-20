import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '@/features/auth/authSlice';
import userReducer from '@/features/user/useSlice';

const rootReducer = combineReducers({
    auth:authReducer,
    users:userReducer
})


export default rootReducer;