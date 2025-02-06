import React from 'react';
import { Stack } from '@mui/material';
import ChatItem from '../shared/ChatItem';

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessageAlert = [
    {
      chatId,
      count: 0,
    },
  ],
  handelDeleteChat,
}) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"}
    height={"100%"}>
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;
        const newMessage = newMessageAlert.find(({ chatId }) => chatId === _id) || { count: 0 };
        
        const isonline = members?.some((member) => onlineUsers.includes(member));
        return (
          <ChatItem
            avatar={avatar}
            name={name}
            _id={_id}
            groupChat={groupChat}
            isonline={isonline}
            index={index}
            key={_id}
            sameSender={chatId === _id}
            newMessageAlert={newMessage}
            handelDeleteChat={handelDeleteChat}
          />
        );
      })}
    </Stack>
  );
}

export default ChatList;