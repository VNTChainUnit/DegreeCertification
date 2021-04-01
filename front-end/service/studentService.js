const  Student=require("../models/student")
const  utils=require('./utils') 
const  SmartContract=require("./blockchain/main");
const schoolService = require("./schoolService");
const School = require("../models/school");
//返回bool

async function  login(username,password ){
     let res=await Student.findOne({username:username})
    if (res){
        if(utils.checkPassword(res.password,password)){
            return true;
        }
    }
    return false;
}

//
async function register(name,studentnumber,password,school_id,idnumber){
    //获取学校
   let school=await schoolService.getSchoolById(school_id)
    //确认证书存在
   let certificate_number=SmartContract.existCertificate(name,studentnumber,school.name,idnumber);
   let username=school.code+"_"+studentnumber
    //如果证书不存在,直接返回
    if (!certificate_number){
        return false;
    }
   let student=new Student({
        name:name,
        studentnumber:studentnumber,
        username:username,
        password:utils.generateSafePassword(password),
        certificate_number:certificate_number,
        school_id:school_id
    })
    //添加学生
    await student.save((err)=>{
        if(err){
            console.log(res);
            return false;
        }
    })
    //学校加上这个id
    schoolService.addStudent(school_id,student._id);
    return true;
}

//返回_id,不存在返回Null
function getId(username,type){

}

//返回bool,检查用户名是否重复
function checkUsername(username,type){

}

async function getById(student_id){
    return await Student.findById(student_id)
}

async function getByNameNumber(name,studentnumber,school_id){
    let filter={school_id:school_id}
    if(studentnumber){
        filter['studentnumber']=studentnumber
    }
    if(name){
        filter['name']=name
    }
    let student=await Student.find(filter)
    return student
}

async function getAll(school_id){
    let school= await schoolService.getSchoolById(school_id)
    let res=await Student.find({_id:{$in:school.student_ids}})
    return res
}

function changePassword(school_id,studentnumber,newpassword){
    let safePassword=utils.generateSafePassword(newpassword)
    Student.updateOne({studentnumber:studentnumber,school_id:school_id},{password:safePassword},(err,doc)=>{
        if(err){
            console.log(err)
        }
    })
}

function deleteOne(school_id,studentnumber){
    Student.deleteOne({school_id:school_id,studentnumber:studentnumber},(err,doc)=>{
        if(err){
            console.log(err)
        }
    })
}
async function getByUsername(username){
    return await Student.findOne({username:username})
}
module.exports={
    login:login,
    register:register,
    getId:getId,
    checkUsername:checkUsername,
    getByNameNumber:getByNameNumber,
    getAll:getAll,
    getById:getById,
    changePassword:changePassword,
    deleteOne:deleteOne,
    getByUsername:getByUsername
}