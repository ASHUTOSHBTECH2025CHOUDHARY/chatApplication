const express=require('express');
const { getallusers, allchats, allMessages, getDashboardstats, adminLogin, adminlogout, getAdminData } = require('../controllers/admin');
const { adminkeyvalidator, validateHandler, } = require('../lib/validator');
const { adminOnly } = require('../middlewares/auth');
const app=express.Router()

app.post("/verify",adminkeyvalidator(),validateHandler,adminLogin);
app.use(adminOnly)
app.get("/",getAdminData);
app.get("/users",getallusers);
app.get("/chats",allchats);
app.get("/logout",adminlogout);
app.get("/messages",allMessages);
app.get("/stats",getDashboardstats);

module.exports=app