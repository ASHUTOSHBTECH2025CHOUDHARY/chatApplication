const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    content:{
        type:String,
    },
    attachments:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    chat:{
        type:mongoose.Types.ObjectId,
        ref:"ChatModel",
        required:true
    },
},{
    timestamps:true
});
const MessageModel=mongoose.model('MessageModel',schema);
module.exports =MessageModel;