import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {Face as FaceIcon, AlternateEmail as EmailIcon, CalendarMonth as CalenderIcon} from "@mui/icons-material"
import moment from'moment'
import { transformImage } from '../../lib/Filefeature'
const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar   
        src={transformImage(user?.avatar?.url)}
        sx={{
        width:200,
        height:200,
        objectFit:"contain",
        marginBottom:"1rem",
        border:"5px solid white"
      }}/>
      <ProfileCard text={user?.bio} heading={"Bio"}/>
      <ProfileCard text={user?.username} Icon={<EmailIcon/>} heading={"Username"}/>
      <ProfileCard text={user?.name} heading={"Name"} Icon={<FaceIcon/>}/>
      <ProfileCard text={"Joined"} heading={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon/>}/>
    </Stack>
  )
}
const ProfileCard=({text,Icon,heading})=>(
  <Stack direction={"row"}
        alignItems={"center"}
        textAlign={"center"}
        spacing={"1rem"}
        color={"white"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant='body1'>{text}</Typography>
      <Typography color={"gray"} variant='caption' >{heading}</Typography>
    </Stack>
  </Stack>
)
export default Profile