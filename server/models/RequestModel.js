const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
     sender:{
            type:mongoose.Types.ObjectId,
            ref:"UserModel",
            required:true
        },
        reciver:{
            type:mongoose.Types.ObjectId,
            ref:"UserModel",
            required:true
        }
},{
    timestamps:true
});
const RequestModel=mongoose.model('RequestModel',schema);
module.exports =RequestModel;