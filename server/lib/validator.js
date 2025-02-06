const {body,validationResult,check,param}=require('express-validator');
const { ErrorHandler } = require('../utils/utility');

const validateHandler=(req,res,next)=>{
    const errors=validationResult(req);
    const errorMessages=errors.array().map((error)=>error.msg).join(",")
    if(errors.isEmpty()) return next()
    else return next(new ErrorHandler(errorMessages,400))
}

const registervalidator=()=>[
    body("name","Please Enter Name").notEmpty(),
    body("username","Please Enter username").notEmpty(),
    body("bio","Please Enter bio").notEmpty(),
    body("password","Please Enter Password").notEmpty()
]

const loginvalidator=()=>[
    body("username","Please Enter username").notEmpty(),
    body("password","Please Enter Password").notEmpty(),
]

const newGroupValidator=()=>[
    body("name","Please Enter Name").notEmpty(),
    body("members",).notEmpty().withMessage("Please Enter Members").isArray({min:2,max:100}).withMessage("Members must be 2-100"),
]

const addmemberValidator=()=>[
    body("chatId","Please Enter chat ID").notEmpty(),
    body("members",).notEmpty().withMessage("Please Enter Members").isArray({min:1,max:97}).withMessage("Members must be 1-97"),
]

const removememberValidator=()=>[
    body("userId","Please Enter user ID").notEmpty(),
    body("chatId","Please Enter chat ID").notEmpty(),
]

const leavegroupvalidator=()=>[
    param("id","Please Enter chat ID").notEmpty(),
]

const sendAttachmentsvalidator=()=>[
    body("chatId","Please Enter Chat ID").notEmpty(),
    
]
const getmessagesvalidator=()=>[
    param("id","Please Enter chat ID").notEmpty(),
]

const getchatdetailsvalidator=()=>[
    param("id","Please Enter chat ID").notEmpty(),
]

const renamegroupvalidator=()=>[
    param("id","Please Enter chat ID").notEmpty(),
    body("name","Please Enter the name").notEmpty()
]

const deletevalidator=()=>[
    param("id",'Please enter chat ID').notEmpty()
]

const sendrequestvalidator=()=>[
    body("userId","Please Enter the user ID").notEmpty()
]

const acceptrequestvalidator=()=>[
    body("requestId","Please Enter the Request ID").notEmpty(),
    body("accept").notEmpty().withMessage("Please Add accept").isBoolean().withMessage("Accept must be boolean")
]
const adminkeyvalidator=()=>[
    body("secretKey","Please Enter secret Key").notEmpty()
]
module.exports={registervalidator,validateHandler,loginvalidator,newGroupValidator,addmemberValidator,removememberValidator,leavegroupvalidator,sendAttachmentsvalidator,getmessagesvalidator,getchatdetailsvalidator,renamegroupvalidator,deletevalidator,sendrequestvalidator,acceptrequestvalidator,
    adminkeyvalidator
}