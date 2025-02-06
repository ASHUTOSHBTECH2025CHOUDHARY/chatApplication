const express = require('express');
const app = express();
const {v2:cloudinary}=require('cloudinary')
const dotenv=require('dotenv');
dotenv.config({
    path:"./utils/.env"
});
const {ConnectDb}=require('./utils/features');
const {errormiddleware} = require('./middlewares/error');
const cookieParser=require('cookie-parser')
const {v4:uuid}=require('uuid')
const cors=require('cors')
app.use(express.json());

const userrouter=require('./routes/Userroutes');
const chatrouter=require('./routes/Chatroutes');
const adminrouter=require('./routes/Adminroutes');
const {createServer}=require('http')
const { Server } = require('socket.io');
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('./constants/events');
const { getSockets } = require('./lib/helper');
const MessageModel = require('./models/MessageModel');
const { corsoption } = require('./constants/config');
const { socketAuthenticator } = require('./middlewares/auth');
const userSocketIDs=new Map()
const MongoUrl=process.env.Mongo_Url;
const port=process.env.Port;
const adminSecertKey=process.env.ADMIN_SECRET_KEY||"6packprogrammer";
const envmode=process.env.NODE_ENV.trim()||"PRODUCTION"
module.exports={adminSecertKey,envmode}
ConnectDb(MongoUrl);
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const server=createServer(app)
const io=new Server(server,{
    cors:corsoption
})
app.use(cookieParser())
app.use(cors(corsoption))
app.use('/user',userrouter);
app.use('/chat',chatrouter);
app.use('/admin',adminrouter);
io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,async(err)=>{
        await socketAuthenticator(err,socket,next)
    })
})
app.set("io",io);
io.on("connection",(socket)=>{
    const user=socket.user
    userSocketIDs.set(user._id,socket.id)
    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
        const messageforrealtime={
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name
            }
            ,chat:chatId,
            createdAt: new Date().toISOString()
        }
        const messgeDB={
            content:message,
            sender:user._id,
            chat:chatId
        }
        const memberSocket=getSockets(members)
        io.to(memberSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageforrealtime
        })
        io.to(memberSocket).emit(NEW_MESSAGE_ALERT,{
            chatId
        })
        try {
            await MessageModel.create(messgeDB)
        } catch (error) {
            console.log(error)
        }
    })
    socket.on("disconnect",()=>{
        console.log("user dissconnected");
        userSocketIDs.delete(user._id.toString)
    })
})
app.use(errormiddleware)
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports=userSocketIDs