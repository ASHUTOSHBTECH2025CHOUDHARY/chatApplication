import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isNewGroup:false,
    isAddMember:false,
    isNotification:false,
    isMobile:false,
    isSearch:false,
    isfilemenu:false,
    isDeleteMenu:false,
    uploadingLoader:false,
    selectDeleteChat:{
        chatId:"",
        groupCHat:false
    }
};

const miscSlice=createSlice({
    name:"misc",
    initialState,
    reducers:{
        setIsNewGroup:(state,action)=>{
            state.isNewGroup=action.payload
        },
        setIsAddMember:(state,action)=>{
            state.isAddMember=action.payload
        },
        setIsNotification:(state,action)=>{
            state.isNotification=action.payload
        },
        setisMobile:(state,action)=>{
            state.isMobile=action.payload
        },
        setIsSearch:(state,action)=>{
            state.isSearch=action.payload
        },
        setIsFileMenu: (state, action) => {
            state.isfilemenu = action.payload;
            },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;
            },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload;
            },
    }
})
export default miscSlice
export const {
    setIsAddMember,
    setIsFileMenu,
    setIsNotification,
    setIsSearch,
    setIsDeleteMenu,
    setIsNewGroup,
    setUploadingLoader,
    setisMobile
}=miscSlice.actions;