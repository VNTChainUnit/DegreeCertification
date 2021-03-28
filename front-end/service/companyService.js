const Company =  require('../models/company')
const utils=require('./utils')

function login(username,password){
    Company.findOne({username:username},function(err,doc){
        if(err!=false){
            if(doc){
                if(utils.checkPassword(doc.password,password)){
                    return doc._id;
                }
            }
        }
        //所有错误一并返回falsek
        return false;
    })
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
        password:password
    })
    company.save()
}
module.exports={
    login:login,
    getAll:getAll,
    getByName:getByName,
    deleteByName:deleteByName,
    createOne:createOne,
    getById:getById
}