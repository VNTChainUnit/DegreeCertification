const CertificateCheck = require("../models/certificateCheck");
const schoolService = require('./schoolService');
const studentService=require('./studentService');
const certificateService=require('./certificateService');
const utils=require('./utils');
const wxService = require("./wxService");

/**
 * 添加一个待核验证书
 * @param {学校id} school_id 
 * @param {学校名称} schoolname 
 * @param { 学生姓名} name 
 * @param {身份证号} idnumber 
 * @param {学位} degreetype 
 * @param {专业} major 
 * @param {毕业年月} graduationdate 
 * @param {学号} studentnumber 
 * @param {证书编号} certificatenumber 
 */
async function addUncheckedCertificate(school_id, schoolname, name, idnumber,
    degreetype, major, graduationdate, studentnumber, certificatenumber) {
    const school = await schoolService.getSchoolById(school_id);
    let uncheckedCert = CertificateCheck({
        school: school.name,
        idnumber: idnumber,
        degreetype: degreetype,
        major: major,
        graduationdate: graduationdate,
        studentnumber: studentnumber,
        certificatenumber: certificatenumber,
        school_id: school_id,
        name:name
    })
    uncheckedCert.save();
}

/**
 * 获取学生未核验证书
 * @param {学生id} student_id 
 * @param {学校id} school_id 
 */
async function getStudentUncheckCertificate(stu) {
    return await CertificateCheck.find({school_id:stu.school_id,studentnumber:stu.studentnumber});
}

/**
 * 修改待核验证书
 * @param {待核验证书id} check_id 
 * @param {学校名称} schoolname 
 * @param { 学生姓名} name 
 * @param {身份证号} idnumber 
 * @param {学位} degreetype 
 * @param {专业} major 
 * @param {毕业年月} graduationdate 
 * @param {学号} studentnumber 
 * @param {证书编号} certificatenumber 
 */
async function editStudentUncheckCertificate(check_id, schoolname, name, idnumber,
    degreetype, major, graduationdate, studentnumber, certificatenumber) {
        let uncheckedCert=await CertificateCheck.findById(check_id);
        if(!uncheckedCert)return false;
        uncheckedCert.school=schoolname;
        uncheckedCert.name=name;
        uncheckedCert.idnumber=idnumber;
        uncheckedCert.degreetype=degreetype;
        uncheckedCert.major=major;
        uncheckedCert.graduationdate=graduationdate;
        uncheckedCert.studentnumber=studentnumber;
        uncheckedCert.certificatenumber=certificatenumber;
        uncheckedCert.save();
        return true;
}

/**
 * 获取学校未核验证书
 * @param {学校id} school_id 
 */
async function listSchoolUncheckedCertificates(school_id) {
    return await CertificateCheck.find({school_id:school_id});
}

/**
 * 核验证书
 * @param {证书id} check_id 
 */
async function checkCertificate(check_id) {
    let cert=await CertificateCheck.findById(check_id);
    let res=await certificateService.addCertificate(cert.school,cert.name,cert.idnumber,cert.degreetype
        ,cert.major,cert.graduationdate,cert.studentnumber,cert.certificatenumber);
    if(res){
        //上传成功，删除已有的待核验证书
        deleteUncheckedCertificate(check_id);
        //同时添加wxqrcode
        let encryptContent= utils.encryptCertificate(cert.certificatenumber,cert.idnumber)
        wxService.saveWxQrcode(encryptContent);
    }
    return res;
}

/**
 * 删除待核验证书
 * @param {证书id} check_id 
 */
function deleteUncheckedCertificate(check_id) {
    CertificateCheck.deleteOne({_id:check_id},(err,doc)=>{
        if(err){
            console.log(err)
        }
    });
}

/**
 * 批量插入证书
 * @param {证书合集} certificatechecks 
 */
function addManyUncheckedCertificates(certificatechecks) {
    CertificateCheck.insertMany(certificatechecks);
}

/**
 * 注册时检查信息
 * @param {姓名} name 
 * @param {学号} studentnumber 
 * @param {学校名称} school_name 
 * @param {身份证号} idnumber 
 */
async function registerCheck(name,studentnumber,school_name,idnumber){
    let cert=await CertificateCheck.findOne({name:name,studentnumber:studentnumber,
        school:school_name,idnumber:idnumber})
        if(cert){return cert.certificatenumber}
        else return false;
}


module.exports = {
    addUncheckedCertificate: addUncheckedCertificate,
    getStudentUncheckCertificate: getStudentUncheckCertificate,
    editStudentUncheckCertificate: editStudentUncheckCertificate,
    listSchoolUncheckedCertificates: listSchoolUncheckedCertificates,
    checkCertificate: checkCertificate,
    deleteUncheckedCertificate: deleteUncheckedCertificate,
    addManyUncheckedCertificates: addManyUncheckedCertificates,
    registerCheck:registerCheck
}