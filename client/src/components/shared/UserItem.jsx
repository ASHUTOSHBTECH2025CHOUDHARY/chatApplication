import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import {Add as AddIcon,Remove as Close} from "@mui/icons-material"
import { transformImage } from '../../lib/Filefeature'
const UserItem = ({user, handler, handlerIsLoading,isAdded=false,styling={}}) => {
    const {name,_id,avatar}=user
  return (
    <ListItem>
        <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            width={"100%"}
            {...styling}
        >
            <Avatar src={transformImage(avatar)}/>
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
            >{name}</Typography>
            <IconButton 
                sx={{
                    bgcolor:!isAdded?"primary.main":"error.main",
                    color:"white",
                    "&:hover":{
                        bgcolor:!isAdded?"primary.dark":"error.dark",
                    }
                }}
            onClick={()=>handler(_id)} disabled={handlerIsLoading}>
                {
                    isAdded?<Close/>:<AddIcon/>
                }
            </IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)