const EncryptContent=require('../models/encryptContent');
const PrivateInfo=require('../private');
const Request=require("request-promise");
const Redis=require('./redisService');
const utils=require('./utils')
const mongoose = require('mongoose');
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
    if(obj)return false;
    return obj.content;
}

/**
 * 调用微信接口获取token
 */
async function wxAccessToken(){
    url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+PrivateInfo.miniprogram_appid+"&secret="+PrivateInfo.miniprogram_secret;
    let options = {
        method: 'GET',
        uri: url
      };
    let wxret=JSON.parse(await Request(options))
    if(wxret.errcode&&wxret.errcode!=0){
        console.log("发送接口获取token失败"+wxret.errcode+wxret.errmsg);
        return wxAccessToken();
    }
    else return wxret;
}

/**
 * 获取accesstoken
 */
async function getAccessToken(){
    let access_token = await Redis.get("access_token");
    if(access_token!=null){
        return access_token;
    }
    else{
        let wxret = await wxAccessToken();
        await Redis.set("access_token",wxret.access_token);
        Redis.expire("access_token",wxret.expires_in);
        return wxret.access_token;
    }
}

/**
 * 获取带参二维码
 */
async function getWxQRCode(origincontent){
    let contentid=addEncryptContent(origincontent);
    let access_token=await getAccessToken();
    var url='https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+access_token;
    let bodyJson={
        "scene":"k="+contentid,
        "page":"pages/verificationinformation/verificationinformation"
    }
    let bodyContent=JSON.stringify(bodyJson)
    let options = {
        method: 'POST',
        uri: url,
        headers: {
            "content-type": "application/json",
            'Content-Length':bodyContent.length
        },
        body:bodyContent
      };
    var wxret=await Request(options)
    console.log(typeof(wxret));
    console.log("wxret.length is "+wxret.length)
    if(wxret.length>1000){
        let origin_buffer=Buffer.from(wxret);
        return origin_buffer;
    }
    else{
        if(utils.isJSON(wxret)){
            let wxretJson=JSON.parse(wxret);
            console.log("二维码请求失败"+wxretJson.errcode+wxretJson.errmsg);
            return null;
        }
    }
    return null;
}

function checkSign(params,sign){
    return utils.getSign()==sign
}

function test(){
    console.log("hh");
    wxAccessToken().then(e=>console.log(e))
}

module.exports={
    getEncryptContent:getEncryptContent,
    getWxQRCode:getWxQRCode,
    checkSign:checkSign
}