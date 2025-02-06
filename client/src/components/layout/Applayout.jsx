import React, { useEffect } from 'react';
import Header from './Header';
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';
import { samplechats } from '../../constants/Sampledata';
import { useParams, useLocation } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setisMobile } from '../../redux/api/misc';
import toast from 'react-hot-toast';
import { useErrors } from '../../hooks/hook';
import { getsocket } from '../../socket';

const Applayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const {isMobile}=useSelector((state)=>state.misc);
        const {user}=useSelector((state)=>state.auth);
        const dispatch=useDispatch();
        const location = useLocation();
        const {isLoading,data,isError,error,refetch}=useMyChatsQuery("");
        const chatId = params.id;
        const handelDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
            console.log("delete" + _id);
        };
        const isGroupesRoute = location.pathname === '/groupes';
        const handleMobileClose=()=>dispatch(setisMobile(false))
        useErrors([{isError,error }])
        const socket=getsocket()
        return (
            <>
                <Title title={"chat app"} />
                {!isGroupesRoute && <Header/>}
                {
                    isLoading?<Skeleton/>:(
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            <ChatList chats={data?.transformedChats} chatId={chatId} handelDeleteChat={handelDeleteChat} />
                        </Drawer>
                    )
                }
                <Grid container height={'calc(100vh - 4rem)'}>
                    {!isGroupesRoute && (
                        <Grid item sm={4} md={3} sx={{
                            display: { xs: "none", sm: "block" }
                        }} height={"100%"} >
                            {
                                isLoading?(<Skeleton/>):(
                                    <ChatList chats={data?.transformedChats} chatId={chatId} handelDeleteChat={handelDeleteChat} />
                                )
                            }
                        </Grid>
                    )}
                    <Grid item xs={12} sm={isGroupesRoute ? 12 : 8} md={isGroupesRoute ? 12 : 5} lg={isGroupesRoute ? 12 : 6} height={"100%"} >
                        <WrappedComponent {...props} chatId={chatId} user={user}/>
                    </Grid>
                    {!isGroupesRoute && (
                        <Grid item md={4} lg={3} sx={{
                            display: { xs: "none", md: "block", padding: "2rem" },
                            bgcolor: "rgba(0,0,0,0.85)"
                        }} height={"100%"} >
                            <Profile user={user}/>
                        </Grid>
                    )}
                </Grid>
                <div>Footer</div>
            </>
        );
    }
}

export default Applayout;


// import React from 'react'
// import Header from './Header'
// import Title from '../shared/Title'
// import { Grid } from '@mui/material'
// import ChatList from '../specific/ChatList'
// import { samplechats } from '../../constants/Sampledata'
// import { useParams } from 'react-router-dom'
// import Profile from '../specific/Profile'

// const Applayout = () => (WrappedComponent)=> {
//     return(props)=>{
//       const params=useParams();
//       const chatId=params.id
//       const handelDeleteChat=(e,_id,groupChat)=>{
//         e.preventDefault();
//         console.log("delete"+_id)
//       }
//       return (
//   <>
//     <Title title={"chat app"}/> 
//     <Header/>
//     <Grid container height={'calc(100vh - 4rem)'}>
//       <Grid item sm={4} md={3} sx={{
//         display:{xs:"none", sm:"block"}
//       }} height={"100%"} >
//         <ChatList chats={samplechats} chatId={chatId}  handelDeleteChat={handelDeleteChat} />
//       </Grid>
//       <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} >
//       <WrappedComponent {...props}/>
//       </Grid>
//       <Grid item md={4} lg={3} sx={{
//         display:{xs:"none", md:"block",
//           padding:"2rem",
//         },
//         bgcolor:"rgba(0,0,0,0.85)"
//       }} height={"100%"}  >
//         <Profile/>
//       </Grid>
//     </Grid>
//     <div>Footer</div>
//     </>
//   )}
// }

// export default Applayout