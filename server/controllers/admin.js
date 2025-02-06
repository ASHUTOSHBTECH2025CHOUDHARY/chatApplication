const { tryCatch } = require("../middlewares/error");
const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");
const { ErrorHandler } = require("../utils/utility");
const jwt=require('jsonwebtoken')
const {cookieoptions}=require('../utils/features');

const adminLogin=tryCatch(async(req,res,next)=>{
    const {secretKey}=req.body;
    const adminSecertKey=process.env.ADMIN_SECRET_KEY||"6packprogrammer";
    const isMatch=secretKey===adminSecertKey
    if(!isMatch) return next(new ErrorHandler("You are not allowed",401));
    const token=jwt.sign(secretKey,process.env.JWT_SECRET);
    return res.status(200).cookie("chattu-admin-token",token,{...cookieoptions,maxAge:1000*15*60}).json({
        success:true,
        message:"Welcom BOSS"
    })
})

const getallusers=tryCatch(async(req,res,next)=>{
    const users=await UserModel.find({});

    const transformed=await Promise.all(
        users.map(async({_id,avatar,name,username})=>{
            const [groups,friends]=await Promise.all([
                ChatModel.countDocuments({groupChat:true,members:_id}),
                ChatModel.countDocuments({groupChat:false,members:_id})
            ])
            return{
                _id,
                username,
                name,
                groups,
                friends,
                avatar:avatar.url
            }
        })
    )
    return res.status(200).json({
        status:"success",
        data:transformed
    })
})

const allchats=tryCatch(async(req,res,next)=>{
    const chats=await ChatModel.find({}).populate("members","name avatar").populate("creator","name avatra");
    const transformed=await Promise.all(
        chats.map(async({members,_id,groupChat,name,creator})=>{
            const totalmessages=await MessageModel.countDocuments({chat:_id})
            return {
                _id,
                groupChat,
                name,
                avatar:members.slice(0,3).map((member)=>member.avatar.url),
                members:members.map(({_id,name,avatar})=>({
                    _id,
                    name,
                    avatar:avatar.url
                })),
                creator:{
                    name:creator?.name||"None",
                    avatar:creator?.avatar||""
                },
                totalmembers:members.length,
                totalmessages
            }
        })
    )
    res.status(200).json({
        success:true,
        transformed
    })
})

const allMessages=tryCatch(async(req,res,next)=>{
    const messages=await MessageModel.find({}).populate("sender","name avatar").populate("chat","groupChat")
    const transformedMessages = messages.map(
        ({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        attachments,
        content,
        createdAt,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender:
       { _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url
        },
        })
        );
    res.status(200).json({
        success:true,
        transformedMessages
    })
})

const getDashboardstats=tryCatch(async(req,res,next)=>{
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
    ChatModel.countDocuments({ groupChat: true }),
    UserModel.countDocuments(),
    MessageModel.countDocuments(),
    ChatModel.countDocuments(),
    ])
    const today=new Date();
    const last7Days=new Date();
    last7Days.setDate(last7Days.getDate()-7)
    const last7DaysMessages=await MessageModel.find({
        createdAt:{
            $gte:last7Days,
            $lte:today
        }
    }).select("createdAt")
    const messages=new Array(7).fill(0);
    const days=1000*60*60*24
    last7DaysMessages.forEach((message)=>{
        const indexApprox=(today.getTime()-message.createdAt.getTime())/days;
        const index=Math.floor(indexApprox);
        messages[6-index]++
    })
    const stats={
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart:messages
    }
    res.status(200).json({
        success:true,
        stats
    })
})

const adminlogout=tryCatch(async(req,res,next)=>{
    res.status(200).cookie("chattu-admin-token","",{
        ...cookieoptions,maxAge:0
    }).json({
        success:true,
        message:"Admin logout successfully"
    })
})

const getAdminData=tryCatch(async(req,res,next)=>{
    
    res.status(200).json({
        admin:true,
    })
})
module.exports={getallusers,allchats,allMessages,getDashboardstats,adminLogin,adminlogout,getAdminData}