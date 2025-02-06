const express = require('express')
const app = express.Router()
const {isAuthenticated}=require('../middlewares/auth')
const { newGroup, getmychat, getMyGroups, addnewmember, removemembers, leavegroup, sendAttachments, getchatdetails, renameGroup, deleteChat, getmessages } = require('../controllers/chats')
const { attachmentsmulter } = require('../middlewares/multer')
const { newGroupValidator, validateHandler, addmemberValidator, removememberValidator, leavegroupvalidator, sendAttachmentsvalidator, getmessagesvalidator, getchatdetailsvalidator, renamegroupvalidator } = require('../lib/validator')

app.use(isAuthenticated)

app.post('/newgroup',newGroupValidator(),validateHandler,newGroup)
app.get('/getmychat',getmychat)
app.get('/getmygroup',getMyGroups)
app.put('/addnewmember',addmemberValidator(),validateHandler,addnewmember)
app.put('/removemember',removememberValidator(),validateHandler,removemembers)
app.delete("/leave/:id",leavegroupvalidator(),validateHandler,leavegroup)

//send attachments
app.post("/message",attachmentsmulter,sendAttachmentsvalidator(),validateHandler,sendAttachments)

//get messages
app.get("/message/:id",getmessagesvalidator(),validateHandler,getmessages)

//get chat details,rename,delete'
app.route('/:id').get(getchatdetailsvalidator(),validateHandler ,getchatdetails).put(renamegroupvalidator(),validateHandler,renameGroup).delete(deleteChat)

module.exports=app