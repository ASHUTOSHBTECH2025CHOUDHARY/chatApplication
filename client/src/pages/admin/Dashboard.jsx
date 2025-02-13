import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Notifications as NotificationsIcon, Person as PersonIcon} from '@mui/icons-material'
import moment from 'moment'
import { CurveButton, SearchField } from '../../components/styles/StyleComponents'
import { LineChart,DoughnutChart } from '../../components/specific/Chart'


const Dashboard = () => {
  const Widgest=
  <Stack
  direction={{
    xs: "column",
    sm: "row",
  }}
  justifyContent="space-between"
  alignItems="center"
  margin="2rem 0"
  spacing="2rem"
>
  <Widget title={"User"} value={34} Icon={<GroupIcon/>}/>
  <Widget title={"User"} value={34} Icon={<GroupIcon/>}/>
  <Widget title={"User"} value={34} Icon={<GroupIcon/>}/>
</Stack>

  const Appbar=(
    <Paper
      elevation={3}
      sx={{padding:"2rem",margin:"2rem 0", borderRadius:"1rem"}}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{fontSize:"3rem"}} />
        <SearchField placeholder='Search...'/>
        <CurveButton>
          Search
        </CurveButton>
        <Box flexGrow={1}/>
        <Typography
        display={{
          xs:"none",
          lg:"block"
        }}
        color={"rgba(0,0,0,0.7)"}
        textAlign={"center"}>
          {
            moment().format("MMMM Do YYYY, h:mm:ss a")
          }
        </Typography>

        <NotificationsIcon/>
      </Stack>
    </Paper>
  )
  return (
    <AdminLayout>
        <Container component={"main"}>
  {Appbar}
  <Stack
   direction={{
    xs:"column",
    lg:"row"
  }} sx={{
    gap:"2rem"
  }} flexWrap={"wrap"} justifyContent={'center'}
  alignItems={{
    xs:"center",
    lg:"stretch"
  }}>
    <Paper
      elevation={3}
      sx={{
        padding: "2rem 3.5rem",
        borderRadius: "1rem",
        width: "100%",
        maxWidth: "45rem",
      }}
    >
      <Typography margin={"2rem 0"} variant="h4">
        Last Messages
      </Typography>
      <LineChart value={[1,2,3,4,5,6,7,8]}/>
    </Paper>
    <Paper
      elevation={3}
      sx={{
        padding: "1rem",
        borderRadius: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: { xs: "100%", sm: "50%" },
        position: "relative",
      }}
    >
      <DoughnutChart labels={["Single Chats","Group Chats"]} value={[25,75]} />
      <Stack
      position={"absolute"}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={"0.5rem"}
      width="100%"
      height="100%"
      >
        <GroupIcon/>
        <Typography>Vs</Typography>
        <PersonIcon/>
    </Stack>
      
    </Paper>
  </Stack>
  {Widgest}
</Container>
</AdminLayout>
  )
}
const Widget = ({ title, value, Icon })=>(
  <Paper
  elevation={3}
  sx={{
    padding:"2rem",
    margin:"2rem 0",
    borderRadius:"1rem",
    width:"20rem"
  }}>
  <Stack alignItems={"center"} spacing={"1rem"}>
  <Typography
  sx={{
    color: "rgba(0,0,0,0.7)",
    borderRadius: "50%",
    border: "5px solid rgba(0,0,0,0.9)",
    width: "5rem",
    height: "5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    }}>
      {value}
      </Typography>
  <Stack>
  {Icon}
  <Typography>{title} </Typography>
  </Stack>
  </Stack>
  </Paper>
  );
export default Dashboard