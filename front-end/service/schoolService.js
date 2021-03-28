const School=require('../models/school')
const utils=require('./utils')

function login(username,password){
    School.findOne({username:username},function(err,doc){
        if(err!=null){
            if(doc){
                if(utils.checkPassword(doc.password,password)){
                    return doc._id;
                }
            }
        }
            return false;
    })
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
module.exports={
    getSchoolByName:getSchoolByName,
    getSchoolById:getSchoolById,
    login:login,
    addStudent:addStudent,
    getAllSchool:getAllSchool,
    getSchoolByNameCode:getSchoolByNameCode,
    createSchool:createSchool,
    deleteSchool:deleteSchool
}