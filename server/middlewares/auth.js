const UserModel = require("../models/UserModel");
const { ErrorHandler } = require("../utils/utility");
const { tryCatch } = require("./error");
const jwt=require('jsonwebtoken')
const   isAuthenticated=(req,res,next)=>{
    const token=req.cookies["chattu-token"];
    if(!token) return  next(new ErrorHandler("please log in to access this route",401));
    const decodedData=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decodedData._id
    next()
}

const adminOnly=(req,res,next)=>{
    const token=req.cookies["chattu-admin-token"];
    if(!token) return  next(new ErrorHandler("please log in to access this route",401));
    const secretKey=jwt.verify(token,process.env.JWT_SECRET);
    const adminSecertKey=process.env.ADMIN_SECRET_KEY||"6packprogrammer";
    const isMatch=secretKey===adminSecertKey
    if(!isMatch) return next(new ErrorHandler("You are not allowed",401));
    next()
}

const socketAuthenticator=async(err,socket,next)=>{
    try {
        if(err) return next(new ErrorHandler("SocketAutheticatoin error"),401)
        const authToken=socket.request.cookies["chattu-token"]
        if(!authToken) return next(new ErrorHandler("SocketAuthention error",402))
        const decodedData=jwt.verify(authToken,process.env.JWT_SECRET)
        const user=await UserModel.findById(decodedData._id);
        if(!user) return next(new ErrorHandler("SocketAuthention error",403))
        
        socket.user=user
        return next()
        
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler("SocketAutheticatoin error"),404)
    }
}
module.exports={isAuthenticated,adminOnly,socketAuthenticator}