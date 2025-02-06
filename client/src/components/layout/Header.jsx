import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orange } from '../../constants/Color'
import {Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogOutIcon, Notifications as NotificationIcon } from '@mui/icons-material'
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExist } from '../../redux/reducers/Auth'
import toast from 'react-hot-toast'
import { setisMobile, setIsNotification, setIsSearch } from '../../redux/api/misc'
const SearchDialog=lazy(()=> import("../shared/Search"))
const Notificationdialog=lazy(()=>import("../shared/Notification"))
const NewGroupDialog=lazy(()=>import("../shared/NewGroups"))
const Header = () => {
  const {isMobile}=useSelector((state)=>state.misc)
  const {isSearch,isNotification}=useSelector((state)=>state.misc)
  const [isNewGroup,setisNewGroup]=useState(false);
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const handlemobile=()=>{
    dispatch(setisMobile(true));
  }
  const opensearch=()=>{
    dispatch(setIsSearch(true))
  }
  const addone=()=>{
    setisNewGroup(prev=>!prev)
  }
  const openNotification=()=>{
    dispatch(setIsNotification(true))
  }
  const Handlelogout=async()=>{
        try {
          const {data}=await axios.get(`${server}/user/logout`,{
            withCredentials:true})
            dispatch(userNotExist())
            toast.success(data.message)
        } catch (error) {
          console.log(error)
        }
  }
  const Navigatetogroup=()=> navigate("/groupes")
  return (
    <>
      <Box sx={{flexGrow:1}} height={"4rem"} >
        <AppBar position="static" sx={{
          bgcolor:orange
        }}>
          <Toolbar>
              <Typography
                variant='h6'
                sx={{
                    display:{xs:"none",sm:"block"}
                }}
              >
                  Chat
              </Typography>
              <Box  sx={{
                    display:{xs:"block",sm:"none"}
                }}>
                  <IconButton color='inherit' onClick={handlemobile}>
                    <MenuIcon/>
                  </IconButton>
              </Box>
              <Box sx={{
                flexGrow:1
              }}>
              </Box>
              <Box>
              <IconButton color='inherit' size="large" onClick={opensearch}>
                    <SearchIcon/>
                  </IconButton> 
                  <Tooltip title="New Group">
                  <IconButton color='inherit' size="large" onClick={addone}>
                    <AddIcon/>
                  </IconButton>
                  </Tooltip>
                  <Tooltip title='Groups' >
                  <IconButton color='inherit' size="large" onClick={Navigatetogroup}>
                    <GroupIcon/>
                  </IconButton>
                  </Tooltip>
                  <Tooltip title='Notification' >
                  <IconButton color='inherit' size="large" onClick={openNotification}>
                    <NotificationIcon/>
                  </IconButton>
                  </Tooltip>
                  <Tooltip title='LogOut' >
                  <IconButton color='inherit' size="large" onClick={Handlelogout}>
                    <LogOutIcon/>
                  </IconButton>
                  </Tooltip>
              </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && <Suspense fallback={<Backdrop open/>}>
          <SearchDialog/>
        </Suspense>
      }
      {
        isNotification &&<Suspense fallback={<Backdrop open/>}>
          <Notificationdialog/>
        </Suspense>
      }
      {
        isNewGroup &&<Suspense fallback={<Backdrop open/>}>
          <NewGroupDialog/>
        </Suspense>
      }
    </>
  )
}

export default Header