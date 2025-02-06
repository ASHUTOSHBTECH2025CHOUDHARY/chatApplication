import React from 'react';
import { transformImage } from '../../lib/Filefeature';
import { FileOpen } from '@mui/icons-material';

const RenderAttachment = (file,url) => {
  switch(file){
    case "video":
       return <video src={url} preload='none' width={"200px"} controls/>;
        
    case "image":   
       return <img src={transformImage(url,200)} width={"200px"} height={"150px"} style={{
            objectFit:"contain"
        }} alt="Attachment" />
        
    case "audio":
       return <audio src={url} preload='none' controls/>;
        
    default:
       return <FileOpen/>;
  }
}

export default RenderAttachment