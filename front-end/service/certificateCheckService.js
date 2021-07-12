const CertificateCheck = require("../models/certificateCheck");
const schoolService = require('./schoolService');
const studentService=require('./studentService');
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
        school_id: school_id
    })
    uncheckedCert.save();
}

/**
 * 获取学生未核验证书
 * @param {学生id} student_id 
 * @param {学校id} school_id 
 */
async function getStudentUncheckCertificate(student_id,school_id) {
    const student=await studentService.getById(student_id)
    return await CertificateCheck.find({school_id:school_id,studentnumber:student.studentnumber});
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
    return await CertificateCheck.findById(check_id);
}

/**
 * 删除待核验证书
 * @param {证书id} check_id 
 */
function deleteUncheckedCertificate(check_id) {
    CertificateCheck.deleteOne({_id:check_id});
}

/**
 * 批量插入证书
 * @param {证书合集} certificatechecks 
 */
function addManyUncheckedCertificates(certificatechecks) {
    CertificateCheck.insertMany(certificatechecks);
}

module.exports = {
    addUncheckedCertificate: addUncheckedCertificate,
    getStudentUncheckCertificate: getStudentUncheckCertificate,
    editStudentUncheckCertificate: editStudentUncheckCertificate,
    listSchoolUncheckedCertificates: listSchoolUncheckedCertificates,
    checkCertificate: checkCertificate,
    deleteUncheckedCertificate: deleteUncheckedCertificate,
    addManyUncheckedCertificates: addManyUncheckedCertificates
}