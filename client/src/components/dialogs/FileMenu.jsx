import { ListItem, ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/api/misc';
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon} from '@mui/icons-material';
import {toast} from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api';
const FileMenu = ({anchoreE1,chatId}) => {
  const {isfilemenu}=useSelector(state=>state.misc);
  const dispatch=useDispatch()
  const closeFileMenu=()=>dispatch(setIsFileMenu(false));
  const Imageref=useRef(null)
  const Videoref=useRef(null)
  const Audioref=useRef(null)
  const Fileref=useRef(null)
  const [sendAttachments]=useSendAttachmentsMutation()

  const selectImage=()=>Imageref.current?.click();
  const selectAudio=()=>Audioref.current?.click();
  const selectVideo=()=>Videoref.current?.click();
  const selectFile=()=>Fileref.current?.click();
  const filechangehandler=async(e,key)=>{
      const files=Array.from(e.target.files);
      if(files.length<=0) return;
      if(files.length>5) return toast.error(`You can only send upto 5 ${key}at a time`);
      dispatch(setUploadingLoader(true))
      const toastId=toast.loading(`Sending ${key}...`);
      closeFileMenu()
      try {
        const myform=new FormData();
        myform.append("chatId",chatId);
        files.forEach((file)=>myform.append("files",file))
        const res=await sendAttachments(myform)
        if(res.data) toast.success(`${key} sent successfully`,{
          id:toastId
        })
        else {
          console.log(res.data)
          toast.error(`Failed to send ${key}`,{
          id:toastId
        })}
      } catch (error) {
        toast.error(error,{id:toastId})
      }
      finally{
        dispatch(setUploadingLoader(false))
      }
  }
  return (
    <Menu anchorEl={anchoreE1} open={isfilemenu} onClose={closeFileMenu}>
      <div style={{
        width:"10rem"
      }}>  
        <MenuList>
          <MenuItem onClick={selectImage}>
              <Tooltip title="Image">
                    <ImageIcon/>
              </Tooltip>
              <ListItemText style={{
                "marginLeft":"0.5rem"
              }}>Image</ListItemText>
              <input type='file' multiple accept='image/png, image/jpeg, image/gif'
              style={{display:"none"}} onChange={(e)=>filechangehandler(e,"Images")} ref={Imageref}/>
          </MenuItem>
          
          <MenuItem onClick={selectAudio}>
              <Tooltip title="Audio">
                    <AudioFileIcon/>
              </Tooltip>
              <ListItemText style={{
                "marginLeft":"0.5rem"
              }}>Audio</ListItemText>
              <input type='file' multiple accept='audio/mpeg, audio/wav'
              style={{display:"none"}} onChange={(e)=>filechangehandler(e,"Audio")} ref={Audioref}/>
          </MenuItem>
          
          <MenuItem onClick={selectVideo}>
              <Tooltip title="Video">
                    <VideoFileIcon/>
              </Tooltip>
              <ListItemText style={{
                "marginLeft":"0.5rem"
              }}>Video</ListItemText>
              <input type='file' multiple accept='video/mp4, video/webm, video/ogg'
              style={{display:"none"}} onChange={(e)=>filechangehandler(e,"Videos")} ref={Videoref}/>
          </MenuItem>

          <MenuItem onClick={selectFile}>
              <Tooltip title="File">
                    <UploadFileIcon/>
              </Tooltip>
              <ListItemText style={{
                "marginLeft":"0.5rem"
              }}>Files</ListItemText>
              <input type='file' multiple accept='image/png, image/jpeg, image/gif'
              style={{display:"none"}} onChange={(e)=>filechangehandler(e,"Files")} ref={Fileref}/>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu