import React, { memo } from 'react';
import { Link } from '../styles/StyleComponents';
import { Stack, Typography, Box } from '@mui/material';
import AvatarCard from './AvatarCard';
const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isonline,
  newMessageAlert = {
    chatId: "",
    count: 0,
  },
  index = 0,
  handelDeleteChat,
}) => {
  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e) => handelDeleteChat(e, _id, groupChat)} sx={{ padding: "0rem" }}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: 'center',
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative"
        }}
      >
        <AvatarCard avatar={avatar}/>
        <Stack>
          <Typography>{name}</Typography>
          {
            newMessageAlert.count > 0 && 
            <Typography>
              {newMessageAlert.count} New Messages
            </Typography>
          }
        </Stack>
        {isonline && ( // Corrected here
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translate(-50%)",
              backgroundColor: "green"
            }}
          />
        )}
      </div>
    </Link>
  );
}

export default memo(ChatItem);