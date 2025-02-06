import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {Search as SearchIcon} from "@mui/icons-material"
import {useInputValidation} from '6pp'
import UserItem from './UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/api/misc'
import { useLazySerachUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import toast from 'react-hot-toast'
import { useAsyncmutation } from '../../hooks/hook'

const Search = () => {
  const dispatch=useDispatch();
  const {isSearch} =useSelector((state)=>state.misc);
  const [searchUser]=useLazySerachUserQuery();
  const [sendFriendRequest,isloadingsendreq]=useAsyncmutation(useSendFriendRequestMutation);
  const search=useInputValidation("");
  const addfriendhandler=async(id)=>{
    await sendFriendRequest("Sending friend request...",{userId:id})
  }
  const [Users,setUsers]=useState([]);
  const serachclose=()=>{
    dispatch(setIsSearch(false))
  }
  useEffect(()=>{
    const timeOut=setTimeout(() => {
      searchUser(search.value).then(({data})=>setUsers(data.users)).catch((error)=>{
      })
    }, 1000);
    return ()=>{
      clearTimeout(timeOut);
    }
  },[search.value]);
  return (
    <Dialog open={isSearch} onClose={serachclose}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
      <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler}
        variant='outlined' size='small' inputProps={{
          stratAdornment:(
          
            <InputAdornment position='start'>
              <SearchIcon/>
            </InputAdornment>
  )
        }}/>
        <List>
        {
          Users.map((user)=>(
              <UserItem
              user={user}
              key={user._id}
              handler={addfriendhandler}
              handlerIsLoading={isloadingsendreq}
              />
          ))
        }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search