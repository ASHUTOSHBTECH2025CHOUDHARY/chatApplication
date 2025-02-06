const errormiddleware=(err,req,res,next)=>{
    err.message||="Interal server issue"
    err.statusCode||=500

    if(err.code===11000){
        err.message=`Duplicate fields ${Object.keys(err.keyPattern).join(",")}`,
        err.statusCode=400
    }
    if(err.name==="CastError"){
        err.message="Invalid Format of ID",
        err.statusCode=400
    }
    return res.status(err.statusCode).json({
        success:false,
        message:process.env.NODE_ENV.trim()==="DEVELOPMENT"?err:err.message     
    })
}
const tryCatch=(passedFunc)=>async(req,res,next)=>{
    try {
        await passedFunc(req,res,next)
    } catch (error) {
        next(error)
    }
}
module.exports={errormiddleware,tryCatch}