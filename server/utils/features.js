const mongoose=require('mongoose')
const jwt =require('jsonwebtoken')
const {v4:uuid}=require('uuid')
const {v2:cloudinary}=require('cloudinary')
const { getBase64} = require('../lib/helper')
// const { getSockets } = require('../app')
const cookieoptions={
    maxAge:24*60*60*1000,
    sameSite:"none",
    httpOnly:true,
    secure:true
}
const ConnectDb=(url)=>{
        mongoose.connect(url,{dbName:"Chatu"}).then(()=>console.log("Db is connected")).catch((err)=>{
            console.log(err)
        })
}

const sendToken=(res,user,code,message)=>{
    const token= jwt.sign({_id:user._id},process.env.JWT_SECRET)

    return res.status(code).cookie("chattu-token",token,cookieoptions).json({
        success:true,
        message
    });
}

const emitEvent=(req,event,users,data)=>{
    // const io=req.app.get("io")
    // const  usersocket=getSockets(users);
    // console.log("users",usersocket)
}

const deleteFilesFromCloudinary=async(req,res)=>{
    console.log("delete files")
}

const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(getBase64(file), {
        resource_type:"auto",
        public_id:uuid()
    }, (error, result) =>{
    if (error) return reject(error);
    resolve(result);
    });
    });
    });
    try {
        const results=await Promise.all(uploadPromises);
        const fromattedResults=results.map((result)=>({
            public_id:result.public_id,
            url:result.secure_url
        }))
        return fromattedResults
    } catch (error) {
        throw new Error("Error uploading files on cloudinary",error)
    }
};
module.exports={ConnectDb,sendToken,cookieoptions,emitEvent,deleteFilesFromCloudinary,uploadFilesToCloudinary}