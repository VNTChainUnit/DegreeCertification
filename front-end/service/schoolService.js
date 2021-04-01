const School=require('../models/school');
const studentService = require('./studentService');
const utils=require('./utils')

async function login(username,password){
    let school=await School.findOne({username:username})
    if(school==null)return false;
    if(utils.checkPassword(school.password,password)){
        return true;
    }
    else{
    return false;
    }
}

async function getSchoolByName(name){
    return await School.findOne({name:name});
}

async function getSchoolById(id){
    return await School.findById(id)
}

function addStudent(school_id,student_id){
    School.findByIdAndUpdate(school_id,{$push:{student_ids:student_id}},function(err){
        if(err){
            return false;
        }
        else return true;
    })
}

async function getAllSchool(){
    return await School.find()
}
async function getSchoolByNameCode(name,code){
    filters={}
    name=name.trim()
    code=code.trim()
    if (code!=""){
        filters['code']=code
    }
    if(name!=""){
        filters['name']=name
    }
    return await School.findOne(filters)
}

function createSchool(name,code,username,password){
    school=new School({
        name:name,
        code:code,
        username:username,
        password:utils.generateSafePassword(password)
    })
    school.save()
}

function deleteSchool(name){
    School.deleteMany({name:name},(err)=>{if(err)console.log(err)})
}

async function getSchoolByUsername(username){
    return await School.findOne({username:username});
}

async function removeStudent(school_id,student_id){
    School.updateOne({_id:school_id},{$pull:{student_ids:student_id}},(err)=>{
        if(err){
            console.log(err)
        }
    })
}

async function changePassword(username,oldpassword,newpassword){
    let school = await School.findOne({username:username})
    //先找到账户
    if(school){
        //确认密码正确
        if(utils.checkPassword(school.password,oldpassword)){
            school.password=utils.generateSafePassword(newpassword)
            school.save()
            return true
        }
    }
    //否则直接修改失败
    return false
}

module.exports={
    getSchoolByName:getSchoolByName,
    getSchoolById:getSchoolById,
    login:login,
    addStudent:addStudent,
    getAllSchool:getAllSchool,
    getSchoolByNameCode:getSchoolByNameCode,
    createSchool:createSchool,
    deleteSchool:deleteSchool,
    getSchoolByUsername:getSchoolByUsername,
    removeStudent:removeStudent,
    changePassword:changePassword
}