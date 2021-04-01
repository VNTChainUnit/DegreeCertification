const Company =  require('../models/company')
const utils=require('./utils')

async function login(username,password){
   let company =await Company.findOne({username:username})
   //如果没查到说明账户名错误
   if(company==null){
       return false;
   }
    if(utils.checkPassword(company.password,password)){
        return true
    }
    else{
        return false
    }
}

async function getAll(){
    return await Company.find()
}

async function getByName(name){
    return await Company.findOne({name:name})
}

async function getById(id){
    return await Company.findById(id)
}

function deleteByName(name){
    Company.deleteMany({name:name},(err)=>{if(err)console.log(err)})
}

function createOne(name,username,password){
    company=new Company({
        name:name,
        username:username,
        password:utils.generateSafePassword(password)
    })
    company.save()
}

async function getByUsername(username){
    return await Company.findOne({username:username})
}

async function changePassword(username,oldpassword,newpassword){
    let company = await Company.findOne({username:username})
    //先找到账户
    if(company){
        //确认密码正确
        if(utils.checkPassword(company.password,oldpassword)){
            company.password=utils.generateSafePassword(newpassword)
            company.save()
            return true
        }
    }
    //否则直接修改失败
    return false
}

module.exports={
    login:login,
    getAll:getAll,
    getByName:getByName,
    deleteByName:deleteByName,
    createOne:createOne,
    getById:getById,
    getByUsername:getByUsername,
    changePassword:changePassword
}