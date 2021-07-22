const md5=require('md5')
const secret="GgX5jYPe"
const crypto = require('crypto');
const Config=require('../config')

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
    else return md5(md5(oldpassword)+secret);
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

function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
}

function getDateStr(date){
    function pad(n) {return n<10 ? "0"+n : n}
    d=date
    dash="-"
    colon=":"
    return d.getFullYear()+dash+
    pad(d.getMonth()+1)+dash+
    pad(d.getDate());
  }

  function encryptCertificate(certificateNumber,idnumber){
    var code=idnumber+"|"+certificateNumber
    var encryptcode=aesEncrypt(code)
    return encryptcode;
  }
  
  function mapUncheckedCert(excelData,school){
        const  data=excelData[0].data;
        //从第九号行开始
        let certlist=[];
        data.forEach((item, index) => {
            if (index <= 7) {
              // 去除前8行
              return;
            } else {
              certlist.push({
                certificatenumber: item[0],
                name: item[1],
                studentnumber: item[2],
                idnumber: item[3],
                major: item[4],
                degreetype: item[5],
                graduationdate: item[6],
                school:school.name,
                school_id:school._id
              });
            }
        });
        return certlist;
  }

  function getSign(params){
    const secret=Config.sign_secret;
    let str = '';
    for (const k in params) {
      if (k=="sign" || k instanceof Array || k instanceof Object || params[k] === undefined) {
        continue;
      }
      if(str!='')str+="&";
      str+=k+"="+params[k];
    }
    str = encodeURI(`${ str }${ secret }`).toUpperCase();
    return md5(str).toUpperCase();
  }

//检查一个str是否是json字符串
function isJSON(str) {
  if (typeof str == 'string') {
      try {
          var obj=JSON.parse(str);
          if(typeof obj == 'object' && obj ){
              return true;
          }else{
              return false;
          }

      } catch(e) {
          console.log('error：'+str+'!!!'+e);
          return false;
      }
  }
  console.log('It is not a string!')
}

function picfilenameToUrl(filename){
  return Config.donainname+":3000/pic/"+filename;
}

module.exports={
    generateSafePassword:generateSafePassword,
    restful:restful,
    checkPassword:checkPassword,
    aesEncrypt:aesEncrypt,
    aesDecrypt:aesDecrypt,
    getClientIP:getClientIP,
    getDateStr:getDateStr,
    encryptCertificate:encryptCertificate,
    mapUncheckedCert:mapUncheckedCert,
    getSign:getSign,
    isJSON:isJSON,
    picfilenameToUrl:picfilenameToUrl
}