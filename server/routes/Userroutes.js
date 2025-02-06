const express = require('express');
const router = express.Router();
const {newUser, login, getmyprofile, logout, searchUser, sendrequest, acceptrequest, Notifications, getNotifications, getmyfriends}=require('../controllers/user');
const {singleavatar} = require('../middlewares/multer');
const { isAuthenticated } = require('../middlewares/auth');
const { registervalidator, validateHandler, loginvalidator, sendAttachmentsvalidator, sendrequestvalidator, acceptrequestvalidator } = require('../lib/validator');


router.post('/newuser',singleavatar,registervalidator(),validateHandler,newUser)
router.post('/login',loginvalidator(),validateHandler,login)


router.use(isAuthenticated)
router.get('/myprofile',getmyprofile)
router.get('/logout',logout)
router.get('/searchuser',searchUser)
router.put('/sendrequest',sendrequestvalidator(),validateHandler,sendrequest)
router.put('/acceptrequest',acceptrequestvalidator(),validateHandler,acceptrequest)
router.get('/notifications',getNotifications)
router.get('/getmyfriends',getmyfriends)
module.exports = router;