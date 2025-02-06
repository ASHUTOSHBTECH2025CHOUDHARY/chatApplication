const multer=require('multer')

const multerUplods=multer({
    limits:{
        fieldSize:1024*1024*5
    }
})

const singleavatar=multerUplods.single("avatar")
const attachmentsmulter=multerUplods.array("files",5)
module.exports ={singleavatar,attachmentsmulter}