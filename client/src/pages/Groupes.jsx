import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import Applayout from '../components/layout/Applayout'
import { Backdrop, Box, Button, Drawer, Grid, Icon, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import {gradiant, matblack, orange} from "../constants/Color"
import { Add as AddIcon, Chat, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon  } from '@mui/icons-material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Link } from '../components/styles/StyleComponents'
import AvatarCard from '../components/shared/AvatarCard'
import { samplechats, Sampleuserdata } from '../constants/Sampledata'
import UserItem from '../components/shared/UserItem'
const Confirmdeletedialog=lazy(()=>import("../components/dialogs/Confirmdeletedialog"));
const AddmemberDialog=lazy(()=>import("../components/dialogs/AddmemberDialog"));

const Groupes = () => {
  
  const chatId=useSearchParams()[0].get("group")
  const [isEdit,setIsEdit]=useState(false)
  const navigate=useNavigate()
  const[isMobile,setIsMobile]=useState(false)
  const [groupName,setGroupName]=useState("")
  const [groupNameUpdatedValue,setGroupNameUpdatedValue]=useState("")
  const [confirmdeltedialog,setconfirmdeltedialog]=useState(false)
  const isAdded=false;
  const removeMemberHandler=(id)=>{
    console.log(id)
  }
  const navigateBack=()=>{
    navigate('/')
  }
  const handleMobile=()=>{  
    setIsMobile((prev)=>!prev);

  }
  const updateGroupName=()=>{
    setIsEdit(false)
    setGroupName(groupNameUpdatedValue)
  }
  const handleMobileClose=()=>setIsMobile(false)
  const confirmdeletehandler=()=>{
    setconfirmdeltedialog(true);
  }
  const closeconfirmdeletehandler=()=>{
    setconfirmdeltedialog(false);
  }
  const openAddmember=()=>{
    
  }
  const deleteHandler=()=>{
    console.log("deletehandler")
    closeconfirmdeletehandler()
  }
  const Iconbtns=<>
  <Box
   sx={{
    position:"fixed",
    display:{
      xs:"block",
      sm:"none"
    },
    right:"1rem",
    top:"1rem"
  }}>
  <IconButton onClick={handleMobile}>
    <MenuIcon/>
  </IconButton>
  </Box>
  <Tooltip title="back">
    <IconButton
     sx={{
      position:"absolute",
      top:"2rem",
      left:"2rem",
      bgcolor:"rgba(0,0,0,0.5)",
      color:matblack,
      ":hover":{
        bgcolor:"rgba(0,0,0,0.7)"
      }
     }}
     onClick={navigateBack}
     >
      <KeyboardBackspaceIcon/>
    </IconButton>
  </Tooltip>
  </>
  const ButtonGroup=(
    <Stack
      direction={{
        sm:"row",
        xs:"column-reverse"
      }}
      spacing={"1rem"}
      p={{
        sm:"1rem",
        xs:"0",
        md:"1rem 4rem"
      }}
    >
      <Button size='large' color='error' startIcon={<AddIcon/>} onClick={confirmdeletehandler}>Delete Group</Button>
      <Button size='large' variant='contained' startIcon={<DeleteIcon/>} onClick={openAddmember}>Add Member</Button>
    </Stack>
  )
  useEffect(()=>{
    if(chatId){
      setGroupName(`Group Name ${chatId}`);
    setGroupNameUpdatedValue(`Group Name ${chatId}`)
    }
    return()=>{ 
      setGroupName("");
      setGroupNameUpdatedValue("")
      setIsEdit(false)
    }
  },[chatId])
  const GroupName=<Stack direction={"row"} alignItems={"center"}
  justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
      {
        isEdit?<><TextField value={groupNameUpdatedValue} onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}/>
        <IconButton onClick={updateGroupName}>
          <DoneIcon/></IconButton></>: <><Typography variant='h4'>{ groupName}</Typography>
          <IconButton onClick={()=>setIsEdit(true)}><EditIcon/></IconButton>
        </>
      }
  </Stack>
  return (
   <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display:{
            xs:"none"
            ,sm:"block"
        },
        backgroundImage:gradiant
      }}
        sm={4}
        overflow={"auto"}
        height={"100%"}
      >
        <GroupsList myGroups={samplechats} chatId={chatId}/>
      </Grid>
        <Grid item
          xs={12}
          sm={8}
          sx={{
            display:"flex",
            flexDirection:"column",
            position:"relative",
            alignItems:"center",
            padding:"1rem 3rem"
          }}
        >
        {
          Iconbtns
        }
        {
          groupName && (<>
          {GroupName}
          <Typography
          margin={"2rem"}
          alignSelf={"flex-start"}
          variant='body1'
          >
            Members
          </Typography>
          <Stack
            maxWidth={"45rem"}
            width={"100%"}
            boxSizing={"border-box"}
            padding={{
              sm:"1rem",
              xs:"0",
              md:"1rem 4rem"
            }}
            spacing={"2rem"}
           
            height={"50vh"}
            overflow={"auto"}
          >
            {
              Sampleuserdata.map((i)=>(
                <UserItem user={i} key={i._id} isAdded styling={
                  {
                    boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                    padding:"1rem 2rem",
                    borderRadius:"1rem"
                  }
                }
                handler={removeMemberHandler}
                />
              ))
            }
          </Stack>
          {ButtonGroup}
          </>)
        }
        
        </Grid>
        {
          isAdded && <Suspense fallback={<Backdrop open/>}>
            <AddmemberDialog/>  
          </Suspense>
        }
        {
          confirmdeltedialog && (<Suspense fallback={<Backdrop open/>}> 
            <Confirmdeletedialog open={confirmdeltedialog} handleClose={closeconfirmdeletehandler} deleteHandler={deleteHandler}/>
          </Suspense>)
        }
        <Drawer open={isMobile} onClose={handleMobileClose}>
        <GroupsList w={"50vw"} myGroups={samplechats} chatId={chatId}/>
        </Drawer>
   </Grid>
  )
}

const GroupsList=({w="100%",myGroups=[],chatId})=>{
 return <Stack width={w}
 sx={{
  backgroundImage:gradiant,
  height:"100vh"
 }}>
    {
    myGroups.length > 0 ? (
      myGroups.map((group) => (
      <GroupsListItem key={group._id}  group={group} chatId={chatId}/>
     ))
      ) : (
  <Typography textAlign={'center'} padding={"1rem"}>
      No groups
     </Typography>
  )
}
  </Stack>
}
const GroupsListItem=memo(({
  group,chatId
})=>{
  const {name,avatar,_id}=group;
  return (
    <Link to={`?group=${_id}`} onClick={e=>{
      if(chatId===_id){
        e.preventDefault()
      }
    }}>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar}/>
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  )
})
export default Applayout()(Groupes)