const EncryptContent=require('../models/encryptContent');

/**
 * 加密内容放数据库
 * @param {加密的长内容} encryptContent 
 */
function addEncryptContent(encryptContent){
    let id=new mongoose.Types.ObjectId;
    let obj=new EncryptContent({
        _id:id,
        content:encryptContent
    })
    obj.save()
    return id;
}

async function getEncryptContent(id){
    let obj=await EncryptContent.findById(id);
    return obj.content;
}

function getWxQRCode(){
    
}

module.exports={
    getEncryptContent:getEncryptContent    
}