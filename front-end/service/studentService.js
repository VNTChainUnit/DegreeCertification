const  Student=require("../models/student")
const  utils=require('./utils') 
const  SmartContract=require("./blockchain/main");
const schoolService = require("./schoolService");
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
function register(name,studentnumber,username,password,school_id,school,idnumber){
    //先获取证书
    certificate_number=SmartContract.existCertificate(name,studentnumber,school,idnumber);
    //如果证书不存在,直接返回
    if (!certificate_number){
        return false;
    }
    student=new Student({
        name:name,
        studentnumber:studentnumber,
        username:rowdata.username,
        password:rowdata.password,
        certificate_number:certificate_number,
        school_id:school_id
    })
    student.save((err)=>{
        if(err){
            console.log(res);
            return false;
        }
        //学校加上这个id
        schoolService.addStudent(school_id,student._id);
        return true;
    })
}

//返回_id,不存在返回Null
function getId(username,type){

}

//返回bool,检查用户名是否重复
function checkUsername(username,type){

}

module.exports={
    login:login,
    register:register,
    getId:getId,
}