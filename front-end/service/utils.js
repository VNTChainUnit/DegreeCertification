const md5=require('md5')
const secret="GgX5jYPe"
const crypto = require('crypto');


function aesEncrypt(data) {
    const cipher = crypto.createCipher('aes192', secret);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
 
function aesDecrypt(encrypted) {
    const decipher = crypto.createDecipher('aes192', secret);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

//两层加密的md5
function generateSafePassword(oldpassword){
    if(oldpassword==null || oldpassword=="")return null;
    else return md5(md5(oldpassword+secret));
}

function checkPassword(savepassword,checkpassword){
    return generateSafePassword(checkpassword)==savepassword;
}

function restful(code,data,msg){
    code=code||0;
    msg=msg||"";
    res= {
        code:code,
        data:data,
        msg:msg
    }
    if(Array.isArray(data)){
        res['count']=data.length;
        //修正没有数据的情况
        if(data[0]==null){
            res['data']=[]
        }
    }
    return res;
}

module.exports={
    generateSafePassword:generateSafePassword,
    restful:restful,
    checkPassword:checkPassword,
    aesEncrypt:aesEncrypt,
    aesDecrypt:aesDecrypt
}