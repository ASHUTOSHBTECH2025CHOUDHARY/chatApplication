import { DialpadOutlined } from '@mui/icons-material'
import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React,{useState} from 'react'
import { Sampleuserdata } from '../../constants/Sampledata'
import UserItem from '../shared/UserItem'

const AddmemberDialog = ({addmember,isLoadingAddMember,chatId}) => {
    const [members,setmembers]=useState(Sampleuserdata);
  const [seletctedmembers,setseletctedmembers]=useState([]);
  
  const selectmemberhandler=(id)=>{
    setseletctedmembers((prev)=>(prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]))
  }
    const addMemberSubmitHandler=()=>{
        closeHanler()
    }
    const closeHanler=()=>{
        setseletctedmembers([]);
        setmembers([]   )
    }
  return (
    <Dialog open onClose={closeHanler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>
                Add Member
            </DialogTitle>
            <Stack spacing={"1rem"}>
                {
                    members.length >0? (members.map((i)=>{
                      return  <UserItem key={i._id} user={i} handler={selectmemberhandler}
                      isAdded={seletctedmembers.includes(i._id)}/> 
                    })):<Typography textAlign={'center'}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}>
                <Button color="error" onClick={closeHanler}>Cancel</Button>
                <Button variant='contained' 
                onClick={addMemberSubmitHandler}disabled={isLoadingAddMember}>
                    Submit Changes
                </Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddmemberDialog