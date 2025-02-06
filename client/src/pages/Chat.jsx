import React, { useCallback, useEffect, useRef, useState } from 'react'
import Applayout from '../components/layout/Applayout'
import { IconButton, Input, Skeleton, Stack } from '@mui/material'
import { graycolor, orange } from '../constants/Color'
import {AttachFile as AttachfileIcon, Send as SendIcon} from '@mui/icons-material'
import { InputBox } from '../components/styles/StyleComponents'
import FileMenu from '../components/dialogs/FileMenu'
import { sampleMessage } from '../constants/Sampledata'
import MessageComponent from '../components/shared/MessageComponent'
import { getsocket } from '../socket'
import { NEW_MESSAGE } from '../constants/events'
import { useChatdetailsQuery, useGetmessagesQuery } from '../redux/api/api'
import { useErrors, useSocketEvents } from '../hooks/hook'
import {useInfiniteScrollTop} from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/api/misc'

const Chat = ({chatId,user}) => {
  const containedRef=useRef(null)
  const socket=getsocket();
  const dispatch=useDispatch()

  const chatdeatils=useChatdetailsQuery({chatId,skip: !chatId})
  const [message,setmessage]=useState();
  const [messages,setmessages]=useState([])
  const [page,setpage]=useState(1)
  const members=chatdeatils?.data?.chat.mekmbers
  const newmessage=useCallback((data)=>{  
    setmessages(prev=>[...prev,data.message])
  },[])
  const oldmessageChunk=useGetmessagesQuery({chatId,page})
  const eventHandlers={[NEW_MESSAGE]:newmessage};
  const errors=[{isError:chatdeatils.isError,error:chatdeatils.error},{isError:oldmessageChunk.isError,error:oldmessageChunk.error}]
  useSocketEvents(socket,eventHandlers)
  useErrors(errors)
  const submithandler=(e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setmessage("")
  }
  const {data:oldmessage,setdata:setoldmessage}=useInfiniteScrollTop(containedRef,oldmessageChunk?.data?.totalpages,page,setpage,oldmessageChunk.data?.message)
  const allmessage=[...oldmessage,...messages]
  const handleFileopen=(e)=>{
      dispatch(setIsFileMenu(true));
      setFileMenuanchor(e.currentTarget)
  }
  const [fileMenuAnchor,setFileMenuanchor]=useState(null)
  return chatdeatils.isLoading?<Skeleton/>:(
    <>
      <Stack ref={containedRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={graycolor}
        height={"90%"}
        sx={{
          overflowX:'hidden'
          ,overflowY:"auto"
        }}
      > 
      {
        allmessage.map(i=> (
          <MessageComponent key={i._id} message={i} user={user}/>
        ))
      }
      </Stack>
      <form style={{
        height:"10%"
      }} onSubmit={submithandler}>
          <Stack flexDirection={"row"} height={"100%"} p={"1rem"}
          alignItems={'center'} position={'relative'}>
            <IconButton sx={{
              position:"absolute",
              left:"1.5rem",
              rotate:"30deg"
            }}
              onClick={handleFileopen}
            >
              <AttachfileIcon/>
            </IconButton>
            <InputBox placeholder='Type Message here...' value={message} onChange={e=>setmessage(e.target.value)}/>
            <IconButton type='submit' sx={{
              backgroundColor:orange,
              color:'white',
              marginLeft:"1rem",
              padding:"0.5rem",
              "&:hover":{
                bgcolor:"error.dark "
              }
            }}>
              <SendIcon/>
            </IconButton>
          </Stack>
          <FileMenu anchoreE1={fileMenuAnchor} chatId={chatId}/>
      </form>
    </>
  )
}

export default Applayout()(Chat)