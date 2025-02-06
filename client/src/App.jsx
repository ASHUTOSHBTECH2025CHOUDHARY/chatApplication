import React, { lazy, Suspense, useEffect } from 'react';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import axios from 'axios';
import {server} from './constants/config';
import {useDispatch, useSelector} from 'react-redux';
import {userExists, userNotExist} from './redux/reducers/Auth';
import {Toaster} from 'react-hot-toast';
import { SocketProvider } from './socket';
const Home=lazy(()=> import("./pages/Home"));
const Groupes=lazy(()=> import("./pages/Groupes"));
const Chat=lazy(()=> import("./pages/Chat"));
const Login=lazy(()=> import("./pages/Login"));
const Notfound=lazy(()=> import("./pages/Notfound"));
const AdminLogin=lazy(()=> import("./pages/admin/AdminLogin"));
const AdminDashboard=lazy(()=> import("./pages/admin/Dashboard"));
const UserMangement=lazy(()=> import("./pages/admin/UserManagement"));  
const MessageMangement=lazy(()=> import("./pages/admin/MessageManagement"));
const ChatMangement=lazy(()=> import("./pages/admin/ChatManagement"));

const App = () => {
  const dispatch=useDispatch()
  const {user,loader}=useSelector(state=>state.auth)
  useEffect(()=>{
    axios.get(`${server}/user/myprofile`,{withCredentials:true}).then(({data})=>dispatch(userExists(data.user))).catch((err)=>dispatch(userNotExist()))
  },[dispatch])
  return loader?<LayoutLoader/>:(
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
      <Routes>
        <Route element={
          <SocketProvider>
            <ProtectRoute user={user}/> 
          </SocketProvider>
        }>
        <Route path='/' element={<Home/>}/>
        <Route path='/chat/:id'  element={<Chat/>}/>
        <Route path='/groupes' element={<Groupes/>}/>        
        </Route>
        <Route element={<ProtectRoute user={!user} redirect='/'/>}>
        <Route path='/login' element={<Login/>}/>
        </Route>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/UserManagement' element={<UserMangement/>}/>
        <Route path='/admin/MessageManagement' element={<MessageMangement/>}/>
        <Route path='/admin/ChatManagement' element={<ChatMangement/>}/>
        <Route path='*' element={<Notfound/>}/>
      </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </BrowserRouter>
  )
}

export default App