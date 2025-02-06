import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
    isAdmin:false,
    loader:true
};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        userExists:(state,action)=>{
            state.user=action.payload,
            state.loader=false
        },
        userNotExist:(state)=>{
            state.loader=false,
            state.user=null
        }
    }
})
export default authSlice
export const {userExists,userNotExist}=authSlice.actions;