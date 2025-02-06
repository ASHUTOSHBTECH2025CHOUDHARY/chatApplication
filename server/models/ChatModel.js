const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    groupChat:{
        type:Boolean,
        default:false
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"UserModel"
    },
    members:[{
        type:mongoose.Types.ObjectId,
        ref:"UserModel"
    }]
},{
    timestamps:true
});
const ChatModel=mongoose.model('ChatModel',schema);
module.exports =ChatModel;