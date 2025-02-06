const ChatModel = require('../models/ChatModel');
const MessageModel = require('../models/MessageModel');
const UserModel=require('../models/UserModel')
const {faker, simpleFaker}=require('@faker-js/faker')  
const CreateUser=async(numUsers)=>{
    try{
        const usersPromise=[];
        for(let i=0;i<numUsers;i++){
            const tempuser= UserModel.create({
                name:faker.person.fullName(),
                username: faker.internet.userName(),
                bio:faker.lorem.sentence (10),
                password: "password",
                avatar: {
                            url:faker.image.avatar(),
                            public_id:faker.system.fileName()
                }
            })
            usersPromise.push(tempuser)
        }
        await Promise.all(usersPromise)
            console.log("users created ",numUsers)
            process.exit(1)
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}

const createSingleChats=async(chatscount)=>{
    try {
        const users = await UserModel.find().select("_id");
        const chatsPromise = [];
        for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
        chatsPromise.push(ChatModel.create({
        name: faker.lorem.words(2),
        members: [users[i], users[j]],
        })
        );
        }
    }
    await Promise.all(chatsPromise);
    console.log("Chats created successfully");
    process.exit();
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

const creategroupchats=async(numChats)=>{
    try {
        const users = await UserModel.find().select("_id");
        const chatsPromise = [];
        for (let i = 0; i < numChats; i++) {
            const numMembers = simpleFaker.number.int({ min: 3, max:
            users.length });
            const members = [];
            for (let i = 0; i < numMembers; i++) {
                const randomIndex = Math.floor(Math.random() * users.
                length);
                const randomUser = users [randomIndex];
                // Ensure the same user is not added twice
                if (!members.includes(randomUser)) {
                            members.push(randomUser);}
            }
            const chat=ChatModel.create({
                groupChat:true,
                name:faker.lorem.words(1),
                members,
                creator:members[0]
            })
            chatsPromise.push(chat)
        }
        await Promise.all(chatsPromise);
        console.log("chats create successfully");
        process.exit()
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const createmessages=async(numMessages)=>{
    try {
        const users = await UserModel.find().select("_id");
        const chats = await ChatModel.find().select("_id");
        const messagesPromise = [];
        for (let i = 0; i < numMessages; i++) {
            const randomUser= users [Math.floor(Math.random() *users.length)]
            const randomChat = chats [Math.floor(Math.random() * chats. length)];
            messagesPromise.push(
            MessageModel.create({
            chat: randomChat,
            sender: randomUser,
            content: faker.lorem.sentence(),
            }))
        }
            await Promise.all(messagesPromise);
        console.log("Message Created Successfully")
        process.exit()
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const createMessagesInChats=async(chatId,numMessages)=>{
    try {
        const users=await UserModel.find().select("_id");
        const messagesPromise=[];
        for(let i=0;i<numMessages;i++){
            const randomUser=users[Math.floor(Math.random()*users.length)];
            messagesPromise.push(MessageModel.create({
                chat:chatId,
                sender:randomUser,
                content:faker.lorem.sentence()
            }))
        }
        await Promise.all(messagesPromise);
        console.log("Message created Sucessfully");
        process.exit();
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
module.exports={CreateUser,createSingleChats,creategroupchats,createmessages,createMessagesInChats}