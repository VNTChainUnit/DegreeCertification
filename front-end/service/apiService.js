const schoolService = require('./schoolService');
const certificateCheckService = require('./certificateCheckService');
const utils = require('./utils');

async function checkSchoolSecret(appid,secret){
    let school = await schoolService.getSchoolById(appid);
    if(school){
        return school.appSecret==secret;
    }
    return false;
}

async function checkUploadActionParameter(data){
    return !utils.isAnyStrBlank(data.student_name,data.student_idnumber,data.student_idnumber
        ,data.student_degreeType,data.student_major,data.student_graduationDate,
        data.student_number,data.certificateNumber);
}

/**
 * 处理上传证书动作
 * @param {业务body} data 
 * @returns 
 */
async function handleUploadAction(data){
    let appid = data.appid;
    let secret = data.secret;
    if(await checkSchoolSecret(appid,secret)){
        if(await checkUploadActionParameter(data)){
            certificateCheckService.addUncheckedCertificate(appid,data.student_name,
                data.student_idnumber,data.student_degreeType,data.student_major,
                data.student_graduationDate,data.student_number,data.certificateNumber);
            return utils.restful(0,{result:true});
        }
        else{
            return utils.restful(25001,null,'Business parameters missing.');
        }
    }
    else{
        return utils.restful(40001,null,'Auth failed,please check your auth parameters.');
    }
}

module.exports={
    handleUploadAction:handleUploadAction
}