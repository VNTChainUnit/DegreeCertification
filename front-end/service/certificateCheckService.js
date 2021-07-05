const CertificateCheck=require("../models/certificateCheck");
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
function addUncheckedCertificate(school_id,schoolname,name,idnumber,
    degreetype,major,graduationdate,studentnumber,certificatenumber){

}

/**
 * 获取学生未核验证书
 * @param {学生id} student_id 
 * @param {学校id} school_id 
 */
function getStudentUncheckCertificate(student_id){
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
function editStudentUncheckCertificate(check_id,schoolname,name,idnumber,
    degreetype,major,graduationdate,studentnumber,certificatenumber){
}

/**
 * 获取学校未核验证书
 * @param {学校id} school_id 
 */
function listSchoolUncheckedCertificates(school_id){
    
}

/**
 * 核验证书
 * @param {证书id} check_id 
 */
function checkCertificate(check_id){

}

/**
 * 删除待核验证书
 * @param {证书id} check_id 
 */
function deleteUncheckedCertificate(check_id){
    
}

/**
 * 批量插入证书
 * @param {证书合集} certificatechecks 
 */
function addManyUncheckedCertificates(certificatechecks){

}

module.exports={
    addUncheckedCertificate:addUncheckedCertificate,
    getStudentUncheckCertificate:getStudentUncheckCertificate,
    editStudentUncheckCertificate:editStudentUncheckCertificate,
    listSchoolUncheckedCertificates:listSchoolUncheckedCertificates,
    checkCertificate:checkCertificate,
    deleteUncheckedCertificate:deleteUncheckedCertificate,
    addManyUncheckedCertificates:addManyUncheckedCertificates
}