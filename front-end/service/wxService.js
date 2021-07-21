const EncryptContent=require('../models/encryptContent');
const PrivateInfo=require('../private');
const Request=require("request-promise");
const request=require('request')
const Redis=require('./redisService');
const utils=require('./utils')
const mongoose = require('mongoose');
const fs=require('fs')
/**
 * 加密内容放数据库
 * @param {加密的长内容} encryptContent 
 */
async function addEncryptContent(encryptContent){
    //先查是否有了，有的话直接返回
    let encr = await EncryptContent.findOne({content:encryptContent})
    if(encr){
        return encr._id;
    }
    else{
        let id=new mongoose.Types.ObjectId;
        let obj=new EncryptContent({
            _id:id,
            content:encryptContent
        })
        obj.save()
        return id;  
    }
    
}

function saveFileName(contentid,filename){
    EncryptContent.updateOne({_id:contentid},{filename:filename},(err,doc)=>{
        if(err){
            console.log(err)
        }
    })
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
        Redis.expire("access_token",wxret.expires_in-10);
        return wxret.access_token;
    }
}

/**
 * 获取带参二维码,放入本地
 */
async function saveWxQrcode(origincontent){
    let contentid=await addEncryptContent(origincontent);
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
    let filename=Date.now()+".png";
    let writeStream = fs.createWriteStream("./picture/"+filename);
    let reqt = request(url,options)
    reqt.pipe(writeStream);
    reqt.on('end', function() {
        writeStream.end();
        let fileStr=fs.readFileSync("./picture/"+filename).toString("utf-8")
        if(fileStr.length<1000){
            if(utils.isJSON(fileStr)){
                return null;
            }
        }
        saveFileName(contentid,filename);
    });
    console.log("返回了");
    return filename;
}

function checkSign(params,sign){
    return utils.getSign()==sign
}

/**
 * 
 * @param {加密内容} content 
 * @returns 已经保存的图片名，如果没有保存为空
 */
async function getWxQrcodeFilenameByContent(content){
    let encr = await EncryptContent.findOne({content:encryptContent})
    if(encr){
        return encr.filename;
    }
    else return null;
}

module.exports={
    getEncryptContent:getEncryptContent,
    saveWxQrcode:saveWxQrcode,
    checkSign:checkSign,
    getWxQrcodeFilenameByContent:getWxQrcodeFilenameByContent
}