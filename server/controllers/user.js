const { compare } = require('bcrypt');
const UserModel=require('../models/UserModel');
const ChatModel=require('../models/ChatModel');
const RequestModel=require('../models/RequestModel')
const { sendToken, cookieoptions, emitEvent, uploadFilesToCloudinary } = require('../utils/features');
const { tryCatch } = require('../middlewares/error');
const { ErrorHandler } = require('../utils/utility');
const { NEW_REQUEST, REFETCH_CHATS } = require('../constants/events');
const { getothermembers } = require('../lib/helper');

const newUser=tryCatch(async(req,res,next)=>{
    const {name,username,password,bio}=req.body;
    const file=req.file
    if(!file) return next(new ErrorHandler("Please Provide avatar"))
    const reuslt=await uploadFilesToCloudinary([file])
    const avatar={
        public_id:reuslt[0].public_id,
        url:reuslt[0].url
    }
    const user=await UserModel.create({
        name,username,avatar,password,bio
    })
    sendToken(res,user,200,"User Created");
})

const login=tryCatch(async(req,res,next)=>{
    const {username,password}=req.body
    const user=await UserModel.findOne({username}).select("+password");
    if(!user) return next(new Error("Invalid Username",404))
    const isMatch=await compare(password,user.password);
    if(!isMatch) return next(new Error("Invalid password",404))
    sendToken(res,user,200,`Welcom ${user.username}`)
})

const getmyprofile=tryCatch(
    async(req,res)=>{
    const users=await UserModel.findById(req.user);  
    res.status(200).json({
        success:true,
        user:users
    })
})

const logout=tryCatch(
    async(req,res)=>{
        return res.status(200).cookie("chattu-token","",{...cookieoptions,maxAge:0}).json({
            success:true,
            message:"Logged out Successfully"
        })
    }
)

const searchUser=tryCatch(
    async(req,res)=>{
        const {name}=req.query;
        const mychats=await ChatModel.find({groupChat:false,members:req.user});
        const allusermychats=mychats.map((chat)=>chat.members).flat();
        const alluserexceptmeandfriends=await UserModel.find({
            _id:{$nin:allusermychats},
            name:{$regex:name,$options:"i"}
        })
        const users=alluserexceptmeandfriends.map(({_id,name,avatar})=>({
            _id,name,avatar:avatar.url
        }))
        return res.status(200).json({
            success:true,
            users
        })
    }
)

const sendrequest=tryCatch(async(req,res,next)=>{
    const {userId}=req.body;
    const request=await RequestModel.findOne({
        $or:[
            {sender:req.user,reciver:userId},
            {sender:userId,reciver:req.user}
        ]
    });
    if(request) return next(new ErrorHandler("Request already sent",400))
    await RequestModel.create({
        sender:req.user,
        reciver:userId
    })
    emitEvent(req,NEW_REQUEST,[userId])
    res.status(200).json({
        success:true,
        message:"Friend request successfully    "
    })
})

const acceptrequest=tryCatch(async(req,res,next)=>{
    const {requestId,accept}=req.body
    const request=await RequestModel.findById(requestId).populate("sender","name").populate("reciver","name");

    if(!request) return next(new ErrorHandler("Request is not found",404));
    if(request.reciver._id.toString()!==req.user.toString()){
        return next(new ErrorHandler("You are not authorized to accept it",401));
    }
    if(!accept) return res.status(200).json({
        success:true,
        message:"Friend Request Rejected"
    })
    console.log(request.reciver)
    const members=[request.sender._id,request.reciver._id];
    await Promise.all([ChatModel.create({members,name:`${request.sender.name}-${request.reciver.name}`}),request.deleteOne()]);
    
    emitEvent(req,REFETCH_CHATS,members);
    return res.status(200).json({
        success:true,
        message:"Friend Request Accepted",
        sender:request.sender._id,
        receiver:request.reciver._id
    })
})

const getNotifications=tryCatch(async(req,res,next)=>{
    const requests=await RequestModel.find({reciver:req.user}).populate("sender","name avatar");
    const allRequest=requests.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url
        }
    }));
    res.status(200).json({
        success:true,
        allRequest
    })
})

const getmyfriends=tryCatch(async(req,res,next)=>{
    const chatId=req.query.chatId;
    const chats=await ChatModel.find({
        members:req.user,
        groupChat:false
    }).populate("members","name avatar");
    const friends=chats.map(({members})=>{
        const otherUser=getothermembers(members,req.user);
        return {
            _id:otherUser._id,
            name:otherUser.name,
            avatar:otherUser.avatar.url
        }
    })
    if(chatId){
        const chat=await ChatModel.findById(chatId);
        const availableFriends=friends.filter((friend)=>!chat.members.includes(friend._id))
        return res.status(200).json({
            availableFriends
        })
    }
    else{
        return res.status(200).json({
            friends
        })
    }
})
module.exports={newUser, login,getmyprofile,logout,searchUser,sendrequest,acceptrequest,getNotifications,getmyfriends}