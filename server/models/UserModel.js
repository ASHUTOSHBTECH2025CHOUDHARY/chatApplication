const mongoose=require('mongoose');
const {hash}=require('bcrypt')
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    bio:{
        type:String
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
},{
    timestamps:true
});
schema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password=await hash(this.password,10)
})
const UserModel=mongoose.model('UserModel',schema);
module.exports =UserModel;