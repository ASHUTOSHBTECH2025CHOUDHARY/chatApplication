import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Sampleuserdata as Users } from '../../constants/Sampledata'
import UserItem from './UserItem'

const NewGroups = () => {
  const [members,setmembers]=useState(Users );
  const [seletctedmembers,setseletctedmembers]=useState([]);
  
  const selectmemberhandler=(id)=>{
    setseletctedmembers((prev)=>(prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]))
  }
  const submithandler=()=>{
    
  }
  const closehandler=()=>{  }
  const groupName=useInputValidation("")
  return (
    <Dialog  open onClose={closehandler}>
    <Stack p={{xs:"1rem",sm:"3rem"}}
    width={"25rem"}
    spacing={"2rem"}
    >
      <DialogTitle textAlign={"center"} variant='h4'>
        New Group
        </DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant='body1'>
          Members
        </Typography>
     <Stack>
     {
          Users.map((user)=>(
            <UserItem
            user={user}
            key={user._id}
            handler={selectmemberhandler}
            isAdded={
              seletctedmembers.includes(user._id)
            }
            />
          ))
        }
     </Stack>
     <Stack direction={"row"} justifyContent={"space-between"}>
      <Button variant='contained' color='error'>Cancel</Button>
      <Button variant='contained' onClick={submithandler}>Create</Button>
     </Stack>
    </Stack>
  </Dialog>
  )
}

export default NewGroups