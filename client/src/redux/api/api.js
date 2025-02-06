import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config';

const api=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:`${server}`}),
    tagTypes:["Chat","User","Message"],
    endpoints:(builder)=>({
        myChats:builder.query({
            query:()=>({
                url:'chat/getmychat',
                credentials:"include"
            }),
            providesTags:["Chat"]
        }),
        serachUser:builder.query({
            query:(name)=>({
                url:`user/searchuser?name=${name}`,
                credentials:"include"
            }),
            providesTags:["User"]
        }),
        sendFriendRequest:builder.mutation({
            query:(data)=>({
                url:"user/sendrequest",
                method:"PUT",
                credentials:"include",
                body:data
            }),
            invalidatesTags:["User"]
        }),
        getNotifications:builder.query({
            query:(name)=>({
                url:`user/notifications`,
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
        acceptFriendRequest:builder.mutation({
            query:(data)=>({
                url:"user/acceptrequest",
                method:"PUT",
                credentials:"include",
                body:data
            }),
            invalidatesTags:["Chat"]
        }),
        chatdetails:builder.query({
            query:({chatId,populate=false})=>{
                let url=`chat/${chatId}`;
                if(populate) url+="?populate=true";
                return{
                    url,
                    credentials:"include"
                }
            },
            providesTags:["Chat"]
        }),
        getmessages:builder.query({
            query:({chatId,page})=>({
                url:`chat/message/${chatId}?page=${page}`,
                credentials:"include"
            }),
            providesTags:["Message"]
        }),
        sendAttachments:builder.mutation({
            query:(data)=>({
                url:"chat/message",
                method:"POST",
                credentials:"include",
                body:data
            }),
        }),
    })
});

export default api;
export const {useMyChatsQuery,useLazySerachUserQuery,useSendFriendRequestMutation,useGetNotificationsQuery,useAcceptFriendRequestMutation,useChatdetailsQuery,useGetmessagesQuery,useSendAttachmentsMutation}=api;