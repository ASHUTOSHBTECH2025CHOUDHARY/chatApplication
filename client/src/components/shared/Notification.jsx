import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { SampleNotifications } from '../../constants/Sampledata'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/api/misc'
import toast from 'react-hot-toast'

const Notification = () => {
  const {isNotification}=useSelector((state)=>state.misc)
  const {isLoading,data,error,isError}=useGetNotificationsQuery()
  const [acceptFriendRequest]=useAcceptFriendRequestMutation()
  const dispatch=useDispatch()
  const onclosenotification=()=>{
    dispatch(setIsNotification(false))
  }
  const friendHandlerreq=async({_id,accept})=>{
    dispatch(setIsNotification(false))
    try {
      const res=await acceptFriendRequest({requestId:_id,accept});
      if(res.data?.success){
        console.log("Use Socket")
        toast.success(res.data.message)
      }
      else toast.error(res.data?.error||"Something went wrong")
    } catch (error) {
        toast.error(error.message||"Something went wrong")
    }
  }
  useErrors([{error,isError}])
  return (
    <Dialog  open={isNotification} onClose={onclosenotification}>
      <Stack p={{xs:"1rem",sm:"2rem"}}
      maxWidth={"25rem"}
      >
        <DialogTitle>
          Notifications
          </DialogTitle>
        {
          isLoading?<Skeleton/>:(
            data?.allRequest.length>0?(
            data?.allRequest.map((i)=>
            <NotificationItem
            sender={i.sender} _id={i._id}  handler={friendHandlerreq} 
            />
          )
          ):<Typography textAlign={"center"}>
            No Notifications
          </Typography>
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem=memo(({sender,_id,handler})=>{
  const {name,avatar}=sender
  return(  <ListItem>
  <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      width={"100%"}
  >
      <Avatar src=''/>
      <Typography
      variant='body1'
      sx={{
          flexGlow:1,
          display:"-webkit-box",
          WebkitLineClamp:1,
          WebkitBoxOrient:"vertical",
          overflow:"hidden",
          textOverflow:"ellipsis",
          width:"100%"
      }}
      >{`${name} Send you friend request`}</Typography>
      <Stack direction={{
        xs:"column",
        sm:"row"
      }}>
        <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
        <Button color='error' onClick={()=>handler({_id,accept:false})}>Reject</Button> 
      </Stack>
  </Stack>
</ListItem>)
})

export default Notification