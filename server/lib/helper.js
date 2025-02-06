const userSocketIDs = require("../app")

const getothermembers=(members,userId)=>{
    return members.find((member)=>member._id.toString()!==userId.toString())
}

const getSockets=(users=[])=>{
    const sockets=users.filter(user => user?._id).map(user=>userSocketIDs.get(user?._id.toString()));
    return sockets
}

const getBase64=(file)=>`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

module.exports={getothermembers,getSockets,getBase64}