const { ALERT, REFETCH_CHATS, NEW_ATTACHMENT, NEW_MESSAGE_ALERT,NEW_MESSAGE } = require('../constants/events')
const {getothermembers} = require('../lib/helper')
const { tryCatch } = require('../middlewares/error')
const ChatModel=require('../models/ChatModel')
const MessageModel = require('../models/MessageModel')
const UserModel = require('../models/UserModel')
const { emitEvent, deleteFilesFromCloudinary, uploadFilesToCloudinary } = require('../utils/features')
const { ErrorHandler } = require('../utils/utility')

const newGroup=tryCatch(async(req,res,next)=>{
    const{name,members}=req.body
    const allmembers=[...members,req.user]
    await ChatModel.create({
        name,
        groupChat:true,
        creator:req.user,
        members:allmembers
    })
    emitEvent(req,ALERT,allmembers,`Welcome to ${name} group chat`);
    emitEvent(req,REFETCH_CHATS,members)
    res.status(200).json({
        success:true,
        message:"group created"
    })
})

const getmychat=tryCatch(async(req,res,next)=>{
    const chats=await ChatModel.find({members:req.user}).populate("members","name avatar");
    const  transformedChats=chats.map(({_id,name,groupChat,members})=>{
    const othermembers=getothermembers(members,req.user)
    return {
            _id,
            groupChat,avatar:groupChat?members.slice(0,3).map(({avatar})=>avatar.url):[othermembers.avatar.url],
            name:groupChat?name:othermembers.name,
            members: members.reduce((prev,curr)=>{
                if(curr._id.toString()!==req.user.toString()){
                    prev.push(curr._id);
                }
                return prev;
            },[]),
        };
    });
    return res.status(201).json({
        success:true,
        transformedChats
    })
})

const getMyGroups=tryCatch(async(req,res,next)=>{
    const chats=await ChatModel.find({members:req.user,groupChat:true,creator:req.user}).populate("members","name avatar")
    const groups=chats.map(({members,_id,groupChat,name})=>({
        _id,
        groupChat,
        name,
        avatar:members.slice(0,3).map(({avatar})=>avatar.url)
    }))
    return res.status(200).json({
        success:true,
        groups
    })
});

const addnewmember=tryCatch(async(req,res,next)=>{
    const{chatId,members}=req.body
    const chat=await ChatModel.findById(chatId)
    if(!chat) return next(new ErrorHandler("Chat not found",404));
    if(!chat.groupChat) return next(new ErrorHandler("This is not a group chat",400));
    if(chat.creator.toString()!== req.user.toString()) return next(new ErrorHandler("You are not allowrd to add members",403))
    const allnewmemberpromise=members.map((i)=>UserModel.findById(i,"name"));
    const allnewmebers=await Promise.all(allnewmemberpromise);
    const uniquemembers=allnewmebers.filter((i)=>!chat.members.includes(i._id.toString())).map((i)=>i._id)
    chat.members.push(...uniquemembers)
    if(chat.members.length>50) return next(new ErrorHandler("Groups members limit reached",400))
    await chat.save()
    const allUsername=allnewmebers.map((i)=>i.name).join(",");
    emitEvent(req.ALERT,chat.members,`${allUsername} has been added to ${chat.name} group`);
    emitEvent(req,REFETCH_CHATS,chat.members)
    return res.status(200).json({
        success:true,
        msg:"Members added successfully"
    })
})

const removemembers=tryCatch(async(req,res,next)=>{
    const {userId, chatId}=req.body;
    const[chat,removeuser]=await Promise.all([ChatModel.findById(chatId),UserModel.findById(userId,"name")])
    if(!chat) return next(new ErrorHandler("Chat not found",404));
    if(!chat.groupChat) return next(new ErrorHandler("This is not a group chat",400));
    if(chat.creator.toString()!== req.user.toString()) return next(new ErrorHandler("You are not allowrd to add members",403))
    if(chat.members.length<=3) return next(new ErrorHandler("Group must have at least 3 members",400));
    chat.members=chat.members.filter(
        (member)=>member.toString()!==userId.toString()
    )
    await chat.save()
    emitEvent(
        req,
        ALERT,
        chat.members,
        `${removeuser} has been remove from ${chat.name}`
    )
    emitEvent(req,REFETCH_CHATS,chat.members)

    return res.status(200).json({
        success:true,
        msg:"Member remvoe successfully"
    })
})

const leavegroup=tryCatch(async(req,res,next)=>{
    const chatId=req.params.id;
    const chat=await ChatModel.findById(chatId);
    if(!chat) return next(new ErrorHandler("Chat not found",404));
    if(!chat.groupChat) return next(new ErrorHandler("This is not a group chat",400));
    const reminingmembers=chat.members.filter((member)=>member.toString()!==req.user.toString());
    if(reminingmembers.length<3){
        return next(new ErrorHandler("Group at least have 3 members",400))
    }
    if(chat.creator.toString()===req.user.toString()){
        const randomNumber=Math.floor(Math.random()*reminingmembers.length);
        const newCreator=reminingmembers[randomNumber];
        chat.creator=newCreator
    }
    chat.members=reminingmembers
    const [user]=await Promise.all([UserModel.findById(req.user,"name")]);
    await chat.save()
    emitEvent(req,ALERT,chat.members,`User ${user.name} has left the group`)

    res.status(200).json({
        success:true,
        message:"member leaved successfully"
    })
})

const sendAttachments=tryCatch(async(req,res,next)=>{
    const {chatId}=req.body;
    const files=req.files||[];
    const [chat,me]=await Promise.all([ChatModel.findById(chatId),UserModel.findById(req.user,"name")]);
    if(files.length<1) return next(new ErrorHandler("please provide attachments",400));
    if(files.length>5) return next(new ErrorHandler("please provide attachments 1-5",400));
    if(!chat) return next(new ErrorHandler("Chat not found",404));
   
    const attachments=await uploadFilesToCloudinary(files)
    const messageforDb={content:"",attachments,sender:me._id,chat:chatId}
    const messageforrealtime={...messageforDb,sender:{_id:me._id,name:me.name}};
    const message=await MessageModel.create(messageforDb)
    emitEvent(req,NEW_MESSAGE,chat.members,{
        message:messageforrealtime,
        chatId
    })
    emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId})
    res.status(200).json({
        success:true,
        message
    })
})

const getchatdetails=tryCatch(async(req,res,next)=>{
    if(req.query.populate === "true"){
        const chat=await ChatModel.findById(req.params.id).populate("members","name avatar").lean();
        if(!chat) return next(new ErrorHandler("Chat not found",404));
        chat.members.map(({_id,name,avatar})=>({
            _id,
            name,
            avatar:avatar.url
        }))
        return res.status(200).json({
            success:true,
            chat
        })
    }else{
        const chat=await ChatModel.findById(req.params.id);
        if(!chat) return next(new ErrorHandler("Chat not found",404));
        return res.status(200).json({
            success:true,
            chat
        })
    }
})

const renameGroup=tryCatch(async(req,res,next)=>{
    const chatId=req.params.id;
    const {name}=req.body;
    const chat=await ChatModel.findById(chatId);
    if(!chat) return next(new ErrorHandler("chat not found",404));
    if(!chat.groupChat) return next(new ErrorHandler("this is not a group chat",400));
    if(chat.creator.toString()!== req.user.toString()) return next(new ErrorHandler("You are not allowrd to add members",403));
    chat.name=name;
    await chat.save();
    emitEvent(req,REFETCH_CHATS,chat.members);
    return res.status(200).json({
        success:true,
        message:"Group renamed successfully"
    })
})

const deleteChat=tryCatch(async(req,res,next)=>{
    const chatId=req.params.id;
    const chat=await ChatModel.findById(chatId);
    if(!chat) return next(new ErrorHandler("chat not found",404));
    const members=chat.members
    if(chat.groupChat&&chat.creator.toString()!==req.user.toString()){
        return next(new ErrorHandler("You are not allowed to delete the group",403));
    }
    if(!chat.groupChat && !chat.members.includes(req.user.toString())){
        return next(new ErrorHandler("You are not allowed to delete the chat",403));
    }
    const messageWithAttachments=await MessageModel.find({
        chat:chatId,
        attachments:{$exists:true,$ne:[]}
    })
    const  public_ids=[];
    messageWithAttachments.forEach(({attachments})=>{
        attachments.forEach(({public_id})=>{
            public_ids.push(public_id); 
        })
    })

    await Promise.all([
        deleteFilesFromCloudinary(public_ids),chat.deleteOne(),MessageModel.deleteMany({chat:chatId})
    ])
    emitEvent(req,REFETCH_CHATS,chat.members);
    res.status(200).json({
        success:true,
        message:"Chat deleted successfully"
    })
})

const getmessages=tryCatch(async(req,res,next)=>{
    const chatId=req.params.id
    const {page=1}=req.query;
    const resultperpage=20;
    const skip=(page-1)*resultperpage;
    const [messages,totalMessagesCount]=await Promise.all([
        MessageModel.find({chat:chatId}).
        sort({createdAt:-1}).
        skip(skip).
        limit(resultperpage).
        populate("sender","name").lean(),
        MessageModel.countDocuments({chat:chatId})
    ])
    const totalpages=Math.ceil(totalMessagesCount/resultperpage)||0;
    res.status(200).json({
        success:true,
        totalpages,

        message:messages.reverse()
    })
})

module.exports={newGroup,getmychat,getMyGroups,addnewmember,removemembers,leavegroup,sendAttachments,getchatdetails,renameGroup,deleteChat,getmessages}